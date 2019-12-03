var AwsModule = require("../module/awsServiceModule");

uploadImage = (req,res,next) => {

 try{
   let awsModule = new AwsModule();
    awsModule.uploadFile(req).then(result => {
      if(result.Location){
        res.json({"url":result.Location});
      }else{
        res.json({"code":-1,"status":"failed","result":result});
      }
    }).catch(error => {
      res.json({"code":-1,"status":"failed","result":error});
    });

    }catch(err){

        res.json({"code":-1,"status":"failed","result":`Error on saving user ${err}`});
    }

}

module.exports = uploadImage ;
