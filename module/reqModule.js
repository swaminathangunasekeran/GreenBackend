const PublicationsSchema =  require("../schema/publications");
const UserSchema =  require("../schema/user");
const AppVariable =  require("../util/appVariables");


class  ReqModule{

 constructor(){

 }


  addUserTopublication(request){
    return new Promise((resolve,reject) => {
      try{
        let req = request.body;
        let publication = {pubId:req.pubId,role:AppVariable.PublicationRole.member};
        let user = req.reqInfo.user;
        //////console.log("user is",user);
        UserSchema.findOneAndUpdate({"_id":user,"publications.pubId":{$ne:publication.pubId}}
      ,{$push:{publications:publication}},{new:true},(err,pubUser) => {
        if(err){
          reject(err);
        }else{
          if(pubUser){
            resolve(pubUser)
          }else{
            reject("already user exist in publication")
          }
        }
      })
      }catch(error){
        reject(error);
      }
    })
  }

  reqAddUserToPub(request){
    return new Promise((resolve,reject) => {
      try{
        let req = request.body;
        let publicationId = req.publication;
        let userinfo = {user:req.userid,role:AppVariable.PublicationRole.member,requestedDate:Date.now()};
        PublicationsSchema.findOneAndUpdate ({"_id":publicationId,
        "userRequest.user":{$ne: userinfo.user}}
        ,{ $push: { userRequest : userinfo }},
          {new: true},(err,publications) =>{
          if(err){
              reject(err);
          }else{
            if(publications){
                resolve(publications._id)
            }else{
              reject("request already sent")
            }

          }

        })
      }catch(error){
        ////console.log("error is ===",error);
          reject(err);
      }



        /*this.configUserRequest(req).then((user) => {
          if(user){
            ////console.log("reqes after",req)
            let userReqSchema = new UserReqSchema({
              from : req.userid,
              to : req.publication,
              createdDate : Date.now()

            });
            userReqSchema.save((err,req) => {
              if(err){
                reject(err)
              }else{
                resolve(req);
              }
            });
          }else{
            reject("req already in pending state");
          }
        }).catch((error) => {
          ////console.log("ERROR is",error);
          reject(error);
        }); */
    });
  }



  addInsightToPublication(insight){ // request to add insight to publications

    return new Promise((resolve,reject) => {
      try{
        let publicatonId = insight.publication;
        let insightId = insight._id;
        ////console.log("insight ID ====",insight)
          PublicationsSchema.findByIdAndUpdate(publicatonId,
            {$push:{insightRequest:insightId}},
            {new:true},(err,publications)=>{
              if(err){
                  reject(err);
              }else{
                if(publications){
                    resolve(publications._id)
                }else{
                  reject("request already sent")
                }
              }
          })
      }catch(error){
        reject(error);
      }

      })
    /*  PublicationsSchema.findOneAndUpdate({"_id",publicatonId,
      "insightRequest":{$ne:insightId}},
    {$push:{insightRequest:insightId}},{new:true},(err,publications) =>{
      if(err){
          reject(err);
      }else{
        if(publications){
            resolve(publications._id)
        }else{
          reject("request already sent")
        }
    })
  }) */
  }


  /*configUserRequest(req){
    return new Promise((resolve,reject) => {
      ////console.log("IN CONFIG USER",req.userid)
      //let userSchema = new UserSchema();
      let userId =  req.userid;
      ////console.log("USER ID IS ====",userId);
      let pubinfo =  {pubId:req.publication,role:5};
      UserSchema.findOneAndUpdate ({"_id":userId,"publications.pubId":{$ne: pubinfo.pubId}}
      ,{ $push: { publications: pubinfo }},
        {new: true},(err,user) =>{
        if(err){
          ////console.log(err);
            reject(err);
        }else{
          ////console.log(user)
          resolve(user)
        }

      }) */

    /*  UserSchema.findByIdAndUpdate (userId,{$addToSet: {publications:pubinfo}}
        ,{new: true},(err,user) =>{
        if(err){
            reject(err)
        }else{
          ////console.log(user)
          resolve(user)
        }

      })


    });*/
  }



module.exports = ReqModule;
