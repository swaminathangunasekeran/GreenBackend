let PublishModule = require("../module/publishModule");

unlikeInsight = (req,res,next) => {

 try{
     if(req.body.userid){
       //res.json(1,"success","success");
       console.log("LIKE INSIGHT");
     let publishModule = new PublishModule(req.body);
     publishModule.unlikeInsight(req).then((insight) => {
        res.json(1,"success",insight);
     }).catch((error) => {
       //console.log(error)
       res.json(-1,`Error on saving insight ${error}`);
     });
     }else{
      // res.cookie("Oauthtoken", "", { expires: new Date() });
       res.json(-1,"auth failed");
     }
    }catch(err){

        res.json(-1,`Error on saving insight ${err}`);
    }

}

module.exports = unlikeInsight ;
