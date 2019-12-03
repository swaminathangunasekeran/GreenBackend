const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const mongooseHidden = require('mongoose-hidden')()
//const users = require("./user");
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

const topicsSchema = mongoose.Schema({
  title :{type: String}
})

topicsSchema.plugin(mongooseHidden);
topicsSchema.plugin(uniqueValidator);

module.exports = mongoose.model('topics',topicsSchema);
