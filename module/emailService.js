const AWS = require('aws-sdk');
const constants = require('./const');
const IAM_USER_KEY = constants.access_keyid;
const IAM_USER_SECRET = constants.secretAccessKey;

AWS.config.update({
  region: 'us-east-1',
  accessKeyId:IAM_USER_KEY,
  secretAccessKey:IAM_USER_SECRET
});
process.on('message', (info) => {

  var params = {
    Destination: { /* required */
      CcAddresses: [
        'admin@thudup.com',
        /* more items */
      ],
      ToAddresses: [
       /* user.email, */
          info[0],
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: info[1]
        },
        Text: {
         Charset: "UTF-8",
         Data: "TEXT_FORMAT_BODY"
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: info[2]
       }
      },
    Source: 'admin@thudup.com', /* required */
    ReplyToAddresses: [
        'admin@thudup.com',
      /* more items */
    ],
  };
  // Create the promise and SES service object
 var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      process.send(true);
    }).catch(
      function(err) {
        console.log(err)
      process.send(error);
    });


});
