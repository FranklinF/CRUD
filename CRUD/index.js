// Swagger Config Start

 
/*Swagger Config End*/
/*Swagger-Docs */
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
//const url = require('url');
const express =require('express');
const path = require('path');
const dbConfig = require('./database.config.js');
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const app=express();
/*MongoDB  */
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
/*MongoDB */

/*Express-Framework*/
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
//app.use(express.static(__dirname + '/views'));

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "CRUD",
      description: "API for CRUD",
      license: {
        name: "www.CRUD.com",
        url: "http://www.CRUD.com",
        host:"localhost:4005",
        basePath:'/api/getData'
      },
      securityDefinitions: {
        basicAuth: {
        type: 'basic'
         }
      },
      security: [
         { basicAuth: [] }
       ]      
    }
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./action.js'],
};

const swaggerDefinition=swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));
app.use(express.static(__dirname + '/webapps'));
app.get('/create',function(req,res){
  res.sendFile(path.join(__dirname+'/views/create.html'));
});
app.use('/api/getData', require('./action.js'));

// app.get('/login',function(req,res){
//   res.sendFile(path.join(__dirname+'/pages/user/login.html'));
// });

app.listen(4005,()=>
    console.log("Terminal started with port:",4005)
)
/*Express-Framework*/