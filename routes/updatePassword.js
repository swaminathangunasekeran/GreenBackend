var UserModule = require("../module/userModule");

updatePassword = (req,res,next) => {

 try{
        let _userModule =  new UserModule();
        _userModule.updatePassword(req).then((users)=>{
            res.json(1,"success",users);

        }).catch((error) => {

           res.json(-1,"failed",error)
        })

    }catch(err){

        res.json(-1,`Error on saving user ${err}`);
    }

}

module.exports = updatePassword ;
