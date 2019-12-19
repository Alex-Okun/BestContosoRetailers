module.exports = Cart;

// Using a nedbto create a persstancy for the shopping carts for each user 
// Need to load the data to the memmory in order to load the existing cart for the user
// The preformance of loading is not so great therefore desided to load earlier
// The structure of the data in carts as following
// {_id:<id>, user: <user id>, cart:[{book: <book id>, count: <amount in cart>}]}
const Datastore = require('nedb');
var dbCart = new Datastore('carts.db');
dbCart.loadDatabase(function (err) {
    if (err) {
        console.error('The cart table is actually didn\'t loaded');
    }
});

const ACTIONS = {
    ADD: 1,
    SUB: -1
}

function Cart() {
    this.list = [];
    this.ready = null;
}

Cart.prototype.loadCartData = function (user) {
    const that = this;
    this.ready = new Promise(function (resolve) {
        _getUserCart(user).then(function (data) {
            that.list = data || [];
        }).finally(resolve);
    });
};
/**
 *Printing the current books in users cart - in case it's empty will show a message to user
 **/
Cart.prototype.print = function () {
    var Book = require('./Book.js');
    var oBook = new Book();
    if (this.list.length === 0) {
        console.log('You have nothing yet in your shopping cart.... and it\'s almost Xmas you should hurry :-)');
    }
    for (var i = 0; i < this.list.length; i++) {
        oBook.printBookInformation(this.list[i].book);
        console.log('Amount in your cart: ' + this.list[i].count)
    }
};

Cart.prototype.getShopingList = function () {
    return _getUserCart(this.user);
};

Cart.prototype.addBook = function (user, bookId) {
    var list = this.list;
    function findTheBook(data) {
        return data.book === bookId;
    }
    var indexInList = list.findIndex(findTheBook);
    this.list = indexInList === -1 ? _addNewToCart(this.list, bookId) : _updateCartList(this.list, indexInList, ACTIONS.ADD);
    _updateDB(user, this.list, this.status);
}

Cart.prototype.substractBook = function (user, bookId) {
    var list = this.list;
    function findTheBook(data) {
        return data.book === bookId;
    }
    var indexInList = list.findIndex(findTheBook);
    if (indexInList === -1) {
        console.log('You don\'t have this book in your cart');
        return;
    }

    // bring the changes to the existing cart 
    _updateCartList(this.list, indexInList, ACTIONS.SUB);
    // Save to table 
    _updateDB(user, this.list);
    return true;
}

/**
 * The function will update the list and save it to the db
 * @param {int} indexInList 
 * @param {string} action subtract or add
 */
function _getUserCart(user) {
    return new Promise(function (resolve, reject) {
        dbCart.find({ user: user }, function (err, data) {
            if (data && data[0]) {
                resolve(data[0].cart);
            } else {
                reject();
            }
        });
    });
}

function _addNewToCart(list, bookId) {
    list.push({
        book: bookId,
        count: 1
    });

    return list;
}
/**
 * 
 * @param {array} list
 * @param {integer} indexInList
 * @param {string} action
 */
function _updateCartList(list, indexInList, action) {
    var updateValue = action === ACTIONS.ADD ? ACTIONS.ADD : action === ACTIONS.SUB ? ACTIONS.SUB : 0;
    var existingAmount = parseInt(list[indexInList].count);
    list[indexInList].count = String(existingAmount + updateValue);
    // if the amount for this sbook now is 0 remove it comlitely from the cart 
    if (list[indexInList].count === "0") {
        list.splice(indexInList, 1);
    }
    return list;
}
/**
 * 
 * @param {string} user user id 
 * @param {array} list  [{book: <book id>, count: <amount in cart>}]
 */
function _updateDB(user, list) {
    if (!list.length) {
        dbCart.remove({ user: user }, {});
    } else {
        var data = {
            user: user,
            cart: list
        }

        dbCart.update({ user: user }, data, { upsert: true });
    }
 }