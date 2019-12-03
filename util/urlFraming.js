class UrlFraming{

  constructor(){

  }
  getPublicationUrl(title){

  return  title.split(" ").reduce((prev,current) =>{
            return prev+'-'+current;
      })
  }
}

module.exports = UrlFraming;
