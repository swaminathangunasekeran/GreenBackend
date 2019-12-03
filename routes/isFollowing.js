var UserModule = require("../module/userModule");

getUser = (req,res,next) => {

  try{
    let _userModule =  new UserModule();
    let userid,followid;
    anonymousUser = req.body.anonymousUser;
    userid = req.body.userid;
    followid = req.body.isfollow;
    if(userid && followid){
    _userModule.isFollowing(req.body.userid,followid).then((userInfo) => {
        if(userInfo == null){
          res.json(1,"Success",false);
        }else{
          res.json(1,"Success",userInfo);
        }

    }).catch((error) => {
        res.json(-1,error);
      });
  }else{
    res.json(-1,`Error`);
  }
  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }




}

module.exports = getUser;
