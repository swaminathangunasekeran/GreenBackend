/**
 * Created by Swami on 13/06/17.
 */
const app = require("../app");
const UserSchema = require('../schema/user');
const AnonymousUser =  require('../schema/anonymousUser');
const AppVariable =  require('../util/appVariables');
const mongoose = require('mongoose');
const  regex = require('regex-email');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const password = require('pwd');
const superSecret = app.get("superSecret");
const verifySecret = app.get("verifySecret");
/*password.configure({

    pepper: app.get("pepperSecret")
    });*/


class User {

    constructor(){

    }

    updateUser(req){
      return new Promise((resolve,reject) => {
        try{
          let request,id,email,profilePic,coverPic,description;
          request = req.body;
          email = request.email;
          id = request.userid
          profilePic  =request.profilePic;
          coverPic = request.coverPic;
          description = request.description;
          let findUserQuery = UserSchema.findByIdAndUpdate({'_id' :id},
          {$set:{
            email:email,
            profilePic:profilePic,
            coverPic:coverPic,
            description,
          }},
           {new:true});
          findUserQuery.exec((error,user) => {
            if(error){
              reject(error);
            }else{
               resolve(user);
            }

          });
        }catch(error){
          console.log("ERROR",error)
        }
      })
    }

   updatePassword(req){
     return new Promise((resolve,reject) => {
       try{
         let request,pswd,id;
         request = req.body;
         id = request.userid
         pswd = request.password;
         let findUserQuery
         this._encodePassword(pswd).then((encoded) => {
           console.log(encoded.mango);
           findUserQuery = UserSchema.findByIdAndUpdate({'_id' :id},
           {$set:{mango:encoded.mango,knife:encoded.knife}},

           {new:true});

           findUserQuery.exec((error,user) => {
             if(error){
               reject(error);
             }else{
                resolve(user);
             }

           });
         })


       }catch(error){
         console.error(error);
         reject(error);
       }
     })
   }


    createUser(req){
        return new Promise((resolve,reject) => {
        try{

            let firstName,middleName,lastName,email,password,location,request,language,role;
            request = req.body;
            firstName = (request.firstName).toString();
            lastName = request.lastName;
            email = request.email;
            location = request.location;
            password = request.password;
            language = request.language;
            role = 0;
            if(request.email === "admin@thudup.com") {
              role = 23 ;
            }
            let errorArray = new Array();
            let vaildemail  = regex.test(email);
            //console.log("AppVariable.AppVariable",AppVariable.appId)
                if(!firstName){
                    errorArray.push("firstname is required");
                }if(!email){
                    errorArray.push("email is required");
                }
                if(!vaildemail){
                 errorArray.push("vaild email is required");
                }
                if(!password){
                    errorArray.push("password is required");
                }
                if(errorArray.length > 0 ){
                    reject(errorArray);

                }
/*            this._validateSignupRequest(request).then((valid)=>{*/
                else{
                   this._encodePassword(password).then((encoded) => {
                        //password encryption need to be done here
                        let _newUser = new UserSchema ({
                            firstName : firstName,
                            middleName : middleName,
                            lastName : lastName,
                            email : email,
                            location : location,
                            mango : encoded.mango,
                            knife : encoded.knife,
                            role,
                            isUserVerified:false,
                            createdDate :new Date(Date.now()).toISOString(),
                            userName: email.split("@")[0]+new Date(Date.now()).getMilliseconds(),
                            description:"",
                            language,
                            publications:[{pubDetails:AppVariable.appId, pubId:AppVariable.appId,role:AppVariable.PublicationRole.member }]
                         });
                        _newUser.save((err,user)=> {
                            if(err){
                                reject(err);
                            } else{
                                resolve(user);
                            }
                        });

                   }).catch((err) => {
                      reject(err)
                   })

                }
/*            }).catch((error) => {
                reject(errorArray);
            });*/
        }catch(error){
             reject(error.toString());
        }
        });
    }

