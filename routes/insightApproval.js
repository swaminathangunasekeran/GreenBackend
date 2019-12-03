var PubModule = require("../module/publishModule");

insightApproval = (req,res,next) => {

  try{
    if(req.body.userid){
      //console.log(req.body.userid)
      let pubModule = new PubModule(req);
      pubModule.approveInsight().then((requested)=>{
          res.json(1,"success",requested)
      }).catch((error) => {

         res.json(-1,"failed",error)
      })
    }else{
      res.json(-1,"failed","not an valid user");
    }


     }catch(err){

         res.json(-1,`Error on saving user ${err}`);
     }

}

module.exports = insightApproval ;
