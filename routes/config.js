if(process.env.NODE_ENV == "production"){
  module.exports = {

    'secret': 'ThiruKuralIsulAgaPothumArai82!',
    //'ProdDatabase': 'mongodb://swaminathan8223:Swami%401988@cluster0-shard-00-00-hcmns.mongodb.net:27017,cluster0-shard-00-01-hcmns.mongodb.net:27017,cluster0-shard-00-02-hcmns.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
  // "ProdDatabase" : "mongodb://swaminathan:swami%234041%24@ec2-35-174-11-172.compute-1.amazonaws.com:27017/thudupDB",
    //"ProdDatabase" : "mongodb://swami:swami823@104.211.220.181:27017/thudupDB",
    "database" :'mongodb+srv://swami8223:swami1988@cluster0-jvvhv.mongodb.net/test?retryWrites=true',

    'pepper' : "YenPoNuPeRukayi!l1182@",

    'env' : "https://www.thudupapi.com/kadal/",
    'frontEnd' :  "https://thudup.com/",
    'verifySecret' : "SuyaMariyathaiIyakkam"


};
}else if(process.env.NODE_ENV == "development"){
  module.exports = {

    'secret': 'ThiruKuralIsulAgaPothumArai82!',
    //'ProdDatabase': 'mongodb://swaminathan8223:Swami%401988@cluster0-shard-00-00-hcmns.mongodb.net:27017,cluster0-shard-00-01-hcmns.mongodb.net:27017,cluster0-shard-00-02-hcmns.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
    'database' : 'mongodb://localhost:27017/thudup',
    // 'database':'mongodb+srv://swami8223:swami1988@cluster0-jvvhv.mongodb.net/test?retryWrites=true',
  // "ProdDatabase" : "mongodb://swaminathan:swami%234041%24@ec2-35-174-11-172.compute-1.amazonaws.com:27017/thudupDB",
    //"ProdDatabase" : "mongodb://swami:swami823@104.211.220.181:27017/thudupDB",
    'pepper' : "YenPoNuPeRukayi!l1182@",
    'env' : "http://localhost:3000/kadal/",
    'frontEnd' :  "http://localhost:4200/",
     'verifySecret' : "rGXHFv3WxcwMaGgQ"
};
}
