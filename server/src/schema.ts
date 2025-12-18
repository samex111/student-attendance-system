import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    secretkey:{type:String, required:true},
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }
});
const FacultySchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    subject : [{type: String , required:true}],
    firstName : {type: String , required:true},
    lastName : {type: String , required:true},
    subjectId : {type: Schema.Types.ObjectId, ref: "subject", required: true},
});
const StudentSchema = new Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    rollNo:{type:Number, required:true},
    branch:{type:String, required:true},
    year:{type:Number, required:true},
    batch:{type:String, required:true},
    email: { type: String, unique: true, required: true }
});
const attendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "student-details", required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: "subject", required: true },
  status: { type: String, enum: ["present", "absent"], required: true },
  slot: { type: Number, required: true },
}, {timestamps:true});

const SubjectSchema = new Schema({
   name: { type: String, required: true },
   code: { type: String , reuired:true},
   sem: { type: Number, required:true },
   year: { type: Number, required: true },
   slot:{type:Number,required:true }
})

export const SubjectModel =  mongoose.model('subject',SubjectSchema);
export const AttendanceModel =  mongoose.model('attendance',attendanceSchema);
export const FacultyModel =  mongoose.model('faculty',FacultySchema);
export const AdminModel =  mongoose.model('admin',AdminSchema);
export const StudentModel =  mongoose.model('student-details',StudentSchema);