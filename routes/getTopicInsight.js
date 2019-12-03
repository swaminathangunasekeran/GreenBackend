var express = require('express');
var router = express.Router();
var PublishModule = require("../module/publishModule");
let user;

getTopicInsight = (req,res,next) => {

  try{
      let language = req.params.language;
      let topic = req.params.topic;
      let _publishModule =  new PublishModule();

      if(req.body.userid){
        _publishModule.getUserTopicInsight(topic,language,req.body.userid).then((insightInfo) => {
          if(insightInfo == null){
            res.json(-1,"Failure","Not an valid user");
          }else{
            res.json(1,"Success",insightInfo);
          }
  
      }).catch(error => {
          console.log("ERROR ====",error)
          res.json(-1,"Failure","Not an valid usersss");
      });
      }else{
        _publishModule.getTopicInsight(topic,language).then((insightInfo) => {
          if(insightInfo == null){
            res.json(-1,"Failure","Not an valid user");
          }else{
            res.json(1,"Success",insightInfo);
          }
  
      }).catch(error => {
          console.log("ERROR ====",error)
          res.json(-1,"Failure","Not an valid usersss");
      });
      }
   



  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }
}

module.exports = getTopicInsight;
