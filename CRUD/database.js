const Student = require('./database.model.js');

function create(id,name,rollnumber){
    console.log("Id:",id)
    console.log("Name:",name)
    console.log("Rolnumber:",rollnumber)
    
    var obj_student = new Student({
        id: id, 
        name: name,
        rollnumber:rollnumber
    });
    return new Promise((resolve,reject)=>{
    /*Inserting new record*/
    obj_student.save()
    .then(data => {
        return resolve(data);
    })
    });
}

function findAll() {
    return new Promise((resolve,reject)=>{
    /*Displaying All Record*/
    Student.find()
    .then(data => {
        return resolve(data);
    })
    });
}

function findOne(id) {
    return new Promise((resolve,reject)=>{
    /*Displaying individual record*/    
    Student.findById(id)
    .then(data => {
        return resolve(data);
    })
    });

}

function update(_id,id,name,rollnumber){
    return new Promise((resolve,reject)=>{
        /*Updating the Record*/
        Student.findByIdAndUpdate(_id, {
        $set: {
        id:id,
        name: name,
        rollnumber: rollnumber
        }
    },{new:true})
    .then(data => {
        return resolve(data);
        })
    });
}

function deletion(id) {
    return new Promise((resolve,reject)=>{
    /*Deleting the individual record*/
     Student.findByIdAndRemove(id)
    .then(data => {
       return resolve(data)
    })
    });
}

module.exports={create,findAll,findOne,update,deletion}