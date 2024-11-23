import nodemailer from 'nodemailer';
import 'dotenv/config';
import { asyncHandler } from './asyncHandler.js';

const sendMail = async (options) => {
    // Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services as needed
    auth: {
      user: process.env.EMAIL_USERNAME, // Your email address
      pass: process.env.EMAIL_PASSWORD  // Your email password or app-specific password
    }
  });

//   console.log("user: ",transporter.auth.user, "password: ", transporter.auth.pass );
  
  
  // Set up email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,          // Sender's email address
    to: options.email,       // Recipient's email address
    subject: options.subject,
    text: options.text // Email body
  };
  
  // Send the email
  transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent:', info.response);
    })
    .catch(error => {
      console.log('Error occurred:', error.message);
    });
}

export {sendMail}

