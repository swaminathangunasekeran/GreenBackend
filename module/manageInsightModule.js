const InsightSchema = require('../schema/insight');
const PublishedInsightSchema = require('../schema/publishedInsight');
const UserSchema = require('../schema/user');
const UrlFraming =  require("../util/urlFraming");
const UserClassified = require("../util/userClassfied");
const AppVariable =  require("../util/appVariables");
const ReqModule =  require("./reqModule");
const PublicationsSchema =  require("../schema/publications");
const PublishInsight =  require("../schema/publishedInsight");
const Reads =  require("../schema/reads");

class ManageInsight{

  constructor(req){
    if(req){
      this.req = req;
      this.urlFraming = new UrlFraming();
      this.pubStatus = 0;
    }

  }




  getWebInsights(language){
     return new Promise((resolve,reject) => {
       try{
         let webInsights;
         console.log("LANGUAGE",language);
         let lan = language || "en";
         console.log("LANGUAGE 23 === ",language);
         webInsights = PublishedInsightSchema.aggregate(

           [
            { $match : {language:lan} },
            { "$lookup": {
              "from": "topics",
              "localField": "topic",
              "foreignField": "_id",
              "as": "topic"
            }},
            {
              "$lookup": {
              "from": "users",
              "localField": "author",
              "foreignField": "_id",
              "as": "authorDetails"
            }},{
              "$addFields": {
                "authorDetails":{
                   "$map": {
                      "input": "$authorDetails",
                      "as": "author",
                      "in": {
                         "name": "$$author.firstName",
                        "userName" : "$$author.userName" ,
                        "description" : "$$author.description" ,
                        "profilePic" : "$$author.profilePic",
                        "coverPic" : "$$author.coverPic"

                      }
                   }
                }
              }
            },
            { $project : {
              status : 1 ,
              title : 1,
              // author:1,
              // readers:1,
              editorsPick:1,
              // language:1,
              authorDetails:1,
              homePage:1,
              trending:1,
              createdDate:1,
              titleImage:1,
              sample:1,
              url:1,
              publication:1,
              updatedDate:1,
              topic:1,
              insight:1,
              numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "NA"}}
            } },

            // { $group: { _id:"$title" ,sample:"$sample"} },

            { $sort : { updatedDate : 1} },

            ]
         )
         webInsights.exec((err,insights) => {
           if(err){
            reject(err);
           }else{
             resolve(insights);
           }
         })
       }catch(error){
           resolve("error"+error);
       }
     });
   }

   updatePublishedInsight(request){
     return new Promise((resolve,reject) => {
       try{
         let req =  request.body
         let insightID = req.insightId;
         let pubStatus = req.status;
         let isHomepage = req.homePage;
         let isTrending = req.trending;
         let isEditorsPick = req.editorsPick;
         let deleteStatus = req.isDelete;
           let publishInsight;
           // let sample = "";
           // if(req.InsightBody){
           //   sample = req.InsightBody.slice(0, AppVariable.insight.sampleLength);
           // }

          if(pubStatus){
            publishInsight = {
           "status":pubStatus,
           "homePage":isHomepage,
           "trending":isTrending,
           "editorsPick":isEditorsPick
            }

          PublishedInsightSchema.findByIdAndUpdate(req._id,
            publishInsight,
            {new:true},
            (err,insight) => {
              if(err){
                reject(err);
              }else if(!insight){
                reject("not an valid insight");
              }else{
                if(pubStatus === AppVariable.insightStatus.deleted){
                    InsightSchema.findByIdAndUpdate(insight.insight,
                      {"status":pubStatus},{new:true},(err,insight) => {
                        if(err){
                          reject(err);
                        }else if(!insight){
                          reject("not an valid insight");
                        }else{
                          console.log("INSIGHT",insight)
                        resolve(insight);
                        }
                    })
                }
                else{
                //   console.log("INSIGHT ---00",insight.insight)
                  resolve(insight.insight);
                }
              }
          });
        }else{
          reject("not valid request");
        }

       }catch(error){
         console.log("ERROR ON UPDATE",error)
       }

     })
   }




  configUser(userID,insightID){
    return new Promise((resolve,reject) => {
      try{
        let insight =   {"insightDetail": insightID , "insightID" : insightID};
        UserSchema.findByIdAndUpdate(userID,{ "$push": { "publishedInsight": insight } },{new:true},(err,user) => {
          if(err){
          //  //console.log("configUser",err);
            reject(err);
          }else{

            resolve(user);
          }
        })
      }catch(error){
        ////console.log(error);
        reject(error);

      }
    });
  }

}


module.exports = ManageInsight;
