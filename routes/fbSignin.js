var SocialWebModule = require("../module/socialWebModule");

fbSignin = (req,res,next) => {

 try{
        let socialWebModule =  new SocialWebModule();

        socialWebModule.fbGetUser(req).then((token)=>{
          res.cookie("Oauthtoken",token.token,{ maxAge: 900000, httpOnly: true});
          res.json(1,"success",token.token);
        }).catch((error) => {

           res.json(-1,"failed",error)
        })

    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = fbSignin ;
