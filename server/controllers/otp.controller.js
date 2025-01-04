import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../models/user.model.js'; 

// Generate OTP function
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

// Send OTP to user's email
export const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email?" });

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Store OTP and expiration time in the database (to verify later)
    await User.findOneAndUpdate({ email }, { otp, otpExpires });

    // Create a transporter for sending email
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // email address
            pass: process.env.EMAIL_PASS, // email password
        }
    });

    // Email message setup
    const mailOptions = {
        from: 'no-reply@unimart.com',
        to: email,
        subject: 'Verify Your Email Address : Unimart',
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
        <p>Thank you for registering with UniMart!</p>
        <p>Your OTP code is:</p>
        <h1 style="color: #333;">${otp}</h1>
        <p style="color: #888;">This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,</p>
        <p>The UniMart Team</p>
        </div>
    `,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending OTP email.' });
    }
};

// Verify OTP entered by the user
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    // Find the user by email and check if OTP exists and hasn't expired
    const user = await User.findOne({ email }).select('+otp');

    if (!user) {
        return res.status(400).json({ message: 'User not found!' });
    }

    if (user.otp !== otp.toString()) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (Date.now() > user.otpExpires) {
        return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // OTP is valid, proceed with email verification
    user.isEmailVerified = true; // Assuming you have an `isVerified` field for the user
    user.otp = null; // Clear OTP after successful verification
    user.otpExpires = null; // Clear OTP expiration time
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully!', user: user });
};
