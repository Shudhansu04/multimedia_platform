import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import uploadFile from "../utils/fileUploader.js";
import ApiResponse from "../utils/ApiResponse.js";




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
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(408, "Please upload valid image")
    }
    //upload them to cloudinary
    const avatar = await upload(avatarLocalPath);
    const coverImage = await upload(coverImageLocalPath)

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
        new ApiResponse(200,createdUser , "Successfully registered")
     )
})

export default registerUser;