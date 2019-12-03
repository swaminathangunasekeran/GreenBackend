const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')();
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

const usersSchema = Schema({

     firstName :{
        type:String,
        required :true,
     },
     middleName : {
        type:String
     },
     role : {
        type: Number,
        required : false,
     },
     lastName : {
         type:String
     },email : {
         type:String,
         required : true,
         unique : true

     },skills : {
        type: [Schema.Types.Mixed]
     },
     language:{
       type:String,
       default:"en"
     },
     isUserVerified : {
        type:Boolean,
        default:true,

     },ispswdChangeIntitated:{
       type:Boolean,
       default:false,

     },
     mobile : {
        type: Number
     },
     mango : {
        type: String,
        select :false,
        required:true,
        hide: true
     },
     knife : {
        type: String,
        select :false,
        required:true,
        hide: true
     },
     createdDate : {
        type: Date,
        required : true
     },
     fbID:{
       type:String
     },
     userName:{
       type:String,
       unique : true
     },
     description:{
       type:String,
       default:""
     },
     updatedDate : {
      type :Date,
      default: Date.now,
      hide: true
    },publications:[{//1 -admin,2-editor,3-member,4-follower 5- req pending for approval, also default cause extra only one publicatrions in db
       _id:false,
       pubDetails:{type: Schema.Types.ObjectId, ref: 'publications'},
       pubId: {type: Schema.Types.ObjectId, ref: 'publications'},
       role :{type: Schema.Types.Number,default:4},
       approvedBy : { type: Schema.Types.ObjectId, ref: 'users' }
     }],
    insights : [{_id:false, insightDetail : {type: Schema.Types.ObjectId , ref: "insights"},insightID : {type:String} }],
    publishedInsight : [{_id:false, insightDetail : {type: Schema.Types.ObjectId , ref: "publishedinsight"},insightID : {type:String} }],
    profilePic :{type:String},
    coverPic : {type:String},
    timeline:[{
       insight:{type: Schema.Types.ObjectId , ref: "insights"},
       actionType:{type:Number}, // 1-reaction,2-comments,3-share,4-read
       date:{
         type :Date,
         default: Date.now,
       },
    }],
    followers:[{
      _id:false,
       user:{ 
          type: Schema.Types.ObjectId, 
         ref: 'users'
      },
      date:{
         type :Date,
         default: Date.now,
      }
    }],
    following:[{
      _id:false,
       user:{ 
      type: Schema.Types.ObjectId, 
     ref: 'users',
     
  },
  date:{
     type :Date,
     default: Date.now,
  },
  avg:{
     type:Number,
     default:1,
     hide: true
  }

}]


},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

usersSchema.plugin(mongooseHidden);
usersSchema.plugin(uniqueValidator);
usersSchema.methods.addToTimeLine = function (insightDetails,cb) {
   console.log("INSIGHT DETAILS",insightDetails)
   if(insightDetails && insightDetails.insight && insightDetails.actionType){
      this.timeline.push(insightDetails)
      cb(null, this.reactions)
   }else{
      cb("reaction empty")
   }

}

usersSchema.methods.removeFromTimeLine = function (reaction,cb) {
   if(reaction && reaction.insight && reaction.reactionType){
      // this.reactions.filter({},{$pull:{reactions:reaction.insight}})
      cb(null, this.reactions)
   }else{
      cb("reaction empty")
   }

}

//const Contact = module.exports = mongoose.model('Users',userSchema);
const User =  mongoose.model('users',usersSchema);
//User.watch().on('change',data => console.log(new Date(), data));
module.exports = User;
