'use strict';
const inquirer = require('inquirer');

var inventory = [{
    id: '123',
    name: 'Radical Condor',
    author: 'Kim scott',
    witdth: 13,
    hight: 14
},
{
    id: '234',
    name: 'I am Malala',
    author: 'Malala Yousafzai',
    witdth: 10,
    hight: 12
}, {
    id: '345',
    name: 'Limitless',
    author: 'Laura Gassner Otting',
    witdth: 13,
    hight: 14
},
{
    id: '456',
    name: 'Calling the one',
    author: 'Katherine Woodward Thomas',
    witdth: 10,
    hight: 12
    }];

var shipingList = [{
    id: '345',
    name: 'Limitless',
    author: 'Laura Gassner Otting',
    witdth: 13,
    hight: 14
},
{
    id: '456',
    name: 'Calling the one',
    author: 'Katherine Woodward Thomas',
    witdth: 10,
    hight: 12
}];

function nextCommand() {
    var questions = [{
        type: 'input',
        name: 'command',
        message: 'What would you like to do? (For options -help)' 
    }]

    inquirer.prompt(questions).then(answers => {
        if (answers && answers.command) {
            translateAnswer(answers.command.trim().toLocaleLowerCase());
        } 
    })
}
/**
 * 
 * @param {string} command to execute 
 */
function translateAnswer(command) {
    if (command == '-help') {
        printHelpOptions();
    }
    else if (command.startsWith('-list')) {
        getList(command);
    }
    else if (command.startsWith('-view')) {
        var id = command.replace('-view', '');
        if (id) {
            displayBookInfo(id.trim());
        } else {
            console.log('You didn\'t specify what book, please try again');
            nextCommand();
        }
    }
    else if (command.startsWith('-order')) {
        var id = command.replace('-order', '');
        if (id) {
            orderBook(id.trim());
        }
    }
    else if (command.startsWith('-return')) {
        var id = command.replace('-return', '');
        if (id) {
            returnBookToStock(id.trim());
        }

    } else {
        nextCommand();
    }
}
/**
 * 
 * @param {array} SourceStock
 * @param {array} TargetStock
 * @param {object} oBook
 */
function moveFromOneListToAnother(aSourceStock, aTargetStock, oBook) {
   
        addBookToTheList(aTargetStock, oBook); //TODO add a recovery in case that failed
        let index = getBookPlaceInTheList(aSourceStock, oBook);
        removeBookFromTheList(aSourceStock, index);

        console.log('All done!');
        nextCommand();
    //TODO I need to make sure that the array will be returned always sorted by name 
}

function addBookToTheList(aTargetStock, oBook) {
    aTargetStock.push(oBook);
}

function removeBookFromTheList(aSourceStock, index) {
    aSourceStock = aSourceStock.splice(index, 1);
}
/**
 * 
 * @param {text} command 'inStock' or 'toBeShipped'
 */
function getList(command) {
    if (command.search('instock') > -1) {
        getStockList();      
    } else if (command.search('tobeshipped') > -1) {
        getShipmentList();  
    } else {
        console.log('You forgot what you want to list: inStock or toBeShipped try again');
        nextCommand();
    }
   
}

function getStockList() {
    console.log('Currently in Stock');
    for (let i = 0; i < inventory.length; i++) {
        printBookInformation(inventory, i);
    }
    nextCommand();
}

function getShipmentList() {
    console.log('To Be Shipped');
    for (let i = 0; i < shipingList.length; i++) {
        printBookInformation(shipingList, i);
    }
    nextCommand();
}

function getBookInfo(aInventory, sID) {
    function findTheBook(book) {
        return book.id === sID;
    }

    let obj = aInventory.find(findTheBook);
    if (obj) {
        return obj;
    } else {
        return;
    }
}

function getBookPlaceInTheList(aInventory, oBook) {
    function findTheBook(book) {
        return book.id === oBook.id;
    }
    return  aInventory.findIndex(findTheBook);

}


function displayBookInfo(sID) {
    let oBook = getBookInfo(inventory, sID);
    if (oBook) {
        console.log('Information about this book');
        printBookInformation([oBook],0);
    } else {
        console.log('I cannot find a book with this ID try again');
    }
    nextCommand();
}

function orderBook(sID) {
      //todo find the book
    let oBook = getBookInfo(inventory, sID)
    moveFromOneListToAnother(inventory, shipingList, oBook);
}

function returnBookToStock(sID) {
    //todo find the book 
    let oBook = getBookInfo(shipingList, sID)
    moveFromOneListToAnother(shipingList, inventory, oBook);
}

function printHelpOptions() {
    console.log('-help                         shows a list of the options available to use on the command line');
    console.log('-list [inStock | toBeShipped] lists all the books in the current stock, or the list of books to be shipped');
    console.log('-view [bookId]                given a bookId, shows the info for that book');
    console.log('-order [bookId]               order a book by moving it from the \'in stock\' list to the \'to be shipped\' list');
    console.log('-return [bookId]              returns a book (moves it from the \'to be shipped\' list back to the \'in stock\' list)');
    nextCommand();
}

function printBookInformation(aBookInfo, index) {
    if (aBookInfo && aBookInfo.length > 0 && index >= 0) {
        console.log('ISBN  : ' + aBookInfo[index].id);
        console.log('NAME  : ' + aBookInfo[index].name);
        console.log('AUTHOR: ' + aBookInfo[index].author);
        console.log('Width : ' + aBookInfo[index].witdth);
        console.log('Hight : ' + aBookInfo[index].hight);
        console.log('');
    }
}

nextCommand();