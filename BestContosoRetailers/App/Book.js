module.exports = Book;

function Book() {
    this.data = {};
}

Book.prototype.printBookInformation = function (id) {
    if (!id) {
        console.error(' ISBN wasn\'t provided');
        return;
    }

    this.getBookDetails(id);
    console.log('\nISBN  : ' + this.data.id);
    console.log('Name  : ' + this.data.name);
    console.log('Author: ' + this.data.author);
    console.log('Width : ' + this.data.width);
    console.log('Hight : ' + this.data.hight);
}

Book.prototype.getBookDetails = function (id) {
    var aBooks = getAllBooks();
    var oBooks = id ? getBookInfo(aBooks, id) : '';
    this.data = oBooks;
    return oBooks;
}

function getAllBooks() {
    const fs = require('fs');
    var data = fs.readFileSync('books.json');
    var inventoryJSON = JSON.parse(data);
    return inventoryJSON.books;
}

function getBookInfo(aBooks, sid) {
    function findTheBook(book) {
        return book.id === sid;
    }
    let obj;
    if (aBooks && aBooks.length > 0) {
        obj = aBooks.find(findTheBook);
    }
    
    if (obj) {
        this.data = obj
        return obj;
    } else {
        return;
    }
}

function addNewBook() {


}
///========================================================


function getShoppingDB() {
    const db = new Datastore('shoppingCarts.db');
    db.loadDatabase();
    return db;
}
