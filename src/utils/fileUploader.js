import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadFile = async function (path) {
    try {
        if (!path) return null;
        const result = await cloudinary.uploader.upload(path, {
            public_id: "uploaded_image" + Date.now(),
            resource_type: "auto"
        })
        fs.unlinkSync(path)
        return result;

    } catch (error) {
        fs.unlinkSync(path);
        console.log("error", error);
        throw error;
    }
}

export default uploadFile;