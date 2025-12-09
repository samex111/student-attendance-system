"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRouter = void 0;
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_js_1 = require("./auth.js");
const schema_js_1 = require("./schema.js");
dotenv_1.default.config();
const JWT_FACULTY = process.env.JWT_FACULTY;
exports.facultyRouter = (0, express_1.Router)();
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
exports.facultyRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        email: zod_1.default.string(),
        password: zod_1.default.string().min(8)
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }
    const { email, password } = req.body;
    const user = yield schema_js_1.FacultyModel.findOne({ email });
    if (!user || !user.password) {
        return res.status(403).json({
            message: "Incorrect Credentials !"
        });
    }
    const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (passwordMatch) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, JWT_FACULTY);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        });
        console.log("cookie: ", token);
        res.json({ studentId: user._id, subjectId: user.subjectId });
    }
    else {
        // If the password does not match, return a error indicating the invalid credentials
        res.status(403).json({
            // Error message for failed password comparison
            message: "Invalid credentials!"
        });
    }
}));
exports.facultyRouter.get('/get/student/:branch', auth_js_1.facultyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { branch } = req.params;
    try {
        // MongoDB sorts by rollNo ascending
        const students = yield schema_js_1.StudentModel.find({ branch }).sort({ rollNo: 1 });
        if (!students || students.length === 0) {
            return res.status(404).json({ success: false, msg: 'No students found for this branch' });
        }
        return res.status(200).json({ success: true, data: students });
    }
    catch (err) {
        console.error('Error in get student:', err);
        return res.status(500).json({ success: false, msg: 'Error in get student: ' + (err.message || err) });
    }
}));
exports.facultyRouter.post("/attendance", auth_js_1.facultyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        attendance: zod_1.default.array(zod_1.default.object({
            studentId: zod_1.default.string().min(1),
            subjectId: zod_1.default.string().min(1),
            status: zod_1.default.enum(["present", "absent"]),
            slot: zod_1.default.number()
        }))
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
            const alreadyExists = yield schema_js_1.AttendanceModel.findOne({
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
        const response = yield schema_js_1.AttendanceModel.insertMany(filteredAttendance);
        res.status(200).json({
            success: true,
            message: "Attendance saved successfully",
            inserted: response.length,
            data: response
        });
    }
    catch (e) {
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
}));
