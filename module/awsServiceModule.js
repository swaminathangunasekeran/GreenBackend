const AWS = require('aws-sdk');
const Busboy = require('busboy');
const constants = require('./const');
const UserModule = require("./userModule");
const BUCKET_NAME = constants.bucket_name;
const IAM_USER_KEY = constants.access_keyid;
const IAM_USER_SECRET = constants.secretAccessKey;
const REGION = constants.region;
const config = require('../routes/config');
const { fork } = require('child_process');
let emailForked = fork('./module/emailService.js');


class AwsServiceModule{
  constructor(){

  }

    uploadFile(req){
        return new Promise((resolve,reject)=>{
          try{
             let busboy = new Busboy({ headers: req.headers });
             // The file upload has completed
               busboy.on('finish', () => {
                const files = req.files;
                console.log( files.file.size );
                if(files && files.file && files.file.size < 5000000){
                  this.uploadToS3(files.file).then(result => {
                    if(result.Location){
                      resolve(result)
                    }
                  }).catch(err => {
                    reject(err);
                  });
                }else{
                  reject("file size exceed");
                }

              });
              req.pipe(busboy);
          }catch(error){
            reject(error);
          }
        })
  }

  verifyEmailToUser(user){
    return new Promise((resolve,reject) => {
       try{
         let _userModule =  new UserModule();
         let data,subject;
         _userModule.generateVerificationCode(user.email).then((code) => {
           // Create sendEmail params
            data = `<p>வணக்கம் ${user.firstName} </p></br><p> தங்களது மின்னஞ்சலை உறுதி செய்ய இந்த
            <a href="${config.env}verifyUser?token=${code}">
            URL</a> ஐ இயக்கவும் , 24 மணி நேரத்திற்குள்  இதை பயன்படுத்தவும்</p>
            </br></br>இப்படிக்கு காதலுடன் </br></br>
            <a href="https://thudup.com">துடுப்பு(thudup.com)</a>`;
            subject = "துடுப்பு(thudup.com) உங்களை அன்புடன் வரவேற்கிறது "
            emailForked.send([user.email,data,subject]);
            emailForked.on('message', (msg) => {
              resolve(msg);
            });
         }).catch(error => {
           reject("mail not sent",error);
         });
       }catch(error){
         console.error(error);
         reject(error);
       }
     });
  }


sendUserPasswordLink(email){
  return new Promise((resolve,reject) => {
     try{
       let _userModule =  new UserModule();
       let data,subject;
        _userModule.generateVerificationCode(email).then((code) => {
          data = `<p>வணக்கம்,</p></br>
          <p>தங்கள் கடவுச்சொல்லை மாற்ற இந்த <a href="${config.frontEnd}passwordReset?token=${code}">
          URL</a> ஐ இயக்கவும் ,24 மணி நேரத்திற்குள் இதை பயன்படுத்தவும்</p>
          </br></br>இப்படிக்கு காதலுடன் </br></br>
          <a href="https://thudup.com">துடுப்பு(thudup.com)</a>`;
          subject = "கடவுச்சொல் மாற்றும் சேவை";
          emailForked.send([email,data,subject]);
          emailForked.on('message', (msg) => {
            resolve(msg);
          });
        }).catch(err => {
          reject(err);
        });
     }catch(err){
       reject(err);
     }
   });
}


  uploadToS3(file) {
    return new Promise((resolve,reject) => {
       try{
         console.log("FILE ====",file);
         let s3bucket = new AWS.S3({
           accessKeyId: IAM_USER_KEY,
           secretAccessKey: IAM_USER_SECRET,
           Bucket: BUCKET_NAME,
           region:REGION,
           tagging: "key1=value1&key2=value2",
         });
         s3bucket.createBucket(function () {
           var params = {
            Bucket: BUCKET_NAME,
            Key: file.name,
            Body: file.data,
           };
           s3bucket.upload(params, function (err, data) {
            if (err) {
             console.log('error in callback');
             console.log(err);
             reject(err)
            }
            console.log('success');
            resolve(data);
            console.log(data);
           });
         });
       }catch(error){
         reject(error);
       }
    });

}


}
module.exports = AwsServiceModule;
