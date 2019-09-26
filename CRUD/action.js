const app = require('express')();
const {auth}=require('./auth.js')
const mdlmain = require('./module_main');

//Create
/**
@swagger
 * definitions:
 *   Student:
 *      properties:
 *        id:
 *         type:string
 *        name:
 *         type:string
 *        rollnumber:
 *         type:string
 *          
 */


 /**
 * @swagger
 * /api/getData/ModuleMainData:
 *   post:
 *     tags:
 *        - Student
 *     description: Create New Student
 *     produces:
 *        - application/json
 *     parameters:
 *        - name: body
 *          description: enter id,name,rollnumber as JSON Object
 *          in: body
 *          schema:
 *              $ref:'#/definitions/Student' 
 *     responses:
 *        200:
 *          description: Successfully created
 *         
 *        
 */ 
app.post('/ModuleMainData',
function (req,res){
        console.log(req.body)
        mdlmain.postModuleMainData(req.body.id,req.body.name,req.body.rollnumber)
        .then(function (data){
                console.log("Inserted")
                res.status(200).json(data)
            }
        )
        .catch(
        function(err){
                res.status(400).json(err)
        }
        )
})
//Read
/**
@swagger
 * definitions:
 *   Student:
 *      properties:
 *        id:
 *         type:string
 *        name:
 *         type:string
 *        rollnumber:
 *         type:string
 *          
 */
 /**
 * @swagger
 * definition:
 *   Students:
 *     properties:
 *       Students:
 *         type: array
 *         items:
 *              $ref: '#/definitions/Student'
 */
 /**
 * @swagger
 * /api/getData/ModuleMainData:
 *   get:
 *     tags:
 *        - Students
 *     description: Get Students List
 *     produces:
 *        - application/json
 *     responses:
 *        200:
 *           description: Successfully Displayed
 *           schema:
 *              $ref:'#/definitions/Students' 
 *         
 *        
 */ 

app.get('/ModuleMainData',
function(req, res) {
     mdlmain.getModuleMainData()
    .then(function(data){
       console.log("Displayed")
        res.status(200).json(data)
    })
    .catch(function(err) {
        console.log(err)
        res.status(400).json(err)
    })
   
})
//Update
/**
@swagger
 * definitions:
 *   Student:
 *      properties:
 *        id:
 *         type:string
 *        name:
 *         type:string
 *        rollnumber:
 *         type:string
 *          
 */
 
 /**
 * @swagger
 * /api/getData/ModuleMainData/{id}:
 *   put:
 *     tags:
 *        - Students
 *     description: Get Students List
 *     produces:
 *        - application/json
 *     parameters:
 *        - name: id
 *          description: enter id in path
 *          in: path
 *          schema:
 *              $ref:'#/definitions/Student'
 *        - name: body
 *          description: enter updated id name rollnumber for particular record
 *          in: body  
 *     responses:
 *        200:
 *          description: Successfully Displayed
 *           schema:
 *              $ref:'#/definitions/Student' 
 *         
 *        
 */ 


app.put('/ModuleMainData/:id',
function(req,res){
    mdlmain.putModuleMainData(req.params.id,req.body.id,req.body.name,req.body.rollnumber)
    .then(function (data){
        console.log("Updated")
        res.status(200).json(data)
    })
    .catch(function(err){
        res.status(400).json(err)
    })
})
//Delete
/**
@swagger
 * definitions:
 *   Student:
 *      properties:
 *        id:
 *         type:string
 *        name:
 *         type:string
 *        rollnumber:
 *         type:string
 *          
 */
 
 /**
 * @swagger
 * /api/getData/ModuleMainData/{id}:
 *   delete:
 *     tags:
 *        - Student
 *     description: Delete Student
 *     produces:
 *        - application/json
 *     parameters:
 *        - name: id
 *          description: enter id in path
 *          in: path
 *     responses:
 *         200:
 *           description: Successfully Deleted
 *           schema:
 *              $ref:'#/definitions/Student' 
 *         
 *        
 */ 

app.delete('/ModuleMainData/:id',
function (req,res)
{
    mdlmain.deleteModuleMainData(req.params.id)
    .then(function (data){
        console.log("Deleted")
        res.status(200).json(data)
    })
    .catch(function(err){
        res.status(400).json(err)
    })
}
)
module.exports = app