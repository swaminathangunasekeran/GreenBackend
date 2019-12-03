/**
 * Created by Swami on 06/06/17.
 */
var express = require('express');

var resHandler = function(req, res, next){

if( req.url !== "/uploadImage"){
  var oldSend = res.json;
  res.json = function(data){
      // arguments[0] (or `data`) contains the response body
      var args = new Array();
      var response = {};
      response.code =  arguments[0];
      response.msg = arguments[1];
      response.result = arguments[2] ? arguments[2] : {};
      args[0] = response;
      oldSend.apply(res, args);
  }
}


    /*req.json = function(){

    } */

    next();


}


module.exports = resHandler;
