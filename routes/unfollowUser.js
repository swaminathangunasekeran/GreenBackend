var UserModule = require("../module/userModule");

getUser = (req,res,next) => {

  try{
    let _userModule =  new UserModule();
    let anonymousUser,userid,unfollowid;
    //console.log("Anonymous ====",req.body.anonymousUser)
    anonymousUser = req.body.anonymousUser;
    userid = req.body.userid;
    unfollowid = req.body.unfollow;
    if(userid && unfollowid){
    _userModule.unfollowUser(req.body.userid,unfollowid).then((userInfo) => {
        if(userInfo == null){
          res.json(-1,"Failure","Not an valid user");
        }else{
          res.json(1,"Success",userInfo);
        }

    }).catch((error) => {
        res.json(-1,error);
      });;
  }else{
    res.json(-1,`Error`);
  }
  }catch(err){
    res.json(-1,`Error on saving user ${err}`);
  }




}

module.exports = getUser;
