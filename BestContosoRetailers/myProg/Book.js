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

    if (this.data.id || this.data.name) {
        console.log('\nISBN  : ' + this.data.id);
        console.log('Name  : ' + (this.data.name || 'wasn\'t specified'));
        console.log('Author: ' + (this.data.author || 'wasn\'t specified'));
        console.log('Width : ' + (this.data.width || 'wasn\'t specified'));
        console.log('Hight : ' + (this.data.hight || 'wasn\'t specified'));
    } else {
        console.log('Couldn\'t find the book, are you sure about the book id you provided');
    }
   
}

Book.prototype.getBookDetails = function (id) {
    var aBooks = _getAllBooks();
    var oBooks = id ? _getBookInfo(aBooks, id) : '';
    this.data = oBooks;
    return oBooks;
}

function _getAllBooks() {
    const fs = require('fs');
    var data = fs.readFileSync('books.json');
    var inventoryJSON = JSON.parse(data);
    return inventoryJSON.books;
}

function _getBookInfo(aBooks, sid) {
    function findTheBook(book) {
        return book.id === sid;
    }
    let obj;
    if (aBooks && aBooks.length > 0) {
        obj = aBooks.find(findTheBook);
    }
    
    if (obj) {
        return obj;
    } else {
        return;
    }
}
