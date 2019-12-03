const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

const insightSchema = mongoose.Schema({
  title :{
     type:String,
     unique :true,
     required : true
  },
  insightbody : {
     type:String,
     select :false,
  },sample:{
    type:String,

  },
   userid : { type: Schema.Types.ObjectId, ref: 'users' },
   createdDate : {
      type: Date,
      required : true
   },updatedDate : {
    type :Date,
    default: Date.now
  },status:{
    type : Number,
    default: 0 // 0 not published , 1 published
  },pubinsightID : {
    type: Schema.Types.ObjectId , ref:"publishedinsight"
  },pubUrl:{
      type:String
  }

},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

insightSchema.plugin(mongooseHidden);
insightSchema.plugin(uniqueValidator);
//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('insights',insightSchema);
