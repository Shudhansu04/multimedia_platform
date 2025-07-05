import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET
    });

const uploadFile = async function(path){
   try {
    if(!path)return null;
     const result = await cloudinary.v2.uploader.upload(path,{
        public_id:"uploaded_image"+Date.now(),
        resource_type:"auto"
    })
    console.log("Success",result.secure_url);
    return result;

   } catch (error) {
    fs.unlinkSync(path);
    console.log("error",error);
    throw error;
   }
}

export default  uploadFile;