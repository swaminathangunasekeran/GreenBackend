const mongooseHidden = require('mongoose-hidden')()
const mongoose = require('mongoose');
//const users = require("./user");
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

const publishedinsightSchema = mongoose.Schema({
  _id: { type: Schema.ObjectId, auto: true },
  title :{
     type:String,
     unique: true
  },
  titleImage:{
    type:String,
  },
  body : {
     type:String
  },
  sample : {
    type:String
  },
  language:{
    type:String,
    default:"en"
  },
  editorsPick:{
   type:Boolean,
   default:false
  },
  trending:{
    type:Boolean,
    default:false
  },
  homePage:{
    type:Boolean,
    default:false
  },
  createdDate : {
      type: Date,
      required : true
   },updatedDate : {
    type :Date,
    default: Date.now
  },url:{
    type: String
  },tags :{
    type : [String]
  },topic:{
    type :  Schema.Types.ObjectId, ref: 'topics',
    required:true
  },insight: {
    type: Schema.Types.ObjectId, ref: 'insights',
    unique: true
  },author : {
    type: Schema.Types.ObjectId, ref: 'users'
  },
  publisher:{
    type: Schema.Types.ObjectId, ref: 'users'
  },publication :{
    type:Schema.Types.ObjectId, ref: 'publications'
  },menu: {
    type:Schema.Types.ObjectId, ref: 'menu'
  },comments:[ 
    {
    user:{ 
    type: Schema.Types.ObjectId, 
    ref: 'users',
  },date:{type:Date,default:Date.now},
   comment:{type:String}
  },{reactions : [ 
    {
    _id:false,  
    user:{ 
    type: Schema.Types.ObjectId, 
    ref: 'users',
  },reactionType:{
    type:Number, //1:like
   },date:{type:Date,default:Date.now},
   comments:{type:String}
  }
]}
],reactions : [ 
    {
    _id:false,  
    user:{ 
    type: Schema.Types.ObjectId, 
    ref: 'users',
  },reactionType:{
    type:Number, //1:like
   },date:{type:Date,default:Date.now},
   comments:{type:String}
  }
],bells:{
    type :Schema.Types.ObjectId, ref: 'bell'
  },readers : [{
      _id:false,
       user:{ type: Schema.Types.ObjectId, ref: 'users'} ,
       readDate: {
         type :Date,
         default: Date.now
       } }],
     annonymousReaders:[
       {
         _id:false,
         user:{type: Schema.Types.ObjectId, ref: 'annonymous'},
         readDate: {
         type :Date,
         default: Date.now
       }}
     ],share : {
    type :Schema.Types.ObjectId, ref: 'shares'
  },
views:{type:Number,default:0},
  status : {
      type :Number,
      default: 0  // 0 waiting for approval, 1 approved, -1 rejected , 3 deleted
  },addUserReq:[{
    requestedUser : {type:Schema.Types.ObjectId,ref:'users'},
    role: {type:Number,default:0},
    createdDate: {}
  }]

},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

publishedinsightSchema.plugin(mongooseHidden);
publishedinsightSchema.plugin(uniqueValidator);

//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('publishedinsight',publishedinsightSchema);
