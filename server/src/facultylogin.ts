import type { Request, Response } from "express";
import { Router } from "express";
import z from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { facultyMiddleware } from "./auth.js";
import { AttendanceModel, FacultyModel, StudentModel } from "./schema.js";
import crypto from 'crypto';



dotenv.config();

const JWT_FACULTY = process.env.JWT_FACULTY as string;

export const facultyRouter = Router();







facultyRouter.post('/signup', async (req: Request, res: Response) => {
    const requireBody = z.object({
        email: z.email(),
        password: z.string().min(8).max(20),
        subject: z.string().array(),
        firstName: z.string(),
        lastName: z.string(),
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        })
    }

    const { email, password, subject , firstName , lastName} = req.body;

    const hassedPassword = await bcrypt.hash(password, 5);

    const otp = crypto.randomInt(100000, 999999).toString();



    try {
        await FacultyModel.create({
            email: email,
            password: hassedPassword,
            subject:subject,
            firstName:firstName,
            lastName:lastName,
          
        })

    } catch (e) {
        res.status(403).json({
            msg: "user already exists",

        })
        console.log("error is --: ", e)
    }

    res.status(200).json({
        msg: "User created successfully!"
    })

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



    const { email, password } = req.body;

    const user = await FacultyModel.findOne({email});
    if (!user || !user.password) {
        return res.status(403).json({
            message: "Incorrect Credentials !"
        });
    }
   


    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        const token = jwt.sign({
            id: user._id
        }, JWT_FACULTY)

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


facultyRouter.get('/get/student/:branch', async (req: Request, res: Response) => {
  const { branch } = req.params;

  try {
    // MongoDB sorts by rollNo ascending
    const students = await StudentModel.find({ branch }).sort({ rollNo: 1 });

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, msg: 'No students found for this branch' });
    }

    return res.status(200).json({ success: true, data: students });
  } catch (err: any) {
    console.error('Error in get student:', err);
    return res.status(500).json({ success: false, msg: 'Error in get student: ' + (err.message || err) });
  }
});




facultyRouter.post('/attendance',facultyMiddleware, async(req:Request, res:Response)=>{
    
    const requireBody = z.object({
        studentId : z.string(),
        subjectId: z.string(),
        status:  z.enum(["present","absent"])
    }); 
    const parsedData = requireBody.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parsedData.error
        });
    }
    const {studentId , subjectId , status} = parsedData.data;

    try{
        const response = await AttendanceModel.create({
            studentId,
            subjectId,
            status
        }) 

        res.status(200).json({
            response
        })
    }catch(e){
        res.status(404).json({
            msg:"error in posting attandance: "+e
        })
    }

})
