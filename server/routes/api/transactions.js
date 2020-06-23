module.exports = function(app) {
    var transactionsList = require("../../controllers/transactionListController");

    app.route('/api/transactions')
    .get(transactionsList.list_all_transactions);

    app.route('/api/transactions/by_user')
    .get(transactionsList.list_transactions_user);

    app.route('/api/transactions/add')
    .post(transactionsList.add_transactions);

};