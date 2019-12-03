const InsightSchema = require('../schema/insight');
const PublishedInsightSchema = require('../schema/publishedInsight');
const TopicsSchema = require('../schema/topics');
const UserSchema = require('../schema/user');
const UrlFraming =  require("../util/urlFraming");
const UserClassified = require("../util/userClassfied");
const AppVariable =  require("../util/appVariables");
const ReqModule =  require("./reqModule");
const PublicationsSchema =  require("../schema/publications");
const ReactionSchema =  require("../schema/reactions");
const mongoose = require ('mongoose');
// const PublishInsight =  require("../schema/publishedInsight");
const Reads =  require("../schema/reads");
const Feed = require('feed-to-json');


class Publish{

  constructor(req){
    if(req){
      this.req = req;
      this.urlFraming = new UrlFraming();
      this.pubStatus = 0;
    }

  }

  getUserTrendingInsights(language,userId){
    return new Promise((resolve,reject) => {
      try{
        let homepageQuery;
        let lan = language || "en";
        homepageQuery = PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,trending:true ,language:lan} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "0"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},
             userReaction:{  $filter:{
              input:"$reactions",
              as : "userReaction",
              cond : {"$eq":  [ "$$userReaction.user", mongoose.Types.ObjectId(userId)]}
             }},
             userReadStatus:{  $filter:{
              input:"$readers",
              as : "readers",
              cond : {"$eq":  [ "$$readers.user", mongoose.Types.ObjectId(userId)]}
             }},
             userCommentStatus:{  $filter:{
              input:"$comments",
              as : "comments",
              cond : {"$eq":  [ "$$comments.user", mongoose.Types.ObjectId(userId)]}
             }}
           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },

           ]
        )
        homepageQuery.exec((err,insights) => {
          if(err){
           reject(err);
          }else{
            // console.log("topicID",insights[0])
            resolve(insights);
          }
        })
      }catch(error){
          resolve("error"+error);
      }
    });
  }


  getTrendingInsights(language){
    return new Promise((resolve,reject) => {
      try{
        let homepageQuery;
        let lan = language || "en";
        homepageQuery = PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,trending:true ,language:lan} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "NA"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}}
           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },

           ]
        )
        homepageQuery.exec((err,insights) => {
          if(err){
           reject(err);
          }else{
            // console.log("topicID",insights[0])
            resolve(insights);
          }
        })
      }catch(error){
          resolve("error"+error);
      }
    });
  }

  async getTopicId(topic){
    const topicDetails = await TopicsSchema.findOne({title:topic},(err,topicInfo) => {
      if(err){
        reject(err);
       }else{
         // console.log("topicID",insights[0])
         return topicInfo
       }
    })

    return topicDetails;
  }


  getUserTopicInsight(topic,language){
    return new Promise(async (resolve,reject) => {
      try{
        let topicQuery;
        let lan = language || "en";
        const topicId = await this.getTopicId(topic);
        topicQuery= PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,language:lan,topic:topicId._id} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "NA"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},
             userReaction:{  $filter:{
              input:"$reactions",
              as : "userReaction",
              cond : {"$eq":  [ "$$userReaction.user", mongoose.Types.ObjectId(userId)]}
             }},
             userReadStatus:{  $filter:{
              input:"$readers",
              as : "readers",
              cond : {"$eq":  [ "$$readers.user", mongoose.Types.ObjectId(userId)]}
             }},
             userCommentStatus:{  $filter:{
              input:"$comments",
              as : "comments",
              cond : {"$eq":  [ "$$comments.user", mongoose.Types.ObjectId(userId)]}
             }}
           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },
  
           ]
        )
       
        topicQuery.exec((err,insights) => {
          if(err){
           reject(err);
          }else{
            console.log("topicID",insights[0])
            resolve(insights);
          }
        })
      }catch(error){
        resolve("error"+error);
      }
     

    })
  }



   getTopicInsight(topic,language){
    return new Promise(async (resolve,reject) => {
      try{
        let topicQuery;
        let lan = language || "en";
        const topicId = await this.getTopicId(topic);
        topicQuery= PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,homePage:true ,language:lan,topic:topicId._id} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "NA"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},
           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },
  
           ]
        )
       
        topicQuery.exec((err,insights) => {
          if(err){
           reject(err);
          }else{
            // console.log("topicID",insights[0])
            resolve(insights);
          }
        })
      }catch(error){
        resolve("error"+error);
      }
     

    })
  }


  getUserTopicInsight(topic,language,userId){
    return new Promise(async (resolve,reject) => {
      try{
        let topicQuery;
        let lan = language || "en";
        const topicId = await this.getTopicId(topic);
        topicQuery= PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,homePage:true ,language:lan,topic:topicId._id} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "NA"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},
             userReaction:{  $filter:{
              input:"$reactions",
              as : "userReaction",
              cond : {"$eq":  [ "$$userReaction.user", mongoose.Types.ObjectId(userId)]}
             }},
             userReadStatus:{  $filter:{
              input:"$readers",
              as : "readers",
              cond : {"$eq":  [ "$$readers.user", mongoose.Types.ObjectId(userId)]}
             }},
             userCommentStatus:{  $filter:{
              input:"$comments",
              as : "comments",
              cond : {"$eq":  [ "$$comments.user", mongoose.Types.ObjectId(userId)]}
             }}
           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },
  
           ]
        )
       
        topicQuery.exec((err,insights) => {
          if(err){
           reject(err);
          }else{
            // console.log("topicID",insights[0])
            resolve(insights);
          }
        })
      }catch(error){
        resolve("error"+error);
      }
     

    })
  }

  getUserHomePage(language,userId){
    return new Promise((resolve,reject) => {
      try{
        let homepageQuery;
        let lan = language || "en";
        console.log("GET USER HOME PAGE")
        homepageQuery = PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,homePage:true ,language:lan} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "0"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},
             userReaction:{  $filter:{
              input:"$reactions",
              as : "userReaction",
              cond : {"$eq":  [ "$$userReaction.user", mongoose.Types.ObjectId(userId)]}
             }},
             userReadStatus:{  $filter:{
              input:"$readers",
              as : "readers",
              cond : {"$eq":  [ "$$readers.user", mongoose.Types.ObjectId(userId)]}
             }},
             userCommentStatus:{  $filter:{
              input:"$comments",
              as : "comments",
              cond : {"$eq":  [ "$$comments.user", mongoose.Types.ObjectId(userId)]}
             }}
           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },

           ]
        )
        homepageQuery.exec((err,insights) => {
          if(err){
           reject(err);
          }else{
            // console.log("topicID",insights[0])
            resolve(insights);
          }
        })
      }catch(error){
          resolve("error"+error);
      }
    });
  }



  getHomePage(language){
    return new Promise((resolve,reject) => {
      try{
        let homepageQuery;
        let lan = language || "en";
        homepageQuery = PublishedInsightSchema.aggregate(
          [
          { $match : { status : 1,homePage:true ,language:lan} },
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
             // status : 1 ,
             title : 1,
             // author:1,
             // readers:1,
             authorDetails:1,
             editorsPick:1,
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
             numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "0"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},

           } },
           // { $group: { _id:"$title" ,sample:"$sample"} },
           { $sort : { createdDate : -1} },

           ]
        )
        homepageQuery.exec((err,insights) => {
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

   deletecomment(request) {
    return new Promise(async (resolve,reject) => {
      try{
        let req,userId,insightid,deleteCommentQuery,commentid; 
        req = request.body;
        userId = req.userid;
        insightid = req.insightid;
        commentid = req.commentid;
        const canDeleteComment = await this.canDeleteComment(req);
        if(canDeleteComment){
          deleteCommentQuery = PublishedInsightSchema.findOneAndUpdate(
            {_id:insightid },{
            $pull: {
              "comments":{ "_id" :commentid}
            } 
          },{new:true,upsert:true});
  
          deleteCommentQuery.exec((err,insight)=>{
            if(err){
              reject(err)
            }
            if(insight){
              resolve(insight.comments);
            }else{
              reject("not valid insight")
            }
            
          })
        } else{
          reject("Not valid user or comment to delete");
        }
  
      }catch(error){
        console.log("ERROR ==== ",error);
      }
    })
  }


  canDeleteComment (req) {
    try{
      let userId,insightid,deleteCommentQuery,commentid,requestDetails; 
      requestDetails = req;
      userId = requestDetails.userid;
      insightid = requestDetails.insightid;
      commentid = requestDetails.commentid;
      return new Promise((resolve,reject) => {
        const insight = PublishedInsightSchema.findById(insightid,(err,insightDetails)=>{
          if(err){
            resolve(false)
          }
        const comment = insightDetails.comments.id(commentid);     
        if(comment && insightDetails ){  
          if((comment.user.toString() === userId.toString() || insightDetails.author.toString() === userId.toString())){
            resolve(true);   
          }
        }
        resolve(false)
        });  
      })
    }catch(eror){
      resolve(false);
    }

  }

   getComments(request){
    return new Promise((resolve,reject) => {
      try{
          let req,insightId,getCommentsQuery;
          req = request.body;
          insightId = req.insightId;
          console.log("INSIGHTID IS",insightId)
            // getCommentsQuery =  PublishedInsightSchema.find({ _id : insightId},{comments:1,_id:0})
            getCommentsQuery =  PublishedInsightSchema.aggregate([
              { $match : { _id : mongoose.Types.ObjectId(insightId)} },
              {$unwind:"$comments"},
              { $project : {
                _id:0,
                comments:1,
              } 
            },{
              "$lookup": {
              "from": "users",
              "localField": "comments.user",
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
              },
              
            },{$project : {
              comments:1,
              authorDetails:1
            }}

            ])
            //   updateInsightQuery = PublishedInsightSchema.find({url:url})
            //   .select("body title _id author titleImage")
            //   .populate(
            //   {path : "author",
            //   select : "firstName userName description profilePic"}
            // );
            getCommentsQuery.exec((err,comments) => {
                if(err){
                  reject(err);
                }
                else{
                  console.log("COMMENTS",comments)
                  resolve(comments);
                }
              })

         
      }catch(error){
          resolve("no error"+error);
      }
    });
  }

  comment(request) {
    return new Promise((resolve,reject) => {
      try{
        let req,userId,insightid,commentQuery,comment; 
        req = request.body;
        userId = req.userid;
        insightid = req.insightid;
        comment = req.comment;
        console.log("TYPE OF COMMENT",typeof comment)
        if(typeof comment === "string" && comment.length > 0 && insightid){
          commentQuery = PublishedInsightSchema.findByIdAndUpdate(
            insightid,{
            $push: {
              "comments":{
              "user" :userId,
              "comment": comment.toString()
            }
            } 
          },{new:true,upsert:false});
  
          commentQuery.exec((err,insight)=>{
            console.log("insight ==== ",insight);
            console.log("ERROR",err)
            if(err){
              reject(err)
            }
            if(insight && insight.comments)
            {
              resolve(insight.comments);
            }else{
              reject("not valid comment in insight")
            }
            
          })
        }else{
          reject("not valid comment")
        }
    
      }catch(error){
        console.log("ERROR ==== ",error);
        reject(err)
      }
    })
  }

  likeInsight(request){
    return new Promise((resolve,reject) => {
      try{
        let req,userId,insightid,likeQuery,updateUserReaction; 
        req = request.body;
        userId = req.userid;
        insightid = req.insightid;
        console.log("INSIGHT ID",insightid);
        likeQuery = PublishedInsightSchema.findOneAndUpdate(
          
            {_id:insightid,"reactions.user":{$ne:userId}}
          ,{
          $push: {
            "reactions":{
            "user" :userId,
            "reactionType": 1
          }
          }
        },{new:true,upsert:true});
        

        likeQuery.exec((err,insight)=>{
          if(err){
            reject(err)
          }
          if(insight){
            updateUserReaction = {
              insight:insightid,
              reactionType:1,
            }
            resolve(insight.reactions);
          }
          reject("not valid insight")
          
        })

        this.addToTimeLine(userId,insightid,1)

      
      }catch(error){
        console.log("ERROR ==== ",error);
        reject(error)
      }
    })
  }

  unlikeInsight(request){
    return new Promise((resolve,reject) => {
      try{
        let req,userId,insightid,unlikeQuery,updateUserReaction; 
        req = request.body;
        userId = req.userid;
        insightid = req.insightid;
        console.log("")
        unlikeQuery = PublishedInsightSchema.findOneAndUpdate(
          {_id:insightid,"reactions.user":{$eq:userId}},{
          $pull: {
            "reactions":{"user":userId}
          } 
        },{new:true,upsert:true});

        unlikeQuery.exec((err,insight)=>{
          if(err){
            reject(err)
          }
          if(insight){
            resolve(insight.reactions);
          }
          reject("not valid insight")
        })

        this.removeFromTimeLine(userId,insightid,1)

      }catch(error){
        console.log("ERROR ==== ",error);
      }
    })
  }


  addToTimeLine(userId,insightid,actionType){
    if(userId && insightid && actionType){
      const timelineUpdate =  UserSchema.update(
        {_id:userId,"timeline.insight":{$ne:insightid},"timeline.actionType":{$ne:actionType}},{
        $push: {
          "timeline":{"insight":insightid,"actionType":actionType}
        } 
      },{new:true,upsert:true});
  
      timelineUpdate.exec((err,insight)=>{
        if(err){
          // console.log(err)
        }
        if(insight){
          // console.log(insight);
        }
        // console.log(insight);
      })
    }
  
  }


  removeFromTimeLine(userId,insightid,actionType){
    if(userId && insightid && actionType){
      const timelineUpdate =  UserSchema.update(
        {_id:userId,"timeline.insight":{$eq:insightid},"timeline.actionType":{$eq:actionType}},{
        $pull: {
          "timeline":{"insight":insightid}
        } 
      },{new:true,upsert:true});
  
      timelineUpdate.exec((err,insight)=>{
        if(err){
         // console.log(err)
        }
        if(insight){
          // console.log(insight);
        }
        // console.log(insight);
      })
    }
   
  }

 

  getInsightToRead(request){
    return new Promise((resolve,reject) => {
      try{
          let req,url,updateInsightQuery,userId,annonymousId;
          req = request;
          url = req.params.insightURL;
          userId = req.body.userid;
          annonymousId = req.body.anonymousUser ;
          let author;
          if(url){
            updateInsightQuery =  PublishedInsightSchema.aggregate([
              { $match : { url : url} },
              { $project : {
                // status : 1 ,
                body : 1,
                // author:1,
                // readers:1,
                updatedDate:1,
                title:1,
                author:1,
                titleImage:1,
                numberOfreads:{ $cond: { if: { $isArray: "$readers" }, then: { $size: "$readers" }, else: "0"}},
             numberOfLikes:{ $cond: { if: { $isArray: "$reactions" }, then: { $size: "$reactions" }, else: "0"}},
             numberOfComments:{ $cond: { if: { $isArray: "$comments" }, then: { $size: "$comments" }, else: "0"}},
                userReaction:{  $filter:{
                  input:"$reactions",
                  as : "userReaction",
                  cond : {"$eq":  [ "$$userReaction.user", mongoose.Types.ObjectId(userId)]}
                 }},
              } 
            },{
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
            }

            ])
            //   updateInsightQuery = PublishedInsightSchema.find({url:url})
            //   .select("body title _id author titleImage")
            //   .populate(
            //   {path : "author",
            //   select : "firstName userName description profilePic"}
            // );
              updateInsightQuery.exec((err,insight) => {
                if(err){
                console.log(err);
                  reject(err);
                }else if(!insight || insight.length < 1){
                    console.log("INSIGHT NOT VALID",insight);
                  reject("not an valid insight");
                }
                else{
                insight = insight[0];
                author = {
                  email : insight.author.email,
                  name: insight.author.firstName,
                  userName: insight.author.userName,
                  description: insight.author.description,
                  profilePic:insight.author.profilePic
                }
                insight.author  =author;
                insight.id= insight._id;
                  resolve(insight);
                   this.updateInsightRead(insight._id,req)
                }
              })

          }else{
              resolve("no URL");
          }
      }catch(error){
          resolve("no error"+error);
      }
    });
  }

  updateInsightRead(insightid,req){
    let updateRead,userId ;
    userId = req.body.userid
    if(userId){
      // updateRead = PublishedInsightSchema.update({"_id":insightid},{ $addToSet : {
      //     "readers":{"user" :req.body.userid,"readDate":Date.now()} }},false);

      updateRead  = PublishedInsightSchema.update(
        {_id:insightid,"readers.user":{$ne:userId}},{
        $push: {
          "readers":{
          "user" :userId,
        }
        } 
      },{new:true,upsert:true});

      updateRead.exec()
      this.addToTimeLine(userId,insightid,4)
     }
    else if(req.body.anonymousUser){
      
          updateRead =  PublishedInsightSchema.update(
            {_id:insightid,"annonymousReaders.user":{$ne:req.body.anonymousUser}},{
            $push: {
              "annonymousReaders":{
              "user" :req.body.anonymousUser,
            }
            } 
          },{new:true,upsert:true});

      updateRead.exec()
    }
  }

  approveInsight(request){
    return new Promise((resolve,reject) => {
      try{
        let req =  this.req.body;
        let approval =  true?req.action ==1 :false;
        let pubId = req.pubId;
        let insightId =  req.insightId;
        let pubInsightId =  req.pubinsightId;
        let approveaction = 1;
        let rejectAction = 0;
        PublicationsSchema.findByIdAndUpdate(pubId,
          {$pull:{insightRequest:pubInsightId}}, (err,publication)=>{
            if(publication){
              if(approval && pubInsightId){
                this.configPublishInsight(pubInsightId,approveaction).then((pubInsight)=>{
                  ////console.log("PubInsight",pubInsight)
                  resolve(pubInsight)

                }).catch((error) => {
                  ////console.log("error on Insight",error)
                  reject(error);
                });
              }else if(insightId && !approval){
                this.configInsight(insightId,rejectAction,pubInsightId,publication.url).then((insight) => {
                  resolve(insight)
                }).catch((error) => {
                  reject(error);
                });
              }else{
                reject("not valid insight");
              }
            }
          })

      }catch(error){
        reject(error);
      }
    });
  }


  reqRePublishInsight(){
  return new Promise((resolve,reject) => {
      try{
        let req,title;
        req = this.req;
        title = req.InsightTitle;
        let userClassFied =  new UserClassified();
        if( title && req.insightId){
          userClassFied.getUserfromRequest(req).then((user)=>{
            userClassFied.canPublishInsight().then(isAllowed => {
            if(isAllowed){
              let url = this.urlFraming.getPublicationUrl(title);
              this.updatePublishedInsight(req).then((insight) => {
                    resolve(insight)
                  }).catch((error) => {
                        reject(error);
                   })
                 }else{
                     reject("user not allowed");
                 }
              }).catch((error) => {
                      reject(error);
              });
          }).catch((error) => {
                  reject(error);
             });
            }else{
              reject("Insight cannot be empty");
            }
      }catch(error){
        reject(error);
      }
    });
  }

  getRss(request){
    return new Promise(async (resolve,reject) => {
        try{
          let req;
          req = request.body;
          Feed.load(req.rssUrl, async(err, rss) => {
                let updatedRss = await this.rssFeedToDB(rss,req);
                console.log("updatedRss",updatedRss)
                resolve(updatedRss);
          });
          // let updatedRss = await this.rssFeedToDB(updatedRss,req);
          // console.log("REPONSE",updatedRss)
          // resolve(updatedRss);
        }catch(error){
          console.log("error",error)
            reject(false);
        }
    })
  }


   async rssFeedToDB(response,req){
     try{
      let author = req.author;
      let userClassFied =  new UserClassified();
      let findUser  = await userClassFied.getuser(author);
      // return response;
      let insightList = [];
      response.items.forEach(async (item,index) => {
       
        if(index === response.items.length){
          return insightList;
        }else{
          const newInsight = new InsightSchema({
            title: item.title,
            insightbody : item.content,
            sample : item.description,
            userid : findUser._id,
            createdDate : item.pubDate
          });
          await newInsight.save((err,insight) => {
            if(err){
              console.log("REPONSE ERROR",err)
              return err;
            }else{
              // console.log("REPONSE INSIGHT",insight)
              let insightID = insight._id;
              this.conInsight(findUser._id,insightID).then((user) => {
                // console.log("INSIGHT",user)
                // insightList.push(insight.id);
              }).catch((error) => {
                console.log("ERRO",error);
              })
              // insightList.push(insightID);
              // console.log("INSIGHT LIST",insightList)
            }
          })
        }
        

      })
      // for(let i =0 ; i <= response.items.length ; i++){
  
      //   if( i ===  1){
      //     return insightList ; 
      //   }else{
         
      //   }
      // }
     }catch(err){
      console.log("FIND USER ERROR",err)
     }
  

   //return response;

     
    // let title,link,body;
    //    response.result.items.forEach(item => {
    //     console.log(item.title + ':' + item.link)
       
    //   });
   }



   conInsight(userID,insightID){

     return new Promise((resolve,reject)=> {
       try{
        let insight =   {"insightDetail": insightID , "insightID" : insightID}; 
        UserSchema.findByIdAndUpdate(userID,{ "$push": { "insights": insight } },{new:true},(err,user) => {
          if(err){
            reject(err);
          }else{
            resolve(user)
          }
        })
       }catch(error){
        console.log("FIND USER ERROR",err)
       }
 
      //resolve(true);
     })
   }

 




  reqPublishInsight(){
  return new Promise((resolve,reject) => {
      try{
        let req,title;
        req = this.req;
        title = req.InsightTitle;
        let userClassFied =  new UserClassified();
        if( title && req.insightId && req.language){
          userClassFied.getUserfromRequest(req).then((user)=>{
            userClassFied.canPublishInsight().then(isAllowed => {
            if(isAllowed){
              this.createInsight(req).then((insight) => {
                    resolve(insight)
                  }).catch((error) => {
                        reject(error);
                   })
                 }else{
                     reject("user not allowed");
                 }
              }).catch((error) => {
                      reject(error);
              });
          }).catch((error) => {
                  reject(error);
             });
            }else{
              reject("Insight cannot be empty");
            }
      }catch(error){
        reject(error);
      }
    });
  }

   updatePublishedInsight(req){
     return new Promise((resolve,reject) => {
       let author,publisher,pubStatus;
       let  insightID = req.insightId;
       let publicationsId = req.publication;
       let approveaction = 1;
       let rejectAction = 0;
       let publishedInsightId = req.pubinsightID;
       let topic = req.topic;
       let title = req.InsightTitle;
       let url = this.urlFraming.getPublicationUrl(title)+"-"+req.insightId;
       let imageUrl = req.imageUrl || "";
       let deleteStatus = req.isDelete;
       if(publicationsId == AppVariable.appId){
            pubStatus = !deleteStatus ? AppVariable.insightStatus.published : AppVariable.insightStatus.deleted ;
           author = req.userid;
           publisher = req.userid;
       }else{
         pubStatus = AppVariable.insightStatus.pending;
         author = req.userid;
         publisher =  null;
       }

       if(publishedInsightId && insightID && publicationsId && topic){
         let publishInsight;
         let sample = "";
         if(req.InsightBody){
           sample = req.description.slice(0, AppVariable.insight.sampleLength);
         }
         console.log("UPDAT PUBLISH INSIGHT", sample)
         if(imageUrl !== ""){
            publishInsight = {"title":req.InsightTitle,
           "body":req.InsightBody,
           "topic":topic,
           "url":url,
           "status":pubStatus,
           "titleImage":imageUrl,
            "updatedDate": Date.now(),
            sample }
         }else{
           publishInsight = {
          "title":req.InsightTitle,
          "body":req.InsightBody,
          "topic":topic,
          "url":url,
          "status":pubStatus,
           "updatedDate": Date.now(),
           sample}
         }
         PublishedInsightSchema.findByIdAndUpdate(publishedInsightId,
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
                         resolve(insight);
                       }
                   })
               }
               else{
                 resolve(insight);
               }
             }
         });


       }else{
         reject("not valid request");
       }


     })
   }


   createInsight(req){
     return new Promise((resolve,reject) => {
      let sample ;
       let  insightID = req.insightId;
       let publicationsId = req.publication;
       let author,publisher,pubStatus;
       let approveaction = 1;
       let rejectAction = 0;
       let title = req.InsightTitle.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
       let url = this.urlFraming.getPublicationUrl(title)+"-"+req.insightId;
       let imageUrl = req.imageUrl || "";
       if(publicationsId == AppVariable.appId){
          pubStatus = AppVariable.insightStatus.published;
           author = req.userid;
           publisher = req.userid;
       }else{
         pubStatus = AppVariable.insightStatus.pending;
         author = req.userid;
         publisher =  null;
       }
        if(publicationsId && insightID){
            sample = ""

          publishInsight = new PublishedInsightSchema({
              title: title,
              body : req.InsightBody,
              author : author,
              createdDate : Date.now(),
              publication : publicationsId,
              topic:req.topic,
              insight : req.insightId,
              url:url,
              language:req.language,
              status : pubStatus,
              publisher: publisher,
              titleImage:imageUrl,
              sample
            });
            publishInsight.save((err,pubInsight) => {
              if(err){
                 ////console.log(err);
                 reject(err);
              }else{
                this.configUser(author,pubInsight._id).then((user) => {}).then(() => {
                   ////console.log("PUBLISHDE INSIGHT",pubInsight)
                  this.configInsight(pubInsight.insight,approveaction,pubInsight._id,pubInsight.url).then((insight) => {
                    ////console.log(`pubInsight ${pubInsight._id}`)
                    if( pubStatus == AppVariable.pending){
                      let reqModule = new ReqModule();
                      reqModule.addInsightToPublication(pubInsight).then((publications) =>{
                          resolve(pubInsight);
                      }).catch((error) => {
                       // //console.log(error);
                        reject(error);
                      })
                    }else{
                       resolve(pubInsight);
                    }

                  }).catch((error) => {
                    ////console.log(error);
                    reject(error);
                  })
                }).catch((error) => {
                  ////console.log(error);
                  reject(error);
                })
              }
            })
        }

     })
   }



  configInsight(insightId,status,pubInsightId,pubUrl){
   return new Promise((resolve,reject) => {
     try{
       ////console.log("PUB INSIGHT ID",insightId)
       InsightSchema.findByIdAndUpdate(insightId,{"status":status,"pubinsightID" : pubInsightId,"pubUrl":pubUrl},{new:true},(err,insight) => {
         if(err ){
             ////console.log("configInsight",err);
             reject(err);
         }else if(!insight){
           reject("not valid insight");
         }else{
              ////console.log("insight +++++",insight);
             resolve(insight);
         }
       })
     }catch(error){
       reject(err);
     }
   });
  }
  configPublishInsight(pubInsight,status){
    return new Promise((resolve,reject) => {
      try{

        PublishedInsightSchema.findByIdAndUpdate(pubInsight,{"status":status},{new:true},(err,insight) => {
          if(err){
              ////console.log("configInsight",err);
              reject(err);
          }else{
          //  //console.log("hjfbhjsdghf",insight)
              resolve(insight);
          }
        });
      }catch(error){
        reject(error);
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

  followUser(userid,followid){

  }

}


module.exports = Publish;
