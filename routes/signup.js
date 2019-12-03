var UserModule = require("../module/userModule");
var AwsModule = require("../module/awsServiceModule");


signUp = (req,res,next) => {

 try{
        let _userModule =  new UserModule();
        let awsModule = new AwsModule();

        _userModule.createUser(req).then((users)=>{
          console.log("user is done")
            res.json(1,"success",users);
            // awsModule.verifyEmailToUser(users).then(result => {
            //
            // }).catch((error) => {
            //   console.log(error)
            // })

        }).catch((error) => {

           res.json(-1,"failed",error)
        })

    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = signUp ;
