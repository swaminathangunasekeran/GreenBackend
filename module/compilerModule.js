/* Created By Swami on 18 Nov 2017 , this is an compiler module where all code is copiled and ran
to compile we use couple of libraries they are ezcompilex and compile-run
*/

const compile_run = require('compile-run');

class compilerModule {

    constructor(){

        if(this.compile_run == null){
            this.compile_run = compile_run;
        }
    }

    compileCode(req){
        ////console.log("compile code")
        return new Promise((resolve,reject) => {
            try{
                let language = req.body.language;
                let code = this.code = req.body.code;
                let errorArray =  new Array();
                if(code == ""){
                errorArray.push("code cant be empty");
                reject(errorArray)
                }else{
                 switch(language){
                   case 101 :
                    this.javaCompiler(code).then((result)=>{
                      //  //console.log("Javacompiler");
                        resolve(result);
                    })
                   case 201 :
                   case 301 :
                   case 401 :
                   case 501 :
                 }
                }

            }catch(err){
                ////console.log("ERR ON main compile",err)
               reject(err);
            }
        });


    }

    javaCompiler(code){
        return new Promise((resolve,reject) => {
            try{
                let input = [3,2,2,2];
                ////console.log("CODE IS === "+code);
                let filename = "";
                let classkey = "class";
                filename = code.match(new RegExp(classkey + '\\s(\\w+)'))[1];
                this.compile_run.runJava(code,input,filename,(stdout, stderr, err)=>{
                    if(!err){
                          resolve(stdout);
                    }
                    else{
                      //  //console.log(err);
                    }
                });
            }catch(err){
              //  //console.log("ERROR on java compiler",err)
                reject(err);
            }
        });
    }


    }

module.exports = compilerModule;
