import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.js";
import uploadFile from "../utils/fileUploader.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(500, "Something went wrong")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    //get users details...
    const { fullname, email, username, password } = req.body;


    //validation of provided information
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullname || fullname.trim() === "") {
        throw new ApiError(400, "Fullname is required");
    }
    if (!email || email.trim() === "" || !emailRegex.test(email.trim())) {
        throw new ApiError(400, "Invalid or missing email");
    }
    if (!username || username.trim() === "") {
        throw new ApiError(400, "Username is required");
    }
    if (!password || password.trim() === "") {
        throw new ApiError(400, "Password is required");
    }

    // verifying whether is user already exists
    const userExist = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userExist) {
        throw new ApiError(404, "already exists")
    }

    // check whether media is given or not by the users
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path

    }
    if (!avatarLocalPath) {
        throw new ApiError(408, "Please upload valid image")
    }
    //upload them to cloudinary
    const avatar = await uploadFile(avatarLocalPath);
    const coverImage = await uploadFile(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(404, "Avatar file is required")
    }
    //create  user object -- create entry in database
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })
    // remove password and refresh token from json response 
    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    // check whether user is created or not 

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user ")
    }
    //return response.
    return res.status(200).json(
        new ApiResponse(200, createdUser, "Successfully registered")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //get data of user
    const { username, email, password } = req.body

    //check whether user is register or not
    if (!username && !email) {
        throw new ApiError(404, "username or email is required")
    }
    //find the user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "User not exists")
    }

    //password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(409, "Password incorrect")
    }
    //generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    const userLoggedIn = await User.findById(user._id).select("-password -refreshToken")

    //send tokens in form of cookies
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(
            200,
            {
                user: userLoggedIn, accessToken, refreshToken,
            },
            "User logged In Successfully"
        )
    )
})

const loggedOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(
            200,
            {},
            "User logged out"
        )
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized Request")
        }
        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expired or used")
        }


        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(new ApiResponse(
            200,
            {
                accessToken,
                refreshToken: newRefreshToken
            },
            "Access Token Refreshed"
        ))


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid  old Password")
    }
    user.password = newPassword;
    if (newPassword !== confirmPassword) {
        throw new ApiError(401, "Password not match with confirm Password")
    }
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(
        200,
        {

        },
        "Password Changed Successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname && !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(
        req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password ")

    return res.status(200).json(new ApiResponse(200, { user }, "Account Details are Updated Successfully"))

})

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is Missing")
    }
    const avatar = await uploadFile(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on Avatar")
    }
    const updatedAvatar = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(200, { updatedAvatar }, "avatar updated successfully ")
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image  file is Missing")
    }
    const coverImage = await uploadFile(coverImageLocalPath);

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on cover Image ")
    }
    const updatedCoverImage = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(200, { updatedCoverImage }, "cover Image  updated successfully ")
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim()) {
        throw new ApiError(400, "username is missing ")
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError(404, "channel doesn't exists")
    }
    return res.status(200).json(new ApiResponse(200, channel[0], "user channel fetched successfully"))
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1,

                                    }
                                },
                                {
                                    $addFields: {
                                        owner: {
                                            $first: "$owner"
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }

        }
    ])

    return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully"))
})

export { registerUser, loginUser, loggedOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, getUserChannelProfile, getWatchHistory };