const PubSchema = require('../schema/publications');
const UrlFraming =  require("../util/urlFraming");
const UserSchema = require('../schema/user');
const AppVariable =  require("../util/appVariables");


class Publications{

  constructor(){
    //this.urlFraming = new UrlFraming();

  }

  createPublications(request){
      return new Promise((resolve, reject) =>{
            try{
      //  //console.log("Create publications",pubName)
      let req,pubTopics,userID,pubName,url;
      let urlFraming =  new UrlFraming();
      let menuTopics =  new Array();
      req = request.body;
      pubTopics = req.pubTopic;
      userID =  req.userid;
      pubName = req.name;
      if(pubTopics){
        menuTopics = pubTopics.map(topic => {
          return {"title":topic}
        });
      }
        url = urlFraming.getPublicationUrl(pubName);
        let pubSchema = new PubSchema({
          name: pubName,
          createdDate : Date.now(),
          topics : menuTopics,
          admins : [userID],
          url : url
        });
        pubSchema.save((err,pub)=> {
            if(err){
            //  //console.log("createPublications"+err);
                reject(err);
            } else{
              this.setAdmin(pub,userID).then((user) => {
                  resolve(pub);
              }).catch((error) => {
                reject(error);
              });

            }
        });
      }catch(error){
        ////console.log("createPublications error"+error);
        reject(err);
      }
      });
  }


  setAdmin(pub,userID){
    return new Promise((resolve,reject) => {
      try{
        UserSchema.findByIdAndUpdate(userID,{ "$push": { "publications": {pubId:pub._id,role:AppVariable.PublicationRole.admin} } },{new:true},(err,user) => {
          if(err){
            reject(err)
          }else{
            resolve(user)
          }
        })
      }catch(error){
      ////console.log("userAsAdmin error"+error);
      reject(err)
      }
    })

  }


  }

module.exports = Publications;
