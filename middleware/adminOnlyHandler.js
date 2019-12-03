const UserSchema = require('../schema/user');
const AppVariable =  require("../util/appVariables");

let adminOnlyHandler = function(request, response, next){
  try{
    let req = request.body;
      let reqURl = (request.url).split("?")[0];
    if(reqURl === " /getWebInsights" || reqURl === "/updateWebInsights" || reqURl === "/addRss" ){
      console.log("ADD RSS ONLY ")
      let userid =  req.userid
      let isValid = false;
      if(userid){
        UserSchema.findById(userid,(err,user)=>{
        console.log("USER",user.role);
          let role = user.role;
          if(role === 23){

           // next()
            //  response.json(1,`publications valid user`);
          }else{

            response.json(-1,`Not an valid user fo publications`);
          }

        })
      }else{
        response.json(-1,`Not an valid admin`);
      }
    }
    next()
  }catch(error){
  //  //console.log("ERROR IS ")
    response.json(-1,`Not an valid users ${error}`);
  }


}
module.exports = adminOnlyHandler;
