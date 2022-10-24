var db = require('../connectionFolder/connection')
var collection=require('../connectionFolder/collections')
const { Db } = require('mongodb')
const { ADMIN_COLLECTION } = require('../connectionFolder/collections')

module.exports={

    doAdminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let adminLoginStatus=false
            let response={}
            
            let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:adminData.username})
            
            if(admin.password==adminData.password){
                console.log("login success");
                        response.admin=admin
                        response.status=true
                        resolve(response)
            }
            else{
                console.log('login failed');
                resolve({status:false})

            }
        })
    }

}