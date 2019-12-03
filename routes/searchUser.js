var express = require('express');
var router = express.Router();
var UserModule = require("../module/userModule");
let user;

searchUser = async (request,res,next) =>{
    try{
        let _userModule =  new UserModule(); 
        let userDetails;  
        let req =  request.body;
        userDetails = await _userModule.searchuser(req.userText);
        res.json(1,"Success",userDetails);
    }catch(error){
        console.log("ERROR",error);
    }
}

module.exports = searchUser;