"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = exports.facultyMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_FACULTY = process.env.JWT_FACULTY;
const JWT_ADMIN = process.env.JWT_ADMIN;
const facultyMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token: ", token);
    if (!token)
        return res.status(401).json({ message: "No token provided " });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_FACULTY);
        console.log("Decoded is :", decoded);
        req.userId = decoded.id;
        console.log("cookies: ", token);
        next();
    }
    catch (e) {
        res.status(400).json({
            error: "your are not signed in "
        });
    }
};
exports.facultyMiddleware = facultyMiddleware;
const AdminMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token: ", token);
    if (!token)
        return res.status(401).json({ message: "No token provided " });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_ADMIN);
        console.log("Decoded is :", decoded);
        req.userId = decoded.id;
        console.log("cookies: ", token);
        next();
    }
    catch (e) {
        res.status(400).json({
            error: "your are not signed in "
        });
    }
};
exports.AdminMiddleware = AdminMiddleware;
