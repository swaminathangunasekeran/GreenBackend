const InsightSchema = require('../schema/insight');
const UserSchema = require('../schema/user');
const AppVariable =  require('../util/appVariables');


class Insight{

  constructor(){

  }



  getInsightToEdit(request){
    return new Promise((resolve,reject) => {
      try{
        let req,userId,insightId,updateInsightQuery;
        req = request.body;
        userId = req.userid;
        insightId = req.insightId;
        if(insightId){
          updateInsightQuery = InsightSchema.findOne({"_id": insightId,"userid":userId}).select("insightbody title pubinsightID status sample");
            ////console.log("updateInsightQuery",updateInsightQuery)
            updateInsightQuery.exec((err,insight) => {
              if(err){
              //  //console.log(err);
                reject(err);
              }else{
                ////console.log(insight);
                resolve(insight);
              }
            })

        }else{
          reject(",Insight Id cannot be empty");
        }
      }catch(error){
        reject(error)
      }


    })


  }

  getInsightToPub(request){
    return new Promise((resolve,reject) => {
      try{
        let req,userId,insightId,updateInsightQuery;
        req = request.body;
        userId = req.userid;
        insightId = req.insightId;
        if(insightId){
          updateInsightQuery = InsightSchema.findOne({"_id": insightId,"userid":userId}).select("insightbody title");
            ////console.log("updateInsightQuery",updateInsightQuery)
            updateInsightQuery.exec((err,insight) => {
              if(err){
              //  //console.log(err);
                reject(err);
              }else{
                ////console.log(insight);
                resolve(insight);
              }
            })

        }else{
          reject(",Insight Id cannot be empty");
        }
      }catch(error){
        reject(error)
      }


    })


  }


  updateInsight(request){
    return new Promise((resolve,reject) =>{
      try{
         let req,userId,saveInsight,insightId,updateInsightQuery,updatedDate,sample;
         req = request.body;
         userId = req.userid;
         insightId = req.insightId;
         updatedDate = new Date();
         if(req.InsightBody){
           sample = req.InsightBody.slice(0, AppVariable.insight.sampleLength);
         }else{
           sample = "";
         }
         if(insightId){
           updateInsightQuery = InsightSchema.findOneAndUpdate({"_id": insightId,"userid":userId},
           {insightbody:req.InsightBody,
            title: req.InsightTitle.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, ''),
            sample:sample,
            updatedDate: updatedDate
          });
             ////console.log("updateInsightQuery",updateInsightQuery)
             updateInsightQuery.exec((err,insight) => {
               if(err){
                 reject(err);
               }else{
                 resolve(insight);
               }
             })

         }

         else{
           reject(",Insight Id cannot be empty");
         }
      }catch(error){
        ////console.log("error",error);
        reject(error);
      }
    });
  }

  createInsight(request){
    return new Promise((resolve,reject) => {
      try{
        let req,title,newInsight,savedInsight,insightID,userID,sample;
        req = request.body;
        title = req.InsightTitle.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        if(req.InsightBody){
          sample = req.InsightBody.slice(0, AppVariable.insight.sampleLength);
        }else{
          sample = "";
        }

        userID = req.userid;
        ////console.log("Insight Title",req.InsightTitle)
        if( title){
        newInsight = new InsightSchema({
            title: title,
            insightbody : req.InsightBody,
            sample : sample,
            userid : userID,
            createdDate : Date.now()
          });
          newInsight.save((err,insight) => {
            if(err){
               reject(err);
            }else{
              insightID = insight.id;
              this.configInsight(userID,insightID).then((user) => {
                  resolve(insight.id);
              }).catch((error) => {
                ////console.log(error);
              })
            }
          })
        }else{
          reject("title cannot be empty");
        }
      }catch(error){
        reject(error);
      }
    });
  }

  configInsight(userID,insightID){
    return new Promise((resolve,reject) => {
      try{
      let insight =   {"insightDetail": insightID , "insightID" : insightID};
        UserSchema.findByIdAndUpdate(userID,{ "$push": { "insights": insight } },{new:true},(err,user) => {
          if(err){
            ////console.log(err);
            reject(err);
          }else{
          //  //console.log("USER integrated",user);
            resolve(user)
          }
        })
      }catch(error){
        ////console.log(error);
        reject(error);

      }
    });
  }


  deleteInsight(){

  }

  readInsight(){

  }

}


module.exports = Insight;
