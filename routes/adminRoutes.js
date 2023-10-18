const express = require("express");
const {homepage, AdminData, login, signin, signout, sendMail, changePassword, resetPassword, UpdateData, avatarupload, getAllStudent} = require("../controllers/Admin/AdminController") 
const { isAuthenticated, isAuthenticatedAdmin } = require("../middlewares/auth");
const router = express.Router();

router.get("/",homepage)
// user data
router.get("/admin",isAuthenticatedAdmin,AdminData)
// login
router.post("/register",login)
// POST signIn
router.post("/signin",signin)
// POST SIGNOUT
router.post("/signout",isAuthenticatedAdmin,signout)
// for forget send mail POST
router.post("/internstudent/sendmail",sendMail)
// password changed 
router.post("/forgetlink/:id",changePassword)
// reset password
router.post("/reset/password",isAuthenticatedAdmin,resetPassword)
// update info
router.post("/resume/update",isAuthenticatedAdmin,UpdateData);
// img upload
router.post("/upload/avatar",isAuthenticatedAdmin,avatarupload)

module.exports = router