    authenticate(req){
     return new Promise((resolve,reject)=> {
         try{
            let request,email,pswd,vaildemail;
            request =  req.body;
            email = request.email;
            pswd= request.password;
            vaildemail  = regex.test(email);
            let errorArray = new Array();
            if(!email || !vaildemail){
                errorArray.push("email is required")
            }if(!pswd){
                errorArray.push("password is required")
            }if(errorArray.length <= 0){
                let findUserQuery = UserSchema.findOne({'email' :email}).select('_id email + knife + siteAdmin + mango');
                findUserQuery.exec(function(err, user){
                    if (!user) {
                        reject('Authentication failed. User not found.');
                    } else {
                        const payload = {
                          //  admin: user.siteAdmin,
                            userid : user._id
                        };
                        password.hash(pswd, user.knife,function(err,hash) {
                          if (user.mango && hash && user.mango == hash) {
                            var token = jwt.sign(payload, superSecret, {
                            expiresIn : 60*60*24
                            });
                            resolve({"token":token})
                          }else{
                             reject("authentication failed")
                          }
                        });

                    }
                });
            }else{
                reject(errorArray)  ;
            }

          }catch(err){
                reject(err);
         }
     })

    }

    generateVerificationCode(mail){
      return new Promise((resolve,reject) => {
        try{
          let vaildemail,findUserQuery;
          let email = mail;
          vaildemail  = regex.test(email);
          console.log("EMAIL IS +==",email)
          if(vaildemail){
            findUserQuery = UserSchema.findOne({'email' :email}).select('_id email + knife + siteAdmin + mango');
            findUserQuery.exec(function(err, user){
                if (!user) {
                    reject('Authentication failed. User not found.');
                } else {
                    const payload = {
                      //  admin: user.siteAdmin,
                        userid : user._id
                    };
                    var token = jwt.sign(payload, verifySecret, {
                    expiresIn : 60*60*24
                    });
                    //console.log("token in ",token)
                    resolve(token)

                }
            });
          }else{
            reject('not an valid user');
          }

        }catch(error){
            reject(error);
        }
      })
    }

