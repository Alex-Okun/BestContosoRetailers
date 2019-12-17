module.exports = User;
const Datastore = require('nedb');

var db = new Datastore('carts.db');
db.ensureIndex({ fieldName: 'user', unique: true }, function (err) { });
db.loadDatabase(function (err) {
    if (err) {
        throw ('Couldn\'t load the table');
    }
});

function User(name) {
    this.user = name;

    this.cart = new Cart(name);
    this.loadCartData();
}

User.prototype.getReady = function () {
    return this.cart.ready;
};

User.prototype.loadCartData = function () {
    this.cart.loadCartData(this.user);
};

function Cart() {
    this.list = [];
    this.ready = null;
}

Cart.prototype.loadCartData = function (user) {
    const that = this;

    this.ready = new Promise(function (resolve) {
        getUserCart(user).then(function (data) {
            that.list = data;
        }).finally(resolve);
    });
};

function getUserCart(user) {
    //var db = await _loadCartDB();
    return new Promise(function (resolve, reject) {
        //db = _loadCartDB();
        db.find({ user: user }, function (err, data) {

            if (data && data[0]) {
                resolve(data[0].cart);
            } else {
                reject();
            }
        });
    });
}

/*
User.prototype.addBookMyCart = function () {
    var oData = {
        user: '45',
        cart: [{
            book: '456',
            count: '2'
        }]
    }

    db.insert(oData, function (err) {
        console.log('book was saved' + err);
        setTimeout(function () {
        }, 5000);
    });
}

Cart.prototype.getShopingList = function () {
   // var userList = new Promise(function(resolve, reject))
    return getUserCart(this.user);
};

updateShoppingList = function () {
    var db = getShoppingDB();
    db.update({ user: this.user }, { ship: this.data.ship }, { upsert: true }, function (err, numReplaced) {
        if (numReplaced === 1) {
            consule.log("Your shipping list is updated, thank you for shopping");
        }
    });
};


 async function _loadCartDB() {
    // The structure of the data in carts as following
    // {_id:<id>, user: <user id>, cart:[{book: <book id>, count: <amount in cart>}]}

     var db = new Datastore('carts.db');
     if (!db) {
         reject;
     }
    db.ensureIndex({ fieldName: 'user', unique: true }, function (err) { });
    resolve(db.loadDatabase(function (err) {
        if (err) {
            throw ('Couldn\'t load the table');
        } else {
            return dbCart;
        }
    }));
    
}
*/