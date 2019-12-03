var UserModule = require("../module/userModule");

signOut = (req,res,next) => {

 try{
    let _userModule =  new UserModule();
    res.cookie("Oauthtoken", "", { expires: new Date() });
    res.json(1,"logout",);
    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = signOut;
