const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;



const publicationSchema = mongoose.Schema({
  name :{
     type:String,
     unique: true,
     required : true,
  },coverImage : {
    type :String
  },profileImage : {
    type :String
  },description:{
    type :String
  },officialSite:{
    type :String
  },fbAccount:{
    type :String
  },twitterAccount:{
    type :String
  },linkedInAccount:{
    type :String
  },topics:[
    {
  _id:{type: Schema.Types.ObjectId, ref: 'topics' },
  title:{type : String}
  }],
  url:{
    type : String
  },
  language:{
    type:String,
    default:"en"
  },
  admins : [{ type: Schema.Types.ObjectId, ref: 'users' }],
  editors : [{ type: Schema.Types.ObjectId, ref: 'users' }],
   createdDate : {
      type: Date,
      required : true
   },updatedDate : {
    type :Date,
    default: Date.now
  },status : {
      type :String
  },userRequest : [{
    user :{ type: Schema.Types.ObjectId, ref: 'users' },
    requestedDate : {  type: Date,required : true},
    role : {type:Number,default:3}//1 -admin,2-editor,3-member,4-follower 5- req pending for approval,
  }],insightRequest : [{ type: Schema.Types.ObjectId, ref: 'publishedinsight' }]

},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

publicationSchema.plugin(mongooseHidden);
publicationSchema.plugin(uniqueValidator);
//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('publications',publicationSchema);
