let PubInsightModule = require("../module/publishModule");

addPubFromRss = (req,res,next) => {
 try{
     if(req.body.userid){
       //res.json(1,"success","success");
     let pubInsightModule = new PubInsightModule();
     pubInsightModule.getRss(req).then((pub) => {
        res.json(1,"success",pub)
     }).catch((error) => {
       //console.log(error)
       if(error.code == 11000){
         res.json(2,"failure",error.errmsg)
       }else{
          res.json(-1,`Error on saving insight ${error}`);
       }
     });
     }else{
      // res.cookie("Oauthtoken", "", { expires: new Date() });
       res.json(-1,"auth failed");
     }
    }catch(err){

        res.json(-1,`Error on saving insight ${err}`);
    }

}

module.exports = addPubFromRss ;
