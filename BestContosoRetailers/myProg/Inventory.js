module.exports = Inventory;
// ACTION is a constant of options that correnty suppported for the inventory 
// adding 1 book or substracting 1 book
const ACTION = {
    ADD: 1,
    SUBTRACT: -1
};

// Status state of the updates for the inventory 
const STATUS = {
    SUCCUSS: 1,
    FAILURE: 0
};

/**
 * Constractur will only include options for the actions && status - 
 * (status is not a dynamic thing but can be used in other places to compare the update status */
function Inventory() {
    this.action = ACTION;
    this.status = STATUS;
}

Inventory.prototype.printInventory = function () {
    this.inventory = _getInventory();
    var Book = require('./Book.js');
    var oBook = new Book();

    for (var i = 0; i < this.inventory.length; i++) {
        oBook.printBookInformation(this.inventory[i].id);
        console.log('Amount available: ' + this.inventory[i].count);
    }
};

Inventory.prototype.getInventory = function () {
    this.inventory = _getInventory();
    var aDetailedInventory = [];
    var Book = require('./Book.js');
    var oBook = new Book();
    for (var i = 0; i < this.inventory.length; i++) {
        aDetailedInventory.push({
            bookInfo: oBook.getBookDetails(this.inventory[i].id),
            amount: this.inventory[i].count
        });
    }
    return aDetailedInventory;
};

/**
  * Function will add or remove book from the stock depends on the action that provided
  * @param {string} action Supporting ACTION options 
  * @param {string} bookId The book that being returned or purchased
  * @return {Object} success or failure (if failed message provided
*/
Inventory.prototype.update = function (action, bookId) {
    this.getInventory();
    var value = action === ACTION.ADD ? ACTION.ADD :
        action === ACTION.SUBTRACT ? ACTION.SUBTRACT :
            console.log('For now you are doing something that not supported');
    
    var index = _findBookIndexArray(this.inventory, bookId);
    if (index === -1) {
        console.log('Hmmm are you sure this book in stock? try again...');
    } else {
        if (value === ACTION.SUBTRACT && this.inventory[index].count <= 0) {
            return {
                status: STATUS.FAILURE,
                message: "This book is unavailable right now since there is 0 of them in stock :-( sorry about that. Try a different book."
            };
        }
        this.inventory[index].count = this.inventory[index].count + value;
        var success = _saveUpdatedInventory(this.inventory);
        var status = success ? { status: STATUS.SUCCUSS } : { status: STATUS.FAILURE, message: 'New inventory failed to be saved' };
        return status;
    }
}

function _getInventory() {
    const fs = require('fs');
    var data = fs.readFileSync('inventory.json');
    var inventoryJSON = JSON.parse(data);
    return inventoryJSON.inventory;
}

function _findBookIndexArray(aList, bookId) {
    function findTheBook(data) {
        return data.id === bookId;
    }
    var indexInList = aList.findIndex(findTheBook);
    return indexInList;
}
/**
 * Saving the new inventory to the inventory.json file 
 * @param {array} newInventory 
 * the file stractured like that 
 * {
 * "inventory": [
 *  {
 *    "id": "456", \ book id  
 *     "count": 10 \ some number
 *   }]
 *  }
 */
function _saveUpdatedInventory(newInventory) {
    const fs = require('fs');
    var oInventory = {
        inventory: newInventory
    }
    var data = JSON.stringify(oInventory, null, 2);
    fs.writeFileSync('inventory.json', data);
    return true;
}