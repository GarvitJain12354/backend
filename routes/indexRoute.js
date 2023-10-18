const express = require("express");
const { homepage, login, signin, signout, studentData, sendMail, changePassword, resetPassword, UpdateData, avatarupload } = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");


const router = express.Router();

router.get("/",homepage)
// user data
router.get("/user",isAuthenticated,studentData)
// login
router.post("/login",login)
// POST signIn
router.post("/signin",signin)
// POST SIGNOUT
router.post("/signout",isAuthenticated,signout)
// for forget send mail POST
router.post("/internstudent/sendmail",sendMail)
// password changed 
router.post("/forgetlink/:id",changePassword)
// reset password
router.post("/reset/password",isAuthenticated,resetPassword)
// update info
router.post("/profile/update",isAuthenticated,UpdateData);
// img upload
router.post("/upload/avatar",isAuthenticated,avatarupload)

module.exports = router