var UserModule = require("../module/userModule");
//var AwsModule = require("../module/awsServiceModule");


userProfile = (req,res,next) => {

 try{
        let _userModule =  new UserModule();
        let userName = req.params.id
        _userModule.getuserByUserName(userName).then((users)=>{
            res.json(1,"success",users);


        }).catch((error) => {

           res.json(-1,"failed",error)
        })

    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = userProfile ;
