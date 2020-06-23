const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true
    },
    chipset: {
        type: String,
    },
    url_product: {
        type: String,
        required: true
    },
    path_image: {
        type: String,
        default: "default.png"
    },
    memory: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);