var mongoose = require('mongoose');
const Transaction = require('../model/Transaction');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID

exports.add_transactions = function (req, res) {
    var new_transaction = new Transaction(req.body);
    new_transaction.save(function(err, transaction) {
        if(err) {
            res.send(err)
            return;
        }

        res.json(transaction);
        transaction
    })
}

//list all transactions
exports.list_all_transactions = function (req, res) {
    Transaction.find({}, function(err, transaction) {
        if(err) {
            res.send(err);
            return;
        }

        res.json(transaction);
        return;
    });
};


//list all transactions by user
exports.list_transactions_user = function (req, res) {
    var id = req.query.user_id
    console.log(id)
    Transaction.find({customer_id: ObjectId(id)}, function(err, result) {
        if(err) {
            res.send(err);
            return;
        }

        res.json(result);
        return;
    })

    // MongoClient.connect(url, function(err, db) {
    //     if (err) throw err;
    //     var dbo = db.db("easypcassemble");


    //     dbo.collection("transactions").find(
    //         {customer_id: id}).toArray(function(err, result) {
    //             if (err) throw err;
    //             // console.log(result);
    //             res.json(result)
    //             db.close();
    //         });
    //      }); 
} 