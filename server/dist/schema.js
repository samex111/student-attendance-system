"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = exports.AdminModel = exports.FacultyModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Types.ObjectId;
const AdminSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    secretkey: { type: String, required: true },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }
});
const FacultySchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    subject: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }
});
const StudentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    rollNo: { type: Number, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    batch: { type: String, required: true },
    email: { type: String, unique: true, required: true }
});
exports.FacultyModel = mongoose_1.default.model('faculty', FacultySchema);
exports.AdminModel = mongoose_1.default.model('admin', AdminSchema);
exports.StudentModel = mongoose_1.default.model('student-details', StudentSchema);
