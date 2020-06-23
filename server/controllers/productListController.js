var mongoose = require('mongoose');
const Product = require('../model/Product');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID

exports.list_all_products = function (req, res) {

    Product.find({}, function(err, product){
        if(err) {
            res.send(err);
        }

        res.json(product);
    });
};

exports.list_cpu = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "cpu"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
} 

exports.list_vga = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "vga"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
} 

exports.list_motherboard = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "motherboard"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
} 

exports.list_ram = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "ram"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
}

exports.list_storage = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "storage"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
}

exports.list_psu = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "psu"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
}

exports.list_case = function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("easypcassemble");
        var mysort = { product_price: 1 };

        dbo.collection("products").find({product_type: "case"}).sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            res.json(result)
            db.close();
         });
    }); 
}

exports.read_products = function (req, res) {
    Product.findById(req.params.productId, function(err, product){
        if(err) {
            res.send(err);
        }

        res.json(product);
    });
};


exports.edit_product = function (req, res){
    Product.findByIdAndUpdate(req.body._id, {
        "$set": {
            "product_name": req.body.product_name,
            "product_price": req.body.product_price,
            "product_type": req.body.product_type,
            "url_product": req.body.url_product,
            "path_image": req.body.path_image
        }
    }).then(doc => {
        if(!doc) {
            return res.status(404).end();
        }

        return res.status(200).json(doc);
    });
    console.log(req.body)
}

exports.delete_product = function (req, res) {
    Product.findByIdAndRemove(req.params.productId, function(err, product){
        if(err) {
            res.json(err);
            return;
        } else {
            res.json(product);
            return;
        };
    });

}

exports.add_product = function (req, res) {
    console.log(req.body)
    var new_product = new Product(req.body);
    new_product.save(function(err, product) {
        if(err) {
            res.send(err)
            return;
        }

        res.json(product);
        return;
    })
}
