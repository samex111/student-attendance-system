import type { Request, Response } from "express";
import { Router } from "express";
import z from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import noadmailer from 'nodemailer';
import { facultyMiddleware } from "./auth.js";
import { FacultyModel } from "./schema.js";
import crypto from 'crypto';



dotenv.config();

const JWT_USER = process.env.JWT_FACULTY as string;

export const facultyRouter = Router();




const transporter = noadmailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }

});


facultyRouter.post('/signup', async (req: Request, res: Response) => {
    const requireBody = z.object({
      email: z.email(),
        password: z.string().min(8).max(20),
        subject: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        username: z.string().min(1).max(50)
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        })
    }

    const { email, password, username , subject , firstName , lastName} = req.body;

    const hassedPassword = await bcrypt.hash(password, 5);

    const otp = crypto.randomInt(100000, 999999).toString();



    try {
        await FacultyModel.create({
            email: email,
            username: username,
            password: hassedPassword,
            subject:subject,
            firstName:firstName,
            lastName:lastName,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        })

    } catch (e) {
        res.status(403).json({
            msg: "user already exists",

        })
        console.log("error is --: ", e)
    }

    await transporter.sendMail({
        from: "samxpatel2@gmail.com",
        to: email,
        subject: "Verify your Email",
        text: `Your OTP is ${otp}`
    });

    res.status(200).json({
        msg: "User created successfully!"
    })

});
facultyRouter.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;

    const user = await FacultyModel.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    //   if(user.isVerified === false){
    //     return res.status(400).json({ message: "User not varified" });
    //   }
    if (user.otp !== otp) {
        await user.deleteOne();
        return res.status(400).json({ message: "Invalid OTP" });
    }
    // @ts-ignore
    if (Date.now() > user.otpExpiry) {
        user.deleteOne(email);
        return res.status(400).json({ message: "OTP expired" });

    }


    user.isVerified = true;
    user.otp = null; // OTP clear
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email verified successfully!" });
});


facultyRouter.post('/signin', async (req: Request, res: Response) => {

    const requireBody = z.object({
        identifire: z.string(),
        password: z.string().min(8)
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }



    const { identifire, password } = req.body;

    const user = await FacultyModel.findOne({ $or: [{ username: identifire }, { email: identifire }] });
    if (!user || !user.password) {
        return res.status(403).json({
            message: "Incorrect Credentials !"
        });
    }
    if (user.isVerified == false) {
        return res.status(403).json({
            message: "user not varified !"
        });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id
        }, JWT_USER)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        })
        console.log("cookie: ", token)
        res.json({ studentId: user._id });
    }
    else {
        // If the password does not match, return a error indicating the invalid credentials
        res.status(403).json({
            // Error message for failed password comparison
            message: "Invalid credentials!"
        })
    }
})
facultyRouter.post('/attandance')