const PublishedInsightSchema = require('../schema/publishedInsight');
const InsightSchema = require('../schema/insight');
const UserSchema = require('../schema/user');
const ReqInfo =  require('../util/requestInfo');

 class UserInfo{

   constructor(){
     this.reqInfo = new ReqInfo();
   }
   getUserPublications(request){
     return new Promise((resolve,reject) => {
       try{
         let userID = this.reqInfo.getUserID(request);
         UserSchema.findById(userID,user => {
           resolve(user.publications);
         });
       }catch(error){
         reject(error);
       }
     })
    }

 }
