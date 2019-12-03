var express = require('express');
var router = express.Router();
var UserModule = require("../module/userModule");
let user;

getUser = (req,res,next) => {

  try{
    let _userModule =  new UserModule();
    let anonymousUser,userid;
    //console.log("Anonymous ====",req.body.anonymousUser)
    // console.log("REQUEST ========",req)
    anonymousUser = req.body.anonymousUser;
    userid = req.body.userid;
    if(userid){
    _userModule.getuser(req.body.userid).then((userInfo) => {
        if(userInfo == null){
          res.json(-1,"Failure","Not an valid user");
        }else{
          res.json(1,"Success",userInfo);
        }

    }).catch((error) => {
        res.json(-1,"Failure","Not an valid user");
    });
  }else if(anonymousUser){
      _userModule.getAnonymousUser(anonymousUser).then((userInfo) => {
        if(userInfo == null){
          res.json(-1,"Failure","Not an valid user");
        }else{
          res.json(2,"Success",userInfo._id);
        }
      }).catch(function(error) {
        //console.log(error);
      res.json(-1,"Failure",error);
    });
  }else if(!anonymousUser){
    _userModule.createAnonymousUser().then((userInfo) => {
      //res.cookie("anonymousUser", userInfo);
      //res.json(-1,"auth failed");
      res.json(2,"anonymousUser",userInfo._id);
    }).catch(function(error) {
      //here when you reject the promise
      //console.log(error);
        res.json(-1,"Failure",error);
    });

  }
  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }




}

module.exports = getUser;
