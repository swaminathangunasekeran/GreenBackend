let PublishModule = require("../module/publishModule");

comments = (req,res,next) => {

 try{
    
       //res.json(1,"success","success");
       console.log("GET COMMENTS");
     let publishModule = new PublishModule(req.body);
     publishModule.getComments(req).then((insight) => {
        res.json(1,"success",insight);
     }).catch((error) => {
       //console.log(error)
       res.json(-1,`Error on saving insight ${error}`);
     });
     
    }catch(err){

        res.json(-1,`Error on saving insight ${err}`);
    }

}

module.exports = comments ;
