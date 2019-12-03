var express = require('express');
var router = express.Router();
const compilerModule = require('../module/compilerModule');

compiler = (req,res,next) => {
    //res.json(1,"Success","users");

    let compileMod = new compilerModule();
    compileMod.compileCode(req).then((result)=>{

        res.json("1","Test input should be dynamic",result);

    }).catch((errArray) => {
        //console.log('ERROR ARRAY',JSON.stringify(errArray));
        res.json(-1,errArray[1],errArray[2])
    });

}

module.exports = compiler;
