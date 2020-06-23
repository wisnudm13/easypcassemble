const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    total_price : {
        type: Number
    },
    transaction_detail: [{
        product_image: String,
        product_name: String,
        product_price: Number,
        quantity: Number
    }]

});

module.exports = mongoose.model('Transaction', TransactionSchema);