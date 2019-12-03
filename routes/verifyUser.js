var express = require('express');
var router = express.Router();
var UserModule = require("../module/userModule");
let user;

verifyUser = (req,res,next) => {

  try{
    let _userModule =  new UserModule();
    let anonymousUser,userid;
    userid = req.body.userid;
    if(userid){
    _userModule.verifyUser(req.body.userid).then((userInfo) => {
        if(userInfo == null){
          res.text("not an valid user");
        }else{
          res.redirect('https://thudup.com/');
        }

    }).catch((error) => {
      console.log(error);
      res.json(-1,"failure",error);
    });
  }
  }catch(err){
    res.text("not an valid user");
  }




}

module.exports = verifyUser;
