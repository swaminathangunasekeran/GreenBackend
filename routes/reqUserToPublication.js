var ReqModule = require("../module/reqModule");

reqUserToPublication = (req,res,next) => {

  try{
    if(req.body.userid){
      let reqModule =  new ReqModule();
      //console.log(req.body.userid)
      reqModule.reqAddUserToPub(req).then((requested)=>{
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

module.exports = reqUserToPublication ;
