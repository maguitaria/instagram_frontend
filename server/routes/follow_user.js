const router = require('express').Router();
// var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const users = require('../models/user'); //create new post schema

//checking...
function checklikeid(array, target) {
    // console.log(array, target);
    // console.log(target);
    for (var i = 0; i < array.length; i++) {
        if (array[i] == target) {
            // console.log(i, array[i], target);
            return true;
        }
    }
    return false;
}


exports.follow = function (req, res) {
    // console.log(req.body.user_id);
    // console.log(req.body.follower_id);
    if (req.body.user_id && req.body.follower_id) {



        var query = { "_id": req.body.user_id };
        var query1 = { "_id": req.body.follower_id };
        var options = { new: true };
        //ids = {type: String}

        users
            .distinct("_id")

            .exec(function (err, resu) {
                if (err) {
                    res.send(err)
                }
                else {
                    //   res.send(resu);
                    if (checklikeid(resu, req.body.user_id) && checklikeid(resu, req.body.follower_id)) {


                        users.find(query, function (err, post) {
                            if (err) {
                                res.send(err)
                            } else {
                                // res.send(post)
                                // console.log(checklikeid(post[0]['followers'], req.body.follower_id));

                                //   console.log(checklikeid(post[0]['following'], req.body.follower_id ));

                                users.find(query1, function (err1, post1) {
                                    if (err) {
                                        res.send(err)
                                    } else {
                                        //    res.send(post1);

                                        // console.log(checklikeid(post1[0]['following'], req.body.user_id));

                                        if (checklikeid(post[0]['followers'], req.body.follower_id) && checklikeid(post1[0]['following'], req.body.user_id)) {
                                            //res.send('pull')
                                            users.findOneAndUpdate(query, { $pull: { followers: req.body.follower_id } }, options, function (err, post) {

                                                if (err) {
                                                    res.send(err);
                                                }
                                                else {
                                                    users.findOneAndUpdate(query1, { $pull: { following: req.body.user_id } }, options, function (err2, post2) {

                                                        if (err2) {
                                                            res.send(err2);
                                                        }
                                                        else {
                                                            res.send({
                                                                userid: post,
                                                                followerid: post2
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }



                                        else {
                                            // res.send('push')
                                            users.findOneAndUpdate(query, { $push: { followers: req.body.follower_id } }, options, function (err, post) {

                                                if (err) {
                                                    res.send(err);
                                                }
                                                else {
                                                    users.findOneAndUpdate(query1, { $push: { following: req.body.user_id } }, options, function (err2, post2) {

                                                        if (err2) {
                                                            res.send(err2);
                                                        }
                                                        else {
                                                            res.send({
                                                                userid: post,
                                                                followerid: post2
                                                            });
                                                        }
                                                    })
                                                }
                                            })
                                        }


                                    }
                                })


                            }
                        })


                    } else {
                        res.send({


                            msg: 'data not found'

                        })
                    }
                    // console.log( checklikeid(resu, req.body.follower_id) );



                }
            })



    }




    else {
        res.send({


            msg: 'data not found'

        })
    }
};