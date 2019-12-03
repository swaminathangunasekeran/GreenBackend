var InsightModule = require("../module/insightModule");

saveInsight = (req,res,next) => {

 try{
    if(req.body.userid){
      //res.json(1,"success","success");
    let insightmodule = new InsightModule();
    insightmodule.updateInsight(req).then((insight) => {
       res.json(1,"success",insight)
    }).catch((error) => {
      //console.log(error)
      res.json(-1,`Error on saving insight ${error}`);
    });
    }else{
      //res.cookie("Oauthtoken", "", { expires: new Date() });
      res.json(-1,"auth failed");
    }

    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = saveInsight ;
