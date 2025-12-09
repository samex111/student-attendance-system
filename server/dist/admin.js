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
exports.AdminRouter = void 0;
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const schema_js_1 = require("./schema.js");
const crypto_1 = __importDefault(require("crypto"));
const auth_js_1 = require("./auth.js");
dotenv_1.default.config();
const JWT_ADMIN = process.env.JWT_ADMIN;
exports.AdminRouter = (0, express_1.Router)();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});
exports.AdminRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        email: zod_1.default.email(),
        password: zod_1.default.string().min(8).max(20),
        username: zod_1.default.string().min(1).max(50),
        secretkey: zod_1.default.string()
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }
    const { email, password, username, secretkey } = req.body;
    const hassedPassword = yield bcryptjs_1.default.hash(password, 5);
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    try {
        yield schema_js_1.AdminModel.create({
            email: email,
            username: username,
            password: hassedPassword,
            secretkey: secretkey,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
        });
    }
    catch (e) {
        res.status(403).json({
            msg: "user already exists",
        });
        console.log("error is --: ", e);
    }
    yield transporter.sendMail({
        from: "samxpatel2@gmail.com",
        to: email,
        subject: "Verify your Email",
        text: `Your OTP is ${otp}`
    });
    res.status(200).json({
        msg: "User created successfully!"
    });
}));
exports.AdminRouter.post("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield schema_js_1.AdminModel.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "User not found" });
    //   if(user.isVerified === false){
    //     return res.status(400).json({ message: "User not varified" });
    //   }
    if (user.otp !== otp) {
        yield user.deleteOne();
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
    yield user.save();
    res.json({ message: "Email verified successfully!" });
}));
exports.AdminRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        identifier: zod_1.default.string(),
        password: zod_1.default.string().min(8),
        secretkey: zod_1.default.string()
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }
    const { identifier, password, secretkey } = req.body;
    const user = yield schema_js_1.AdminModel.findOne({ $or: [{ username: identifier }, { email: identifier }] });
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
    const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (passwordMatch) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id
        }, JWT_ADMIN);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        });
        console.log("cookie: ", token);
        res.json({ studentId: user._id });
    }
    else {
        // If the password does not match, return a error indicating the invalid credentials
        res.status(403).json({
            // Error message for failed password comparison
            message: "Invalid credentials!"
        });
    }
}));
exports.AdminRouter.post('/add/student', auth_js_1.AdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        firstName: zod_1.default.string(),
        lastName: zod_1.default.string(),
        rollNo: zod_1.default.number(),
        branch: zod_1.default.string(),
        year: zod_1.default.number(),
        batch: zod_1.default.string(),
        email: zod_1.default.email()
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            msg: "Error in adding student : " + parseData.error
        });
    }
    const { firstName, lastName, rollNo, branch, year, batch, email } = parseData.data;
    try {
        const response = yield schema_js_1.StudentModel.create({
            firstName,
            lastName,
            rollNo,
            branch,
            year,
            batch,
            email
        });
        res.status(200).json({
            msg: "Student created: " + response.firstName
        });
    }
    catch (e) {
        res.status(400).json({
            msg: "Eroor in catch adding student: " + e
        });
    }
}));
exports.AdminRouter.post('/add/subject', auth_js_1.AdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        name: zod_1.default.string(),
        code: zod_1.default.string(),
        year: zod_1.default.number(),
        sem: zod_1.default.number(),
        slot: zod_1.default.number()
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            msg: "Error in adding student : " + parseData.error
        });
    }
    const { name, code, sem, year, slot } = parseData.data;
    try {
        const response = yield schema_js_1.SubjectModel.create({
            name,
            code,
            sem,
            year,
            slot
        });
        res.status(200).json({
            msg: "Subject created: " + response
        });
    }
    catch (e) {
        res.status(400).json({
            msg: "Error in creating sunject: " + e
        });
    }
}));
exports.AdminRouter.post("/create/faculty", auth_js_1.AdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        email: zod_1.default.email(),
        password: zod_1.default.string().min(8).max(20),
        subject: zod_1.default.string().array(),
        firstName: zod_1.default.string(),
        lastName: zod_1.default.string(),
        subjectId: zod_1.default.string()
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }
    const { email, password, subject, firstName, lastName, subjectId } = req.body;
    const hassedPassword = yield bcryptjs_1.default.hash(password, 5);
    try {
        yield schema_js_1.FacultyModel.create({
            email: email,
            password: hassedPassword,
            subject: subject,
            firstName: firstName,
            lastName: lastName,
            subjectId: subjectId
        });
    }
    catch (e) {
        res.status(403).json({
            msg: "user already exists",
        });
        console.log("error is --: ", e);
    }
    res.status(200).json({
        msg: "User created successfully!"
    });
}));
exports.AdminRouter.get('/get/students', auth_js_1.AdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // MongoDB sorts by rollNo ascending
        const students = yield schema_js_1.StudentModel.aggregate([
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
    }
    catch (err) {
        console.error('Error in get student:', err);
        return res.status(500).json({ success: false, msg: 'Error in get student: ' + (err.message || err) });
    }
}));
exports.AdminRouter.get('/get/faculties', auth_js_1.AdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // MongoDB sorts by rollNo ascending
        const students = yield schema_js_1.FacultyModel.aggregate([
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
    }
    catch (err) {
        console.error('Error in get student:', err);
        return res.status(500).json({ success: false, msg: 'Error in get student: ' + (err.message || err) });
    }
}));
exports.AdminRouter.get("/students/attendance/:branch", auth_js_1.AdminMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cleanedBranch = String(req.params.branch || "").trim();
        if (!cleanedBranch) {
            return res.status(400).json({
                success: false,
                message: "Branch is required",
            });
        }
        const data = yield schema_js_1.StudentModel.aggregate([
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
                const subjectAttendance = student.attendance.filter((a) => a.subjectId.toString() === subject._id.toString());
                const presentCount = subjectAttendance.filter((a) => a.status === "present").length;
                // ✅ TOTAL PRESENT UPDATE
                totalPresent += presentCount;
                return {
                    subjectId: subject._id,
                    subjectName: subject.name,
                    presentCount,
                    totalLectures: subjectAttendance.length,
                };
            });
            const percentage = totalLectures === 0
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
    }
    catch (error) {
        console.error("Admin Attendance Error:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
}));
