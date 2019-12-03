const app = require("../app");
const UserSchema = require('../schema/user');
const AppVariable =  require('../util/appVariables');
const mongoose = require('mongoose');
const  regex = require('regex-email');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const password = require('pwd');
const superSecret = app.get("superSecret");
const UserModule = require("../module/userModule");

class SocialWeb{

  constructor(){
    this.userModule =  new UserModule();
  }

  fbGetUser(req){
    return new Promise((resolve,reject) => {
      this.getFbUser(req.body.id).then(user => {
        console.log("user",user);
        if(!user){
          this.fbSignup(req).then(user => {
            resolve(user);
          }).catch(error => {
            console.log("ERROR IS ",error)
            reject(error);
          });
        }else{
          this.authUser(user._id).then(token => {
            resolve(token);
          }).catch( error => {
            reject(error);
          })
        }
      }).catch(error => {
        reject(error);
      })
    })

  }

  getFbUser(id){
    return new Promise((resolve,reject) => {
      console.log("FB ID IS ===",id.toString())
      let findUserQuery = UserSchema.findOne({'fbID' :id});
      try{
        findUserQuery.exec(function(err, user){
              if(err){
                reject(err)
              }if(user){
                resolve(user._id);
              }else {
                resolve(user);
              }
      });
    }catch(error){
      reject(error);
      }
    });
  }

  fbSignup(req){
    return new Promise((resolve,reject) => {
      try{
        let firstname,email,fbID,request,name,location,profilePic;
        request = req.body;
        name = request.name;
        fbID = request.id;
        email = request.email? request.email:name+"@fb.com";
        location = request.location ? request.email: "";
        profilePic = request.picture.data.url
        console.log("fbId",fbID);
        if(!fbID){
          reject("FBId is required");
        }else{
          this._encodePassword(fbID).then((encoded) => {
            let _newUser = new UserSchema ({
              email: email,
              firstName: name,
              email : email,
              location : location,
              mango : encoded.mango,
              knife : encoded.knife,
              createdDate :new Date(Date.now()).toISOString(),
              role : "user",
              fbID: fbID,
              profilePic:profilePic,
              publications:[{pubDetails:AppVariable.appId, pubId:AppVariable.appId,role:AppVariable.PublicationRole.member }]
            })
            _newUser.save((err,user) => {
                if(err){
                  console.log("ERROS is ",err);
                    reject(err);
                } else{
                    //resolve(user);
                    this.authUser(user._id).then(token => {
                      resolve(token);
                    }).catch( error => {
                      reject(error);
                    })
                }
            });
          }).catch( error => {
            reject(error);
          })
        }
      }catch(error){
         console.log("error",error);
        reject(err)
      }

    })
  }

  authUser(userId){
    return new Promise((resolve,reject) => {
      try{
        const payload = {
          //  admin: user.siteAdmin,
            userid : userId
        };

        var token = jwt.sign(payload, superSecret, {
        expiresIn : 60*60*24
        });

        console.log()
        resolve({"token":token})
      }catch(error){
        console.log("error is ",error);
        reject(error);
      }

    })

  }

  _encodePassword(pswd){
      return new Promise((resolve,reject) => {
          try{
          let user = {};
          password.hash(pswd, function(err, salt, hash) {
              if (err) {
                  reject("password is not valid")
              }else{

                  user.mango = hash;
                  user.knife = salt;
                  resolve(user)
              }
          });
          }catch(err){

              reject(err);
          }

      })
  }


}


module.exports = SocialWeb;
