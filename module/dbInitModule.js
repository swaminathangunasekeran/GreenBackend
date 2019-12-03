const PubSchema = require('../schema/publications');
const UserSchema = require('../schema/user');
const Topics = require('../schema/topics');
const constants = require('./const');
const AppVariable =  require("../util/appVariables");

class Dbinit{

  constructor(){

    this.pubName;
    this.pubId;
  }
  async initDb(){
    ////console.log(constants.appTopics);
    this.pubTopic = constants.pubTopics;
    this.pubName = constants.pubName;
    // await this.createSiteAdmin()
    this.configPublication();

  }

  createSiteAdmin(){
      const createAdmin = UserSchema.findOneAndUpdate({email:"admin@thudup.com"},
      {role : 23 }, {upsert:false});
      return createAdmin.exec((admin)=>{
        return admin;
      })
   }

    configPublication(){
      try{
        let pubName = this.pubName;
        let pubTopic = this.pubTopic;
         this.getPublicatons().then((publications) => {
           if(publications.topics){
             AppVariable.appInfo = publications;
             AppVariable.appId = publications._id;
             return true;
           }else{
             return false

           }
         }).catch((err) => {
          // //console.log("configPublication error ",error);
           return false;
         })
      }catch(error){
        ////console.log("configPublication error ",error);
      }

    }


  getPublicatons(){
    return new Promise((resolve,reject) => {
      try{
      let pubName =  this.pubName;
      PubSchema.findOne({"name":pubName}).exec().then((pub, err) => {
          if(err){
            reject(error);
          }else if(!pub){
            this.createPublications(pubName).then((publications) => {
              resolve(publications);
            }).catch((error) => {
              reject(error);
            });
          }else{
            resolve(pub)

          }
        });
      }catch(error){
      //  //console.log("getPublicatons error ",error);
        reject(error);
      }
    });

  }

   createTopics () {
    return new Promise(async (resolve,reject) => {
      let pubTopics = this.pubTopic;
      let menuList = []
      let menuTopics = pubTopics.map(async topic => {
        const topics = new Topics({
          title:topic
        })
          return await this.saveTopics(topics);
      });
      const menus = await Promise.all(menuTopics);
      resolve(menus);
    })

  }


  saveTopics (topics){
    return new Promise(async (resolve,reject) => {
      const menuList = await topics.save((err,topics)=>{
        if(err){
          return null;
        }else{
          resolve(topics) ;
        }
      })
      // return menuList;
    })
  }

    createPublications(pubName)  {

      return new Promise(async (resolve, reject) =>{
            try{
      //  //console.log("Create publications",pubName)
      let pubTopics = this.pubTopic;
      let menuTopics = await this.createTopics();
        let pubSchema = new PubSchema({
          name: pubName,
          createdDate : Date.now(),
          topics : menuTopics
        });
        pubSchema.save((err,pub)=> {
            if(err){
                reject(err);
            } else{
                resolve(pub);
            }
        });
      }catch(error){
        ////console.log("createPublications"+error);

      }
      });

  }




}


module.exports = Dbinit;
