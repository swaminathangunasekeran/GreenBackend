var express = require('express');
var router = express.Router();
var UserModule = require("../module/userModule");
let user;
var AwsModule = require("../module/awsServiceModule");

forgotPassword = (req,res,next) => {

  try{
  let awsModule = new AwsModule();
    let anonymousUser,userid;
    email = req.body.email;
    if(email){
      console.log("USERID IS ====",email);
      awsModule.sendUserPasswordLink(email).then(result => {
          res.json(1,"success", result)
      }).catch((error) => {
        console.log(error)
        res.json(-1,"failure",error);
      }).catch((error) => {
      console.log(error);
      res.json(-1,"failure",error);
    });
  }
  }catch(err){
    res.text("not an valid user");
  }




}

module.exports = forgotPassword;
