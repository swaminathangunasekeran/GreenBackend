/**
 * Created by Swami on 06/06/17.
 */
//var express = require('express');
var app =   require("../app");
const jwt    = require('jsonwebtoken');
const superSecret = app.get("superSecret");
const verifySecret = app.get("verifySecret");
const Cookies = require( "cookies" );
const logger = require('morgan');

var reqHandler = function(req, res, next){
    let reqURl = (req.url).split("?")[0];
    let token;
  if(reqURl === "/verifyUser" || reqURl === "/updatePassword"){
    token = reqURl ==="/verifyUser" ?req.query.token : req.get('Authorization');
    if(token){
      jwt.verify(token, verifySecret, function(err, decoded) {
          if(err || !decoded ){
               res.json(-1,"not an valid userw");

          }else{
      //  console.log("USER request is ---"+decoded.userid); // bar
          req.body.userid = decoded.userid;
           //res.json(23,"Success",decoded.userid);
          next();
          }
      });
    }else{
      res.json(-1,"not an valid users");
    }

  }else{
    let cookies = new Cookies( req, res)
    token = req.get('Authorization');
    let anonymousUser =req.get( "anonymousUser" )
    if(token){
        jwt.verify(token, superSecret, function(err, decoded) {
            if(err || !decoded || !req.body ){
                 res.json(-1,"not an valid user");

            }else{
         console.log("USER request is ---"+decoded.userid); // bar
            req.body.userid = decoded.userid;
             //res.json(23,"Success",decoded.userid);
            next();
            }
        });
    }else if(anonymousUser){
      req.body.userid = null;
      req.body.anonymousUser = anonymousUser;
      next();
    }else{
      req.body.userid = null;
      req.body.anonymousUser = null;
      next();
    }

  }


}
module.exports = reqHandler;
