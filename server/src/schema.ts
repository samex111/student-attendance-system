import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const FacultySchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    subject : {type: String , required:true},
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false }
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

export const FacultyModel =  mongoose.model('faculty',FacultySchema);
export const StudentModel =  mongoose.model('student-details',StudentSchema);