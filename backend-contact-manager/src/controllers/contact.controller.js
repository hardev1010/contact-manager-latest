import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Contact } from "../models/contact.model.js"

const createContact = asyncHandler(async (req, res) => {
    console.log("into create contact");
    
    const {name, phone, email, address} = req.body

    if(!(name || phone || email || address)){
        throw new ApiError(400, "All fields are required")
    }

    const imageLocalPath = req.file?.path
    console.log("this is image path :-", req.body);
    

    if(!imageLocalPath){
        throw new ApiError(400, "image file is required")
    }

    const image = await uploadOnCloudinary(imageLocalPath)
    // console.log("this is image",image.url);
    

    if(!image){
        throw new ApiError(400, "image file is required")
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        address,
        image: image.url || null,
        userId: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        contact,
        "contact created successfully"
    ))
})

const getContact  = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if(!contact){
        throw new ApiError(404, "contact not found")
    }
    // console.log(contact.name);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        contact,
        "contact fetched successfully"
    ))
    
})

const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ userId: req.user._id })

    // console.log("contacts:- ",contacts , req.user._id);
    

    return res.status(200).json(new ApiResponse(
        200, contacts, "contacts fetched successfully"
    ))
})

const updateContact = asyncHandler(async (req, res) => {
    console.log("into update contacts");
    
    const {id} = req.params
    console.log(req.params.id);
    
    const {name, email, phone, address, image} = req.body

    // const imageLocalPath = req.file?.path

    // if (!imageLocalPath) {
    //     throw new ApiError(400, "image file is missing")
    // }

    // //TODO: delete old image - assignment

    // image = await uploadOnCloudinary(imageLocalPath)

    // if (!image.url) {
    //     throw new ApiError(400, "Error while uploading on image")
        
    // }

    console.log("updating contact---", req.body, name);
    
    const contact = await Contact.findByIdAndUpdate(req.params.id, 
        {
            $set: {
                name,
                email,
                phone,
                address
                // image
            }
        },
        {new: true}
    )

    console.log("updated===");
    
    if(!contact){
        throw new ApiError(404, "contact not found")
    }

    return res.status(200).json(new ApiResponse(
        200, contact, "contact updated successfully"
    ))
})

//update image
const updateContactImage = asyncHandler(async(req, res) => {
    const imageLocalPath = req.file?.path

    if (!imageLocalPath) {
        throw new ApiError(400, "image file is missing")
    }

    //TODO: delete old image - assignment

    const image = await uploadOnCloudinary(imageLocalPath)

    if (!image.url) {
        throw new ApiError(400, "Error while uploading on image")
        
    }

    const contact = await Contact.findByIdAndUpdate(
        req.params?.id,
        {
            $set:{
                image: image.url
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200, contact, "Avatar image updated successfully")
    )
})

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if(!contact){
        throw new ApiError(404, "contact not found")
    }

    // await contact.remove()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Contact removed successfully"))
})

export {
    createContact,
    getContact,
    getAllContacts,
    updateContact,
    deleteContact,
    updateContactImage
}