const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var Schema = mongoose.Schema;

const userReqSchema = mongoose.Schema({
  from :{ type: Schema.Types.ObjectId, ref: 'users' ,required:true},
  to :{ type: Schema.Types.ObjectId, ref: 'publications',required:true },
  actionBy :{ type: Schema.Types.ObjectId, ref: 'users' },
   createdDate : {
      type: Date,
      required : true
   },updatedDate : {
    type :Date,
    default: Date.now
  },status:{
    type : Number,
    default: 0 // 0 not read , 1 pending,2 accepted , 3 declined
  }

},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

userReqSchema.plugin(mongooseHidden)
//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('userReq',userReqSchema);
