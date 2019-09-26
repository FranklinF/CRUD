const mdleos = require('./module_eos');

function getModuleMainData(){
    return new Promise((resolve,reject)=>{
    mdleos.getEosData()
    .then(function(data){
         return resolve(data);})
    });
}

function postModuleMainData(id,name,rollnumber)
{
return new Promise((resolve,reject)=>{
     mdleos.postEosData(id,name,rollnumber)
    .then(function(data){
         return resolve(data)
    })
});
}

/**
 * Get Account Information
 * @param {*} id
 */
function putModuleMainData(_id,id,name,rollnumber)
{
    return new Promise((resolve,reject)=>
    {
        mdleos.putEosData(_id,id,name,rollnumber)
        .then(function (data){
        return resolve(data)
        }
        )
    })
}

/**
 * Get Account Information
 * @param {*} id
 */
function deleteModuleMainData(id)
{
    return new Promise((resolve,reject)=>
    {
        mdleos.deleteEosData(id)
        .then(function (data){
        return resolve(data)
        }
        )
    })
}

module.exports={getModuleMainData,postModuleMainData,putModuleMainData,deleteModuleMainData}
