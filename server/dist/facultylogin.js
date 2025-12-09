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
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const JWT_FACULTY = process.env.JWT_FACULTY;
exports.facultyRouter = (0, express_1.Router)();
exports.facultyRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        email: zod_1.default.email(),
        password: zod_1.default.string().min(8).max(20),
        subject: zod_1.default.string().array(),
        firstName: zod_1.default.string(),
        lastName: zod_1.default.string(),
    });
    const parseData = requireBody.safeParse(req.body);
    if (!parseData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parseData.error
        });
    }
    const { email, password, subject, firstName, lastName } = req.body;
    const hassedPassword = yield bcryptjs_1.default.hash(password, 5);
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    try {
        yield schema_js_1.FacultyModel.create({
            email: email,
            password: hassedPassword,
            subject: subject,
            firstName: firstName,
            lastName: lastName,
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
exports.facultyRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        identifire: zod_1.default.string(),
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
exports.facultyRouter.get('/get/student/:branch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.facultyRouter.post('/attendance', auth_js_1.facultyMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requireBody = zod_1.default.object({
        studentId: zod_1.default.string(),
        subjectId: zod_1.default.string(),
        status: zod_1.default.enum(["present", "absent"])
    });
    const parsedData = requireBody.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({
            message: "Incorrect Format",
            error: parsedData.error
        });
    }
    const { studentId, subjectId, status } = parsedData.data;
    try {
        const response = yield schema_js_1.AttendanceModel.create({
            studentId,
            subjectId,
            status
        });
        res.status(200).json({
            response
        });
    }
    catch (e) {
        res.status(404).json({
            msg: "error in posting attandance: " + e
        });
    }
}));
