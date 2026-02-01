import type { Request, Response } from "express";

import { Router } from "express";
import z, { any } from 'zod';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import noadmailer from 'nodemailer';
import { AdminModel, FacultyModel, StudentModel, SubjectModel } from "./schema";
import crypto from 'crypto';
import { AdminMiddleware } from "./auth";



dotenv.config();

const JWT_ADMIN = process.env.JWT_ADMIN as string;

export const AdminRouter = Router();




const transporter = noadmailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }

});


AdminRouter.post('/signup', async (req: Request, res: Response) => {
  const requireBody = z.object({
    email: z.email(),
    password: z.string().min(8).max(20),
    username: z.string().min(1).max(50),
    secretkey: z.string()
  });

  const parseData = requireBody.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parseData.error
    })
  }

  const { email, password, username, secretkey } = req.body;

  const hassedPassword = await bcrypt.hash(password, 5);

  const otp = crypto.randomInt(100000, 999999).toString();



  try {
    await AdminModel.create({
      email: email,
      username: username,
      password: hassedPassword,
      secretkey: secretkey,
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
AdminRouter.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await AdminModel.findOne({ email });

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


AdminRouter.post('/signin', async (req: Request, res: Response) => {

  const requireBody = z.object({
    identifier: z.string(),
    password: z.string().min(8),
    secretkey: z.string()
  });

  const parseData = requireBody.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parseData.error
    });
  }




  const { identifier, password, secretkey } = req.body;

  const user = await AdminModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });
  if (!user || !user.password) {
    return res.status(403).json({
      message: "Incorrect Credentials !"
    });
  }
  if (secretkey !== user.secretkey) {
    return res.status(403).json({
      message: "wrong secret key!"
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
    }, JWT_ADMIN)

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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



AdminRouter.post('/add/student',AdminMiddleware, async (req: Request, res: Response) => {
  const requireBody = z.object({
    firstName: z.string(),
    lastName: z.string(),
    rollNo: z.number(),
    branch: z.string(),
    year: z.number(),
    batch: z.string(),
    email: z.email()
  });
  const parseData = requireBody.safeParse(req.body);
  if (!parseData.success) {
    return res.status(400).json({
      msg: "Error in adding student : " + parseData.error
    })
  }
  const { firstName, lastName, rollNo, branch, year, batch, email } = parseData.data;

  try {
    const response = await StudentModel.create({
      firstName,
      lastName,
      rollNo,
      branch,
      year,
      batch,
      email
    })
    res.status(200).json({
      msg: "Student created: " + response.firstName
    })
  } catch (e) {
    res.status(400).json({
      msg: "Eroor in catch adding student: " + e
    })
  }
})
AdminRouter.post('/add/subject', AdminMiddleware , async (req: Request, res: Response) => {
  const requireBody = z.object({
    name: z.string(),
    code: z.string(),
    year: z.number(),
    sem: z.number(),
    slot: z.number()
  })
  const parseData = requireBody.safeParse(req.body);
  if (!parseData.success) {
    return res.status(400).json({
      msg: "Error in adding student : " + parseData.error
    })
  }
  const { name, code, sem, year, slot } = parseData.data
  try {
    const response = await SubjectModel.create({
      name,
      code,
      sem,
      year,
      slot
    })
    res.status(200).json({
      msg: "Subject created: " + response
    })
  } catch (e) {
    res.status(400).json({
      msg: "Error in creating sunject: " + e
    })
  }
})

AdminRouter.post("/create/faculty",AdminMiddleware, async (req: Request, res: Response) => {
  const requireBody = z.object({
    email: z.email(),
    password: z.string().min(8).max(20),
    subject: z.string().array(),
    firstName: z.string(),
    lastName: z.string(),
    subjectId: z.string()
  });

  const parseData = requireBody.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parseData.error
    })
  }

  const { email, password, subject, firstName, lastName, subjectId } = req.body;

  const hassedPassword = await bcrypt.hash(password, 5);




  try {
    await FacultyModel.create({
      email: email,
      password: hassedPassword,
      subject: subject,
      firstName: firstName,
      lastName: lastName,
      subjectId: subjectId
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

AdminRouter.get('/get/students',AdminMiddleware, async (req: Request, res: Response) => {

  try {
    // MongoDB sorts by rollNo ascending
    const students = await StudentModel.aggregate([
      { $sort: { branch: 1, rollNo: 1 } },
      {
        $group: {
          _id: "$branch",
          students: { $push: "$$ROOT" }
        }
      }
    ]);


    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, msg: 'No students found for this branch' });
    }

    return res.status(200).json({ success: true, data: students });
  } catch (err: any) {
    console.error('Error in get student:', err);
    return res.status(500).json({ success: false, msg: 'Error in get student: ' + (err.message || err) });
  }
});
AdminRouter.get('/get/faculties', AdminMiddleware ,async (req: Request, res: Response) => {

  try {
    // MongoDB sorts by rollNo ascending
    const students = await FacultyModel.aggregate([
      { $sort: { name: 1 } },
      {
        $group: {
          _id: "$subject",
          faculties: { $push: "$$ROOT" }
        }
      }
    ]);


    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, msg: 'No students found for this branch' });
    }

    return res.status(200).json({ success: true, data: students });
  } catch (err: any) {
    console.error('Error in get student:', err);
    return res.status(500).json({ success: false, msg: 'Error in get student: ' + (err.message || err) });
  }
});


