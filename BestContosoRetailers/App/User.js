function User(name) {
    this.user = name;
    this.data = {};
    console.log("this is some user");
    setTimeout(function () { }, 3000);
    this.something = function () {
        return 'bla';
    }

}

module.exports = User;

User.prototype.getShopingList = function () {
    var db = getShoppingDB();
    var userShoppingList = new Promise(function (resolve, reject) {
        getShoppingDB
        db.find({ user: this.user }, function (err, data) {
            if (data && data[0]) {
                resolve(data);
            } else {
                reject();
            }
        });
    });

    userShoppingList.then(function (data) {
        this.data = data.ship;
    });

    userShoppingList.catch(function () {
        this.data = {};
    });
};

User.prototype.updateShoppingList = function () {
    var db = getShoppingDB();
    db.update({ user: this.user }, { ship: this.data.ship }, { upsert: true }, function (err, numReplaced) {
        // numReplaced = 1
        if (numReplaced === 1) {
            consule.log("Your shipping list is updated, thank you for shopping");
        }
    });
};

function getShoppingDB() {
    const db = new Datastore('shoppingCarts.db');
    db.loadDatabase();
    return db;
}
