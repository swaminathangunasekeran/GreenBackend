const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

const readSchema = mongoose.Schema({
  insightid : {
    type: Schema.Types.ObjectId , ref:"publishedinsight"
  },
   readers : [{
     user:{ type: Schema.Types.ObjectId, ref: 'users'} ,
     readDate: {
       type :Date,
       default: Date.now
     } }],
   annonymousReaders:[
     {
       user:{type: Schema.Types.ObjectId, ref: 'annonymous'},
       readDate: {
       type :Date,
       default: Date.now
     }}
   ]
},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

readSchema.plugin(mongooseHidden);
readSchema.plugin(uniqueValidator);
//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('reads',readSchema);