AdminRouter.get(
  "/students/attendance/:branch",AdminMiddleware,
  async (req: Request, res: Response) => {
    try {

      const cleanedBranch = String(req.params.branch || "").trim();



      if (!cleanedBranch) {
        return res.status(400).json({
          success: false,
          message: "Branch is required",
        });
      }


      //   if (!branch) {
      //     return res
      //       .status(400)
      //       .json({ success: false, message: "Branch is required" });
      //   }

      // ✅ Interfaces
      interface Subject {
        _id: string;
        name: string;
      }

      interface Attendance {
        studentId: string;
        subjectId: string;
        status: "present" | "absent";
        slot: number;
      }

      interface StudentWithAttendance {
        _id: string;
        firstName: string;
        lastName: string;
        rollNo: number;
        branch: string;
        attendance: Attendance[];
        subjects: Subject[];
      }

      const data: StudentWithAttendance[] = await StudentModel.aggregate([
        { $match: { branch: cleanedBranch } },

        {
          $lookup: {
            from: "attendances",
            localField: "_id",
            foreignField: "studentId",
            as: "attendance",
          },
        },

        {
          $lookup: {
            from: "subjects",
            localField: "attendance.subjectId",
            foreignField: "_id",
            as: "subjects",
          },
        },

        {
          $project: {
            firstName: 1,
            lastName: 1,
            rollNo: 1,
            branch: 1,
            attendance: 1,
            subjects: 1,
          },

        },
        {
          $sort: { rollNo: 1 }
        },
      ]);

      // ✅ SUBJECT-WISE + PERCENTAGE CALCULATION
      const finalData = data.map((student) => {
        let totalPresent = 0;
        const totalLectures = student.attendance.length;

        const subjectWise = student.subjects.map((subject) => {
          const subjectAttendance = student.attendance.filter(
            (a) => a.subjectId.toString() === subject._id.toString()
          );

          const presentCount = subjectAttendance.filter(
            (a) => a.status === "present"
          ).length;

          // ✅ TOTAL PRESENT UPDATE
          totalPresent += presentCount;

          return {
            subjectId: subject._id,
            subjectName: subject.name,
            presentCount,
            totalLectures: subjectAttendance.length,
          };
        });

        const percentage =
          totalLectures === 0
            ? 0
            : Math.round((totalPresent / totalLectures) * 100);

        return {
          studentId: student._id,
          rollNo: student.rollNo,
          name: `${student.firstName} ${student.lastName}`,
          branch: student.branch,
          subjects: subjectWise,
          totalLectures,
          totalPresent,
          percentage,
        };
      });

      return res.status(200).json({ success: true, data: finalData });
    } catch (error) {
      console.error("Admin Attendance Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  }
);
