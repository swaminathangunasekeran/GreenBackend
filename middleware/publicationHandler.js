const UserSchema = require('../schema/user');
const AppVariable =  require("../util/appVariables");

let pubHandler = function(request, response, next){
  try{
    let req = request.body;

    let userid =  req.userid
    let pubid =  req.pubId
    let isValid = false;
    if(userid && pubid){
      UserSchema.findById(userid,(err,user)=>{
      //  //console.log("Publications",user);
        let publications = user.publications;
        isValid = publications.find(publication => {
        //  //console.log("Publications",publication);
          return publication.pubId == pubid && publication.role < AppVariable.PublicationRole.editor && publication.role > AppVariable.PublicationRole.norole? true : false;

        });
        if(isValid){
          next()
          //  response.json(1,`publications valid user`);
        }else{
          response.json(-1,`Not an valid user fo publications`);
        }

      })
    }else{
      response.json(-1,`Not an valid user`);
    }
  }catch(error){
  //  //console.log("ERROR IS ")
    response.json(-1,`Not an valid user ${error}`);
  }


}
module.exports = pubHandler;
