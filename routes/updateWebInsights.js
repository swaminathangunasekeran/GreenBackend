var ManageInsight = require("../module/manageInsightModule");

saveInsight = (req,res,next) => {

 try{
    if(req.body.userid){

      //res.json(1,"success","success");
        let manageInsight =  new ManageInsight();
    manageInsight.updatePublishedInsight(req).then((insight) => {
       res.json(1,"success",insight)
    }).catch((error) => {
      res.json(-1,`Error on saving insights ${error}`);
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
