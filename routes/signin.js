var UserModule = require("../module/userModule");

signIn = (req,res,next) => {

 try{
        let _userModule =  new UserModule();
        _userModule.authenticate(req).then((token)=>{
            if(token.token){
            res.cookie("Oauthtoken",token.token,{ maxAge: 900000, httpOnly: true});
            res.json(1,"success",token.token);
            }

        }).catch((error) => {
           //console.log("error" == error);
           res.json(-1,"failed",error)
        })

    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = signIn ;
