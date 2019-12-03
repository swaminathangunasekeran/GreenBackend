var express = require('express');
var router = express.Router();
var UserModule = require("../module/userModule");
let user;

getUser = (req,res,next) => {

  try{
    let _userModule =  new UserModule();
    let anonymousUser,userid;
    //console.log("Anonymous ====",req.body.anonymousUser)
    anonymousUser = req.body.anonymousUser;
    userid = req.body.userid;
    if(userid){
    _userModule.getUserInsight(req.body.userid).then((userInfo) => {
        if(userInfo == null){
          res.json(-1,"Failure","Not an valid user");
        }else{
          res.json(1,"Success",userInfo);
        }

    });
  }
  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }




}

module.exports = getUser;
