import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import 'dotenv/config'


// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
})

// Upload a file
const uploadOnCloudinary = async (localFilePath) => {
  try {
    // console.log("Configured cloud_name:", cloudinary.config().cloud_name);
    // console.log("Configured api_key:", cloudinary.config().api_key);
    // console.log("Configured api_secret:", cloudinary.config().api_secret);

    
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    console.log("file has been uploaded on cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("error uploading file on cloudinary",error.message);
    
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

 export  {uploadOnCloudinary}