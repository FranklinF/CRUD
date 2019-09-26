const basicAuth=require('basic-auth')

var  auth = function (req, res, next){
    console.log('Authentication validation enters...')

    var user = basicAuth(req);
    if(!('name' in user ) || !('pass' in user)){
        res.set('Authentication credentials not found');
        res.sendStatus(401);
    }
    console.info('Authentication :',user)
    if(user.name == 'user'){   //admin authentication validation.
      if(user.pass == 'password'){
        next();
      }
      else{
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
      }
    }
  }
 module.exports={auth}