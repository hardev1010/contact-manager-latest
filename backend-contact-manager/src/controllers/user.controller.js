import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendMail } from "../utils/nodeMailer.js"

//kept global bcz multiple use in cookies
const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        console.log("generating tokens");
        
        const user = await User.findById(userId)
        // console.log(user);
        

        const accessToken = user.generateAccessToken()

        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    console.log("registerring user");
    
    console.log("going to req.body",req.body);
    
    const {name, email, password} = req.body
// console.log("body aa gyi",req.body);

    if(!(name || email || password)){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(409, "user with email already exists")
    }

    //image upload for testing cloudinary
    // const avatarLocalPath = req.file?.path    //excess from multer

    // // const coverImageLocalPath = req.files?.coverImage[0].path
    // console.log("avtarLocalPath:  --  ",avatarLocalPath);
    
   
    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required");
    // }

    // const avatar = await uploadOnCloudinary(avatarLocalPath)
    // // console.log("avatar---   ", avatar);
    

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required");
    // }


    const user = await User.create({
        name,
        // pic: avatar.url,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    )

})

const loginUser = asyncHandler(async (req, res) => {
    console.log("logging in user");
    
    console.log("going to req.body",req.body);
    
    const {email, password} = req.body

    if (!(email || password)){
        throw new ApiError(400, "email or password is required")
    }

    const user = await User.findOne({email})
    // console.log("user ka naam", user.name);
    
    if (!user){
        throw new ApiError(404, "user doesn't exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "invalid password")
    }

    // console.log("user ka id",user._id.toString());

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged In successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    console.log("logging out user");
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
        200,
        {},
        "user logged out"
    ))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "refresh token is expired or used")
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "Access token refreshed"
            )
        )

    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token")
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body
    console.log(req.body, "this is mail", email);
    

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(400, `user with email: ${email} not registered`)
    }

    const options = {
        to: email,
        subject: "Reset Password",
        text: `http://localhost:5173/reset-password/${user?._id}`
    }

    sendMail(options)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        `Reset Password link sent to ${email} successfully`
    ))
})

const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body

    const user = await User.findByIdAndUpdate(req.params.id, 
        {
            $set: {
                password
            }
        },
        {new: true}
    )

    return res.status(200)
    .json(new ApiResponse(
        200,
        user,
        "reset password successfully"
    ))

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changed successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    console.log("getting current user");
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "current user fetched successfuly"
    ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    console.log("updating user details");
    
    const {name, email} = req.body

    console.log("update user", req.body);
    

    if (!name || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name,
                email
            }
        },
        {new: true}
        
    ).select("-password")

    console.log("updated");
    

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    forgotPassword,
    resetPassword,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}