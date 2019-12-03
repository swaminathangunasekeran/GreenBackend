const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

const reactionsSchema = mongoose.Schema({
  reactions : [
    
    {user:{ 
    unique:true,
    type: Schema.Types.ObjectId, 
    ref: 'users',
    required: [true, 'User required']
  }},{reactionType:{
    type:Number,
    required: [true, 'ReactionType required']
   }},{date:{type:Date,default:Date.now}},{comments:{type:String}}
],
  insight:{
    unique:true,
    type: Schema.Types.ObjectId, 
    ref:"publishedinsight",
  },
},{strict: true});
//autoIncrement.initialize(mongoose.connection);
//usersSchema.plugin(autoIncrement.plugin, {model: 'user', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

// reactionsSchema.plugin(mongooseHidden);
reactionsSchema.plugin(uniqueValidator);
//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('reactions',reactionsSchema);
