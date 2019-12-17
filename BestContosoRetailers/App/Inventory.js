module.exports = Inventory;

function Inventory() {}

Inventory.prototype.printInventory = function () {
    this.inventory = getInventory();
    var Book = require('./Book.js');
    var oBook = new Book();

    for (var i = 0; i < this.inventory.length; i++) {
        oBook.printBookInformation(this.inventory[i].id);
        console.log('Amount available: ' + this.inventory[i].count);
    }
};

Inventory.prototype.getInventory = function () {
    this.inventory = getInventory();
    var aDetailedInventory = [];
    var Book = require('./Book.js');
    var oBook = new Book();
    for (var i = 0; i < this.inventory.length; i++) {
        // will be nice to clean the info if from inventory if the book doesn't exist anymore
        aDetailedInventory.push({
            bookInfo: oBook.getBookDetails(this.inventory[i].id),
            amount: this.inventory[i].count
        });
    }
    return aDetailedInventory;
};

function getInventory() {
    const fs = require('fs');
    var data = fs.readFileSync('inventory.json');
    var inventoryJSON = JSON.parse(data);
    return inventoryJSON.inventory;
}

Inventory.prototype.addBookToInventory = function (oBook) {
    // add amount
};

Inventory.prototype.removeBookToInventory = function (oBook) {
    //remove amount
};

Inventory.prototype.save = function () {
    var data = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(inventoryType + '.json', data, finished);
    function finished(info) {
        console.log('Seems like everything went smooth' + info);
    }
};