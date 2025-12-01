"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_js_1 = require("./db.js");
const facultylogin_js_1 = require("./facultylogin.js");
const nodemailer_1 = __importDefault(require("nodemailer"));
// import bcrypt from 'bcryptjs'npm 
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_js_1.connectDB)();
app.use('/api/faculty', facultylogin_js_1.facultyRouter);
app.get("/", (req, res) => {
    res.json({ message: "Backend running!" });
});
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
// app.post('/signup', async (req: Request, res: Response) => {
//     const requireBody = z.object({
//       email: z.email(),
//         password: z.string().min(8).max(20),
//         username: z.string().min(1).max(50)
//     });
//     const parseData = requireBody.safeParse(req.body);
//     if (!parseData.success) {
//         return res.status(400).json({
//             message: "Incorrect Format",
//             error: parseData.error
//         })
//     }
//     const { email, password, username } = req.body;
//     const hassedPassword = await bcrypt.hash(password, 5);
//     const otp = crypto.randomInt(100000, 999999).toString();
//     try {
//         await FacultyModel.create({
//             email: email,
//             username: username,
//             password: hassedPassword,
//             otp,
//             otpExpiry: Date.now() + 5 * 60 * 1000
//         })
//     } catch (e) {
//         res.status(403).json({
//             msg: "user already exists",
//         })
//         console.log("error is --: ", e)
//     }
//     await transporter.sendMail({
//         from: "samxpatel2@gmail.com",
//         to: email,
//         subject: "Verify your Email",
//         text: `Your OTP is ${otp}`
//     });
//     res.status(200).json({
//         msg: "User created successfully!"
//     })
// });
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
