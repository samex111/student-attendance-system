import type { Request, Response } from "express";
import { Router } from "express";
import z from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { facultyMiddleware } from "./auth";
import { AttendanceModel, FacultyModel, StudentModel } from "./schema";
import crypto from 'crypto';
 


dotenv.config();

const JWT_FACULTY = process.env.JWT_FACULTY as string;

export const facultyRouter = Router();







// facultyRouter.post('/signup',  async (req: Request, res: Response) => {
//     const requireBody = z.object({
//         email: z.email(),
//         password: z.string().min(8).max(20),
//         subject: z.string().array(),
//         firstName: z.string(),
//         lastName: z.string(),
//     });

//     const parseData = requireBody.safeParse(req.body);

//     if (!parseData.success) {
//         return res.status(400).json({
//             message: "Incorrect Format",
//             error: parseData.error
//         })
//     }

//     const { email, password, subject , firstName , lastName} = req.body;

//     const hassedPassword = await bcrypt.hash(password, 5);

//     const otp = crypto.randomInt(100000, 999999).toString();



//     try {
//         await FacultyModel.create({
//             email: email,
//             password: hassedPassword,
//             subject:subject,
//             firstName:firstName,
//             lastName:lastName,
          
//         })

//     } catch (e) {
//         res.status(403).json({
//             msg: "user already exists",

//         })
//         console.log("error is --: ", e)
//     }

//     res.status(200).json({
//         msg: "User created successfully!"
//     })

// });



facultyRouter.post('/signin', async (req: Request, res: Response) => {

    const requireBody = z.object({
        email: z.string(),
        password: z.string().min(8)
    });

    const parseData = requireBody.safeParse(req.body);

    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }



    const { email, password } = parseData.data;

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
        res.json({ studentId: user._id , subjectId:user.subjectId});
    }
    else {
        // If the password does not match, return a error indicating the invalid credentials
        res.status(403).json({
            // Error message for failed password comparison
            message: "Invalid credentials!"
        })
    }
})


facultyRouter.get('/get/student/:branch', facultyMiddleware,async (req: Request, res: Response) => {
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


facultyRouter.post("/attendance",facultyMiddleware,async (req: Request, res: Response) => {

    const requireBody = z.object({
      attendance: z.array(
        z.object({
          studentId: z.string().min(1),
          subjectId: z.string().min(1),
          status: z.enum(["present", "absent"]),
          slot: z.number()
        })
      )
    });

    const parsedData = requireBody.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance format",
        error: parsedData.error
      });
    }

    const { attendance } = parsedData.data;

    try {
      // ✅ OPTIONAL: Same day duplicate filter (extra safety)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredAttendance = [];

      for (let record of attendance) {
        const alreadyExists = await AttendanceModel.findOne({
          studentId: record.studentId,
          subjectId: record.subjectId,
          slot: record.slot,
          createdAt: { $gte: today }
        });

        if (!alreadyExists) {
          filteredAttendance.push(record);
        }
      }

      if (filteredAttendance.length === 0) {
        return res.status(409).json({
          success: false,
          message: "Attendance already marked for today"
        });
      }

      const response = await AttendanceModel.insertMany(filteredAttendance);

      res.status(200).json({
        success: true,
        message: "Attendance saved successfully",
        inserted: response.length,
        data: response
      });

    } catch (e:any) {
      // ✅ Mongo duplicate key error
      if (e.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate attendance detected"
        });
      }

      res.status(500).json({
        success: false,
        message: "Error in posting attendance: " + e.message
      });
    }
  }
);
