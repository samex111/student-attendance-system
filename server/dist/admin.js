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
        identifire: zod_1.default.string(),
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
    const { identifire, password, secretkey } = req.body;
    const user = yield schema_js_1.AdminModel.findOne({ $or: [{ username: identifire }, { email: identifire }] });
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
