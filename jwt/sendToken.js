const { CatchAsyncErrors } = require("../middlewares/CatchAsyncerror");

exports. sendToken = (student,statusCode,res)=>{
    const token = student.getjwttoken();
    const options = {
        expires :new Date(Date.now() + 1*24*60*60*1000),
        httpOnly:true
    }
    res.status(statusCode).cookie("studentToken",token,options)
    .json({success:true,id:student._id,token});
    res.json({token})
}

exports. sendAdminToken = (admin,statusCode,res)=>{
    const token = admin.getjwttoken();
    const options = {
        expires :new Date(Date.now() + 1*24*60*60*1000),
        httpOnly:true
    }
    res.status(statusCode).cookie("adminToken",token,options)
    .json({success:true,id:admin._id,token});
    res.json({token})
}