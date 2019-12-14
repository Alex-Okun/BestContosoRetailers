'use strict';
const inquirer = require('inquirer');


function nextCommand() {
    var questions = [{
        type: 'input',
        name: 'command',
        message: "What would you like to do? (For options -help)",
    }]

    inquirer.prompt(questions).then(answers => {
        if (answers && answers.command) {
            translateAnswer(answers.command.trim());
        }
        //  console.log(`${answers['command']}!`)
    })
}

function translateAnswer(command) {
    if (command == "-help") {
        printHelpOptions();
    }
    if (command.startsWith("-list")){
        getList(command);
    }
    if (command.startsWith("-view")) {
        getBookInfo(command);
    }
    if (command.startsWith("-order")) {
        orderBook(command);
    }
    if (command.startsWith("-return")) {
        returnBookToStock(command);
    }
}

function getList(command) {
    if (command.search("inStock") > -1) {
        console.log("inStock");
    } else if (command.search("toBeShipped") > -1) {
        console.log("toBeShipped");
    } else {
        console.log("You forgot what you want to list: inStock or toBeShipped try again");
    }
    nextCommand();
}

function getBookInfo(id) {

}

function orderBook(id) {

}

function returnBookToStock(id) {

}

function printHelpOptions() {
    console.log('-help                         shows a list of the options available to use on the command line');
    console.log('-list [inStock | toBeShipped] lists all the books in the current stock, or the list of books to be shipped');
    console.log('-view [bookId]                given a bookId, shows the info for that book');
    console.log('-order [bookId]               “orders” a book by moving it from the “in stock” list to the “to be shipped” list');
    console.log('-return [bookId]              returns a book (moves it from the “to be shipped” list back to the “in stock” list)');
    nextCommand();
}

nextCommand();