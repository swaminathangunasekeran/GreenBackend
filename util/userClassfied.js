const UserSchema = require('../schema/user');
const InsightSchema = require('../schema/insight');
const RequestInfo =  require('./requestInfo');
const AppVariable =  require("./appVariables");

class UserClassFied{

  constructor(req){


  }

  getuser(userName){
    return new Promise((resolve,reject) => {
      let findUserQuery = UserSchema.findOne({'userName' :userName});
      try{
        findUserQuery.exec(function(err, user){
            if (user == null || err) {
                reject(null);
            } else {
              resolve(user);
            }
      });
    }catch(error){
      console.log("ERROR +++++",error)
      reject(error);
      }

});
}


  getUserfromRequest(req){
    return new Promise((resolve,reject) => {
      try{
      //  //console.log("getUserfromRequest getUserfromRequest");
        let requestInfo  = new RequestInfo();
        this.req = req;
        let userID = req.userid;
        let publication = req.publication;
        ////console.log("userID is ",userID);
        UserSchema.findById(userID,(err,user) => {
          ////console.log(`user is ${user}`);
          if(err){
          //  //console.log(`error in canPublishInsight ${err}`);
              reject(error);
          }else if(!user){
          //  //console.log("THIS USER IS  NULL",this.user)
            reject("user is not valid");
          }else{
            this.user = user;
          //  //console.log("THIS USER IS",this.user)
            resolve(true);
          }
        })
      }catch(error){
        //console.log("getUserfromRequest",error);
          reject(error);
      }
    })


  }



   canPublishInsight(){
     return new Promise((resolve,reject) => {
       try{
         this.isThisUserInsight().then((userInsight) => {
           if(userInsight){
              this.isUserAllowedInPublication().then((isAllowed) =>{
                if(isAllowed){
                  resolve(isAllowed);
                }else{
                  reject("user dont have access to publications");
                }
              }).catch(error => {
                reject(error);
              })
           }else{
             reject("user dont have access to insight")
           }
         }).catch((err) =>{
           reject(err)
         })
       }catch(error){
         //console.log("canPublishInsight",error);
         reject(error);
       }
     })
   }

    isUserAllowedInPublication(){
      return new Promise((resolve,reject) => {
        try{
          let req = this.req;
          let user = this.user;
          let userPublications = user.publications;
          let reqPublication =  req.publication;
          let isAllowed =  false;
          ////console.log("reqPublication",reqPublication);
          
          for(var i=0;i< userPublications.length; i++){
            ////console.log("userPublications",userPublications[i].pubId);
            if(userPublications[i].pubId == reqPublication  && userPublications[i].role < AppVariable.PublicationRole.follower  && userPublications[i].role > AppVariable.PublicationRole.norole){
              isAllowed = true;
              break;
            }
          }
           resolve(isAllowed);
        }catch(error){
          //console.log("isUserAllowedInPublication",error);
          reject(error);
        }

      })

    }

    isThisUserInsight(){
      return new Promise((resolve,reject) => {
        try{

          let req = this.req;
          let insightId = req.insightId;
          //console.log("InsightID==",insightId);
          InsightSchema.findById(insightId,(err,insight) => {
            //console.log("Insight status",insight.status);

            if((String(insight.userid) == String(this.user._id))){
              resolve(true);
            }else{
              resolve(false);
            }
          })
        }catch(error){
          //console.log("isThisUserInsight",error);
          reject(error);
        }
      })
    }

    /*isThisUserInsight(){
      return new Promise((resolve,reject) => {
        try{
          let isAllowed = false;
          let userInsightList = this.user.insights;
          let req = this.req;
          let insightID = req.insightId;

        //  //console.log("insightID",insightID);
          ////console.log(this.user);
           for(var i=0;i< userInsightList.length; i++){
             if(userInsightList[i] == insightID){
               isAllowed = true;
               break;
             }
           }
           resolve(isAllowed);
        }catch(error){
          //console.log("isThisUserInsight",error);
          reject(error);
        }
      })
    }*/




}

module.exports = UserClassFied;
