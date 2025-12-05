"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_js_1 = require("./db.js");
const faculty_js_1 = require("./faculty.js");
const admin_js_1 = require("./admin.js");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // frontend ka exact origin
    credentials: true,
    methods: ["GET", "DELETE", "POST", "PUT"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express_1.default.json());
(0, db_js_1.connectDB)();
app.use('/api/faculty', faculty_js_1.facultyRouter);
app.use('/api/admin', admin_js_1.AdminRouter);
app.get("/", (req, res) => {
    res.json({ message: "Backend running!" });
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
