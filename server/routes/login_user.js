const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema
const jwt = require('jsonwebtoken');
const config = require('./../common/config');
var bcrypt = require('bcrypt');
let salt= bcrypt.genSaltSync(8);

exports.login = function(req,res){
     let name = req.body.name,
         email  = req.body.email;
    //  let names=Object.keys(req.body);
    //  let field = names[0]+"";
    //  console.log('chkinhg',field);
    //   let dats ={ 
    //       "name":req.body.name,
    //       "email":req.body.email
    //   }

    let conditions = !!name ? {name: name} : {email: email};

    if(!req.body){
        res.json(
            {
                success: false,
                message: 'User data empty'
            }
        )
    }
   
    else {
        
        users.findOne(conditions, function(err, data){
              console.log("hi",conditions);
             
            if (err) { 
                res.json(
                    {
                        success: false,
                        message: err
                    }
                )
            }
            else if(!data){
                res.json(
                    {
                        success: false,
                        message: 'user not found!'
                    }
                )
            }
            else {
                bcrypt.compare(req.body.password, data.password, function (err, result) {
                    if(result == true){
                    //   console.log(result);
                    var token = jwt.sign({name:req.body.name}, config.secret, {
                        expiresIn: 60*60*24 // expires in 24 hours
                    });
                    
                    res.json(
                        {
                            success: true,
                            token: token,
                            message: 'Successfully Signed In',
                            email: data.email,
                            name: data.name,
                            id: data._id,
                            profilepic: data.profilepic
                          

                        })
                    }else{
                       
                        res.json(
                            {
                                success: false,
                                message: 'user password wrong'
                            }
                        )
                    }
                })
             
             
            }
        });
    }
}
