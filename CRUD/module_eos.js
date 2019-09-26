const database=require('./database.js')
console.log('Database',database)

var result=
{"Students":
[{"id":"1","name":"Franklin","rollnumber":"1"},
{"id":"2","name":"gokul","rollnumber":"5"},
{"id":"3","name":"rahul","rollnumber":"10"}
]}

function getjsonobject()
{
return new Promise((resolve,reject)=>{
    for(var i=0;i<result.Students.length;i++)
    console.log('Id:'+result.Students[i].id+' '+'Name:'+result.Students[i].name+
    ' '+'RollNumber:'+result.Students[i].rollnumber)
    return resolve(result);
});
}

function postjsonobject(id,name,rollnumber)
{
    return new Promise((resolve,reject)=>{
        result.Students.push({id:id,rollnumber:rollnumber,name:name})
        return resolve(result);   
    })
}

function putjsonobject(id,name,rollnumber)
{
    return new Promise((resolve,reject)=>{
        var student={};
        for (var i=0;i<result.Students.length;i++)
        {
            if(result.Students[i].id==id)
            {
                result.Students[i].name=name;
                result.Students[i].rollnumber=rollnumber;
                student.name=name;
                student.id=result.Students[i].id;
                student.rollnumber=result.Students[i].rollnumber;
            }

        } 
        return resolve(result);
    })
}

function deletejsonobject(id)
{
    return new Promise((resolve,reject)=>{
        for (var i=0;i<result.Students.length;i++)
        {
            if(result.Students[i].id==id)
            {
                result.Students.splice(i,1)
            }

        } 
        return resolve(result);
    })
}

function getEosData() {
    return new Promise((resolve, reject) => {
       // getjsonobject()
       database.findAll()
               .then(function(data){
                   return resolve(data);
                         })
    });
}

function postEosData(id,name,rollnumber){
    return new Promise((resolve,reject)=>{
        //postjsonobject(id,name,rollnumber)
       database.create(id,name,rollnumber)
        .then(function (data){
            return resolve (data);
        })
    })
}

function putEosData(_id,id,name,rollnumber){
return new Promise((resolve,reject)=>{
    //putjsonobject(id,name,rollnumber)
    database.update(_id,id,name,rollnumber)
    .then(function (data){
        return resolve(data);
    })
})
}

function deleteEosData(id){
    return new Promise((resolve,reject)=>{
       // deletejsonobject(id)
       database.deletion(id)
        .then(function (data){
            return resolve(data);
        })
    })
}

module.exports={getEosData,postEosData,putEosData,deleteEosData}