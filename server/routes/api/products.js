const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: '../client/src/assets/products',
    filename: (req, file, cb)=>{
        return cb(null, file.originalname);
    }
})

const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000000},
    fileFilter: function(req, file, cb){
        checkFileType(file,cb)
    }
})


function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    // const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
}

module.exports = function(app) {
    var productList = require("../../controllers/productListController");

    app.route('/api/products')
    .get(productList.list_all_products);

    app.route('products/:productId')
    .get(productList.read_products);

    app.route('/api/products/cpu')
    .get(productList.list_cpu);
    
    app.route('/api/products/motherboard')
    .get(productList.list_motherboard);

    app.route('/api/products/ram')
    .get(productList.list_ram);

    app.route('/api/products/storage')
    .get(productList.list_storage);

    app.route('/api/products/psu')
    .get(productList.list_psu);

    app.route('/api/products/case')
    .get(productList.list_case);

    app.route('/api/products/vga')
    .get(productList.list_vga);

    app.route('/api/products/delete/:productId')
    .delete(productList.delete_product);

    app.route('/api/products/edit/product_update')
    .post(productList.edit_product)

    app.route('/api/products/add/product_add')
    .post(productList.add_product)
    
    app.route('/api/products/insert')
    .post(upload.single('path_image'), (req, res)=>{
        let {
            product_name,
            product_price,
            product_type,
            chipset,
            url_product
        }= req.body;
    
        // check existing product
        Product.findOne({
            product_name: product_name
        }).then(product => {
            if (product){
                return res.status(400).json({
                    msg: "Product name is already taken."
                });
            }
        });
    
        //data is valid create new product
        let newProduct = new Product({
            product_name,
            product_price,
            product_type,
            chipset,
            url_product,
            path_image: req.file.filename
        });
    
        console.log(req.body);
        console.log(req.file);
        newProduct.save().then(product=>{
            return res.status(201).json({
                success: true,
                msg: "Product has been registered!",
                profile_url: `http://localhost:5000/products/insert/${req.file.filename}`
            });
        })
    });

    // app.route('products/update')
    // .put((req, res)=>{
    //     var item = {
    //         product_name: req.body.product_name,
    //         product_price: req.body.product_price,
    //         product_: req.body.product_name,
    //         product_name: req.body.product_name,
    //     }
    // });

    // app.route('products/delete')
    // .delete(
        
    // );
};