var express = require('express');
var router = express.Router();
var ManageInsight = require("../module/manageInsightModule");
let user;

getUser = (req,res,next) => {

  try{
    let manageInsight =  new ManageInsight();
    let language = req.params.language;
    manageInsight.getWebInsights(language).then((insightInfo) => {
        if(insightInfo == null){
          res.json(-1,"Failure","Not an valid user");
        }else{
          res.json(1,"Success",insightInfo);
        }

    }).catch(error => {
        console.log("ERROR ====",error)
        res.json(-1,"Failure","Not an valid usersss");
    });
  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }




}

module.exports = getUser;
