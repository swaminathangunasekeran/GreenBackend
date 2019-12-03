const Publications = require('../schema/publications');

let pubApprovalHandler = function(request, response, next){
  try{
    let req = request.body;
  //  //console.log("Request in pubHandler ",req);
    let userId =  req.userid;
    let reqId = req.reqId;
    let pubId = req.pubId;
    let approvalAccepted =  true?req.action ==1 :false
    let reqInfo;
    ////console.log("REQUEST ID +++++",reqId)
    if(userId && pubId){
          Publications.findByIdAndUpdate(pubId,{$pull :{userRequest:{_id:reqId }}},(err,pub) => {
            reqInfo = pub.userRequest.find(userReq => {
            //  //console.log("userReq ====",userReq)
            return userReq ? userReq._id == reqId : false;
          });
          request.body.reqInfo = reqInfo;
          ////console.log("REQUEST INFO ++++++",request.body.reqInfo)
        if(!reqInfo){
          response.json(1,`success`,"req not found");
        }
        else if(approvalAccepted ){
          next();
        }else{

          response.json(1,`success`,"req deleted");
        }


      });
    }else{
      response.json(-1,`Not an valid user`);
    }
  }catch(error){
    response.json(-1,`Not an valid user ${error}`);
  }


}
module.exports = pubApprovalHandler;
