import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import {facultyRouter} from './faculty'
import { AdminRouter } from "./admin";
import cookieParser from 'cookie-parser'
import { facultyMiddleware } from "./auth";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(cors({
   origin: "http://localhost:5173",   // frontend ka exact origin
  credentials: true  ,
  methods: ["GET","DELETE","POST","PUT"],
   allowedHeaders: ["Content-Type"]
}))
app.use(express.json()); 
connectDB();
app.use('/api/faculty', facultyRouter)
app.use('/api/admin',AdminRouter)
app.get("/", (req, res) => { 
  res.json({ message: "Backend running again!" });
}); 

app.listen(PORT, () => { 
console.log(`New  server running on port  ${PORT}`);
});
