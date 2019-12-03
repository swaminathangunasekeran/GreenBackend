const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var Schema = mongoose.Schema;

const annonymoususerSchema = mongoose.Schema({
  userID : {
     type : String
  },
  time:{
    type: Date,
    default: Date.now
  }

},{strict: true});
autoIncrement.initialize(mongoose.connection);
annonymoususerSchema.plugin(autoIncrement.plugin, {model: 'annonymous', field:'userId'});
/*usersSchema.methods.getuserName = function () {
    return {firstname: this.first_name,lastname:this.last_name};
}*/

annonymoususerSchema.plugin(mongooseHidden)
//const Contact = module.exports = mongoose.model('Users',userSchema);
module.exports = mongoose.model('annonymous',annonymoususerSchema);
