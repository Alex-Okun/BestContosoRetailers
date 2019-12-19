module.exports = User;

function User(name) {
    this.user = name;
    var Cart = require('./Cart.js');
    this.cart = new Cart(name);
    this.loadCartData();
}

User.prototype.getReady = function () {
    return this.cart.ready;
};

User.prototype.loadCartData = function () {
    this.cart.loadCartData(this.user);
};

User.prototype.addBookToMyCart = function (bookId) {
    this.cart.addBook(this.user, bookId);
}
User.prototype.substractBook = function (bookID) {
    this.cart.substractBook(this.user, bookID);
}

updateShoppingList = function () {
    var db = getShoppingDB();
    db.update({ user: this.user }, { ship: this.data.ship }, { upsert: true }, function (err, numReplaced) {
        if (numReplaced === 1) {
            consule.log("Your shipping list is updated, thank you for shopping");
        }
    });
};