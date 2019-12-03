class RequestInfo{
  constructor(){

  }

  getUserID(req){
    //console.log("REQ in getUserID",req)
    try{
      if(req.userid){
        return req.userid;
      }else if(req.body){
        return req.body.userid;
      }else{
        return false
      }
    }catch(error){
      //console.log(error);
      return false
    }

  }

}

module.exports = RequestInfo;
