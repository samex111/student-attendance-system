import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import {facultyRouter} from './facultylogin.js'




const app = express();
app.use(cors({
   origin: "http://localhost:5173",   // frontend ka exact origin
  credentials: true  ,
  methods: ["GET","DELETE","POST","PUT"],
   allowedHeaders: ["Content-Type"]
}))
app.use(express.json()); 
connectDB();
app.use('/api/faculty',facultyRouter)
app.get("/", (req, res) => { 
  res.json({ message: "Backend running!" });
}); 

app.listen(3000, () => { 
  console.log("Server running on http://localhost:3000");
});
