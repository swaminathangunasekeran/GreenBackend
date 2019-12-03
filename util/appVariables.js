let AppVariable = {};
AppVariable =  {
  appInfo : "",
  appId : "",
  insight:{
    sampleLength:350
  },
  insightStatus : {
    pending:0,
    published : 1,
    requestedPublication:2,
    deleted:3
  },
  PublicationRole: {
    norole:0,
    admin:1,
    editor:2,
    member:3,
    follower:4,
    pending:5
  }
}

module.exports = AppVariable;
