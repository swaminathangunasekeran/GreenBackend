var express = require('express');
var router = express.Router();
var InsightModule = require("../module/insightModule");
let user;

getInsightToEdit = (req,res,next) => {

  try{
    let _insightModule =  new InsightModule();
    let anonymousUser,userid;
    //console.log("Anonymous ====",req.body.anonymousUser)
    anonymousUser = req.body.anonymousUser;
    userid = req.body.userid;
    if(userid){
    _insightModule.getInsightToEdit(req).then((userInfo) => {
        if(userInfo == null){
          res.json(-1,"Failure","Not an valid user");
        }else{
          res.json(1,"Success",userInfo);
        }

    }).catch(error => {
        //console.log(error)
        res.json(-1,"Failure","Not an valid user");
    });
  }
  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }




}

module.exports = getInsightToEdit;
