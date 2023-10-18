
const errorHanler = require("../error/errorHandler")
const { sendToken } = require("../jwt/sendToken")
const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror")
const student = require("../models/studentModel")
const { sendmail } = require("../nodemailer/nodemailer")
const imagekit = require("../middlewares/imagekit").initimagekit()
const path = require("path");

exports.homepage = CatchAsyncErrors(async (req,res,next)=>{
   const studentData = await student.find().exec();

   res.json({message:"This is student Data",studentData})
})
exports.login = CatchAsyncErrors(async (req,res,next)=>{
    
       const studentModel = await new student(req.body).save();
    //    res.status(201).json(studentModel)
    sendToken(studentModel,200,res)
})
exports.studentData = CatchAsyncErrors(async (req,res,next)=>{
    const studentModel = await student.findById(req.id).exec();
    res.json(studentModel)
})
exports.signin = CatchAsyncErrors(async (req,res,next)=>{
    const studentModel = await student.findOne({email:req.body.email}).select("+password").exec();
    if(!studentModel) return next(new errorHanler("User not found",500))
    const isMatch = studentModel.comparepassword(req.body.password);

if(!isMatch) return next(new errorHanler("Wrong password",500))

sendToken(studentModel,201,res)
    
})
exports.signout  = CatchAsyncErrors(async(req,res,next)=>{
    res.clearCookie("studentToken")
    res.json({message:"Sign Out"})
})
exports.sendMail = CatchAsyncErrors(async(req,res,next)=>{
   
    const studentData = await student.findOne({email:req.body.email}).exec();
    console.log(studentData);
if(!studentData){
   return next(new errorHanler("User with this email does not exist ",404))
}
const url = `http://localhost:3000/student/forgetlink/${studentData._id}`
studentData.resetpasswordToken = "1"
studentData.save()
console.log(studentData.resetpasswordToken);

sendmail(req,res,next,url)
    res.json({studentData,url})
})
exports.changePassword = CatchAsyncErrors(async (req,res,next)=>{
const studentData = await student.findById({_id:req.params.id}).exec();

if(!studentData){
    next(new errorHanler("User not exist"),500);
}


if(studentData.resetpasswordToken === "1"){

    studentData.password = req.body.password;
    studentData.resetpasswordToken = "0"
    studentData.save();
   
    res.status(200).json({
       message: "Password Change Succesfully"
    })
}
else{
    res.status(400).json({
        message: "Link Expired"
     })  
}

})
exports.resetPassword = CatchAsyncErrors(async(req,res,next)=>{
    console.log(req.body);
    const studentData = await student.findById({_id:req.id}).select("+password")
    const isMatch = studentData.comparepassword(req.body.oldpassword);
console.log(studentData);
    if(!isMatch) return next(new errorHanler("Wrong password",500))
    if(isMatch){
      studentData.password =   req.body.newpassword ;
       await studentData.save();
        sendToken(studentData,201,res)
    }
    res.status(200).json({message:"Password is changed succesfully"})
})
exports.UpdateData = CatchAsyncErrors(async (req,res,next)=>{

    const studentData = await student.findByIdAndUpdate(req.id,req.body).exec();

    res.status(200).json({message:"Student updated successfully"})
})
exports.avatarupload = CatchAsyncErrors(async(req,res,next)=>{
    const studentData = await student.findById(req.id).exec();
  
    const file = req.files.avatar;
    const modifiedFileName = `garvitjain-${Date.now()}${path.extname(file.name)}`
    if(studentData.avatar.fileId !== ""){
        await imagekit.deleteFile(studentData.avatar.fileId);
    }
    const {fileId,url} = await imagekit.upload({
        file:file.data,
        fileName:modifiedFileName
    })
    studentData.avatar = {fileId,url};
   await studentData.save()
    res.json({message:"Profile Image uploaded"})
})