    _validateSignupRequest(request){
        return new Promise((resolve,reject) => {
            try{
                let firstName,middleName,lastName,email,password,location;
                firstName = request.firstName;
                lastName = request.lastName;
                email = request.email;
                location = request.location;
                password = request.password;
                let errorArray = new Array();
                let vaildemail  = regex.test(email);
                if(!vaildemail){
                 errorArray.push("vaild email is required");
                }
                if(!firstName){
                    errorArray.push("firstname is required");
                }if(!email){
                    errorArray.push("email is required");
                }
                if(!password){
                    errorArray.push("password is required");
                }
                if(errorArray.length > 0 ){
                    reject(errorArray)
                }else{
                    resolve(true);
                }
            }catch(error){
                reject(error)
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
    getAlluser(){
        return new Promise((resolve,reject) => {

            UserSchema.find(function(err,users){
                if(err){

                    reject(err);
                }else{
                    resolve(users);
                    //res.json(users);
                }
            });
        });
    }

    getuserByUserName(userName){
      return new Promise((resolve,reject) => {

        let findUserQuery = UserSchema.findOne({'userName' :userName.toString()}).
          populate({
            path:"publishedInsight.insightDetail" ,
            model:"publishedinsight",
            select: 'updatedDate sample url sample title titleImage'
          }).
          select("publishedInsight").
          select("firstName").
          select("profilePic").
          select("coverPic").
          select("email").
          select("description").
          select("skills");
        try{
          findUserQuery.exec(function(err, user){
              if (user == null || err) {
                  console.log(err);
                  reject("not an valid user");
              } else {

                resolve(user);
              }
        });
      }catch(error){
        reject(error);
        }

      });
    }


    getuser(id){
        return new Promise((resolve,reject) => {
          let findUserQuery = UserSchema.findOne({'_id' :id});
          try{
            findUserQuery.exec(function(err, user){
                if (user == null || err) {
                    reject(null);
                } else {
                  resolve(user);
                }
          });
        }catch(error){
          reject(error);
          }

    });
  }




  verifyUser(id){
    return new Promise((resolve,reject) => {
      try{
        let findUserQuery = UserSchema.findByIdAndUpdate({'_id' :id},{
            isUserVerified: true
          },{new:true});
        findUserQuery.exec((err, user) => {
            if (user == null || err) {
              console.log("err",err);
              console.log(user);
                reject("not valid user");
            } else {
              resolve(user);
            }
      });
    }catch(error){
      reject(error);
      }

    });
  }




  getUserInsight(id){
    return new Promise((resolve,reject) => {
        try{

      UserSchema.findOne({'_id' :id}).
        populate({path:"insights.insightDetail" , model:"insights" }).
        //populate({path:"publishedInsight.insightDetail" , model:"publishedinsight" }).
        select("insights").
        //select("publishedInsight").
        exec((err,user) =>{
          if(err){
            reject(err);
          }else if(!user){
            resolve("");
          }else{
            //console.log("user is ",user);
            resolve(user);
          }
        });
      }catch(error){
        reject(error);
      }
  })
    /*   /*    UserSchema.aggregate([
            {
              "match":{
             "_id":id
            }

        }, {

          "$project":{"insights.insightDetail":{
              "$filter" :{
                as : "data",
                cond : { "$eq": ["$$data.status", 0] }
              }
          }
        }
      }],function(err,user){
        if(err){
          reject(err);
        }else if(!user){
          resolve("");
        }else{
          //console.log("user is ",user);
          resolve(user);
        }
      }); */
  }
  getUserPublications(id){
    return new Promise((resolve,reject) => {
        try{
          UserSchema.findOne({'_id' :id}).
          populate({path:"publications.pubDetails" , model:"publications" }).
          select("publications").
          exec((err,user) =>{
            if(err){
              reject(err);
            }else{
              //console.log("user is ",user);
              resolve(user);
            }
          });
        }catch(error){
          reject(error);
        }
    });
  }


  createAnonymousUser(){
       return new Promise((resolve,reject) => {
         let _anonymousUser = new AnonymousUser({});
         _anonymousUser.save((err,user) => {
           if(err){
               reject(err);
           } else{
               resolve(user);
           }
         });
       });
  }

  getAnonymousUser(id){
    return new Promise((resolve,reject) => {
      let findAnonymousUser = AnonymousUser.findOne({'_id' :id})
      try{
        findAnonymousUser.exec(function(err, user){
          if (user == null || err) {
              reject(null);
          } else {
            resolve(user);
          }
        })
      }catch(error){
        reject(error);
      }

    })

  }

  async searchuser(userText){
    return new Promise((resolve,reject) => {
      let users = UserSchema.find({ userName:  { "$regex": userText, "$options": "i" }  }).limit(10).select({ userName: 1, _id: 1 });
      return users.exec((err,userinfo) => {
        if(err){
          reject(err);
        }else{
          console.log("USER INFO",userinfo)
          resolve(userinfo);
        }
      })
    })
  
    
   
  }

  isFollowing(userid,userName){
    return new Promise((resolve,reject) => {
      try{
        let findUserQuery = UserSchema.findOne({'userName' :userName.toString()})
        findUserQuery.exec((err,userinfo)=>{
          if(err){
            reject(error);
          }else if(userinfo){
            let followid = userinfo._id
            let isFollowing =  UserSchema.find({_id:userid, "following.user":{$eq:followid}});
            isFollowing.exec((error,user) => {
              if(error){
                reject(error);
              }else if(user && user.length > 0){
                 resolve(true);
              }
              else{
                resolve("false")
              }
            })
          }else{
            reject("not valid user");
          }
        })
     
      }catch(error){
        reject(error);
      }
      
    })
  }

  followUser(userid,userName){
    return new Promise((resolve,reject) => {
      try{
        let findUserQuery = UserSchema.findOne({'userName' :userName.toString()})
        findUserQuery.exec((err,userinfo)=>{
          if(err){
            reject(error);
          }else if(userinfo){
            let followid = userinfo._id;
            let followUserQuery = UserSchema.findOneAndUpdate(
              {_id:userid,"following.user":{$ne:followid}}
            ,{
            $push: {
              "following":{
              "user" :followid,
            }
            }
          },{new:true});     
      
        followUserQuery.exec((error,user) => {
               if(error){
                 reject(error);
               }else if(user){
                  resolve(user.following);
               }else{
                 reject("user followed already")
               }
        });
          }
        });
      }catch(error){
        reject(error);
      }
    
    })
  }

  unfollowUser(userid,userName){
    return new Promise((resolve,reject) => {
      try{
        let findUserQuery = UserSchema.findOne({'userName' :userName.toString()})
        findUserQuery.exec((err,userinfo)=>{
          if(err){
            reject(error);
          }else if(userinfo){
            let unfollowid = userinfo._id;
            let unfollowUserQuery = UserSchema.findOneAndUpdate(
              {_id:userid,"following.user":{$eq:unfollowid}}
            ,{
              $pull: {
              "following":{
              "user" :unfollowid ,
            }
            }
          },{new:true});     
      
          unfollowUserQuery.exec((error,user) => {
               if(error){
                 reject(error);
               }else if(user){
                  resolve(user.following);
               }else{
                reject("user unfollowed already")
               }
        });
          }
        });
       
      }catch(error){
        reject(error);
      }
   
    })
  }



}

module.exports = User;
