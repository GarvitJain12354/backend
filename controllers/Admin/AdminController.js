const errorHanler = require("../../error/errorHandler");
const { sendAdminToken } = require("../../jwt/sendToken");
const { CatchAsyncErrors } = require("../../middlewares/CatchAsyncerror");
const Admin = require("../../models/AdminModel");



const imagekit = require("../../middlewares/imagekit.js").initimagekit();
const path = require("path");
const { sendmail } = require("../../nodemailer/nodemailer");
const student = require("../../models/studentModel");

exports.homepage = CatchAsyncErrors(async (req, res, next) => {
//   const AdminData = await Admin.find().exec();

  res.json({ message: "This is Admin Data" });
});
exports.login = CatchAsyncErrors(async (req, res, next) => {
  const admin = await new Admin(req.body).save();
  //    res.status(201).json(studentModel)
sendAdminToken(admin, 200, res);
});
exports.AdminData = CatchAsyncErrors(async (req, res, next) => {
  const studentModel = await Admin.findById(req.id).exec();
  res.json(studentModel);
});
exports.signin = CatchAsyncErrors(async (req, res, next) => {
  const studentModel = await Admin
    .findOne({ email: req.body.email })
    .select("+password")
    .exec();
  if (!studentModel) return next(new errorHanler("User not found", 500));
  const isMatch = studentModel.comparepassword(req.body.password);

  if (!isMatch) return next(new errorHanler("Wrong password", 500));

sendAdminToken(studentModel, 201, res);
});
exports.signout = CatchAsyncErrors(async (req, res, next) => {
  res.clearCookie("adminToken");
  res.json({ message: "Sign Out" });
});
exports.sendMail = CatchAsyncErrors(async (req, res, next) => {
  const AdminData = await Admin.findOne({ email: req.body.email }).exec();
  console.log(AdminData);
  if (!AdminData) {
    return next(new errorHanler("User with this email does not exist ", 404));
  }
  const url = `http://localhost:3000/Admin/forgetlink/${AdminData._id}`;
  AdminData.resetpasswordToken = "1";
  AdminData.save();
  console.log(AdminData.resetpasswordToken);

  sendmail(req, res, next, url);
  res.json({ AdminData, url });
});
exports.changePassword = CatchAsyncErrors(async (req, res, next) => {
  const AdminData = await Admin.findById({ _id: req.params.id }).exec();

  if (!AdminData) {
    next(new errorHanler("User not exist"), 500);
  }

  if (AdminData.resetpasswordToken === "1") {
    AdminData.password = req.body.password;
    AdminData.resetpasswordToken = "0";
    AdminData.save();

    res.status(200).json({
      message: "Password Change Succesfully",
    });
  } else {
    res.status(400).json({
      message: "Link Expired",
    });
  }
});
exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {
  console.log(req.body);
  const AdminData = await Admin
    .findById({ _id: req.id })
    .select("+password");
  const isMatch = AdminData.comparepassword(req.body.oldpassword);
  console.log(AdminData);
  if (!isMatch) return next(new errorHanler("Wrong password", 500));
  if (isMatch) {
    AdminData.password = req.body.newpassword;
    await AdminData.save();
  sendAdminToken(AdminData, 201, res);
  }
  res.status(200).json({ message: "Password is changed succesfully" });
});
exports.UpdateData = CatchAsyncErrors(async (req, res, next) => {
  console.log("hello");
  const AdminData = await Admin.findByIdAndUpdate(req.id, req.body).exec();

  res.status(200).json({ message: "Student updated successfully" });
});
exports.avatarupload = CatchAsyncErrors(async (req, res, next) => {
  const AdminData = await Admin.findById(req.id).exec();

  const file = req.files.avatar;
  const modifiedFileName = `Admingarvitjain-${Date.now()}${path.extname(file.name)}`;
  if (AdminData.avatar.fileId !== "") {
    await imagekit.deleteFile(AdminData.avatar.fileId);
  }
  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  AdminData.avatar = { fileId, url };
  await AdminData.save();
  res.json({ message: "Profile Image uploaded" });
});
exports.getAllStudent = CatchAsyncErrors(async(req,res,next)=>{
  const studentData = await student.find().exec()
   res.status(200).json({
    message:"Get all students Data",
    student :studentData
   })
})