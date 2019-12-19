/**
 * Main.js includes all the interaction with the user 
 * call init to start 
 * Sess
 **/
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Seesion for wach user that login with the relevent data
 function Session() {
    this.user = {};
}
var thisSession = new Session();

//============  Interaction with the user =====================
init();

function init() {
    loginAction();
};

/**
 *  Login action is the initial interaction with the user before he actuallyy logged in
 */
function loginAction() {
    rl.question('\nWhat would you like to do? (For options -help) ', function (input) {
        var action = input.trim().toLocaleLowerCase();
        var oAction = _cleanTheInputString(action);
        switch (oAction.action) {
            case '-help':
                initialHelp();
                init();
                break;
            case '-create':
                createUser(oAction.userInfo);
                init();
                break;
            case '-signin':
                signIn(oAction.userInfo);
                break;
            default:
                console.log('This command doesn\'t exist');
                init();
        }
    });
}

function resumeBrowsing() {
    actionsBrowse();
}
/**
 * Called for interaction with user once the user logged in*/
function actionsBrowse() {
    rl.question('\nWhat would you like to do now? (For options -help) ', function (input) {
        var action = input.trim().toLocaleLowerCase();
        var oAction = _cleanTheInputString(action);
        switch (oAction.action) {
            case '-help':
                shoppingHelp();
                resumeBrowsing();
                break;
            case '-list':
                getListOfBooks(oAction.data);
                resumeBrowsing();
                break;
            case '-view':
                getBookVew(oAction.data);
                resumeBrowsing();
                break;
            case '-order':
                placeOrder(oAction.data);
                resumeBrowsing();
                break;
            case '-return':
                returnBookToStock(oAction.data);
                resumeBrowsing();
                break;
            case '-signout':
                signOut();
                break;
            default:
                console.log('This command doesn\'t exist');
                resumeBrowsing();
        }
    });
}

//===== Main functionality based on the user choice ===========
function createUser(oUser) {
    var Register = require('./Register.js');
    var login = new Register(oUser.user, oUser.pass);
    login.createNewUser();
}

function signIn(oUser) {
    var Register = require('./Register.js');
    var login = new Register(oUser.user, oUser.pass);

    try {
        var auth = login.signIn();
        if (auth) {
            auth.then(function () {
                loadUserData(oUser); // Some sort of lazy mode 
                console.log('.. and now logged in');
                resumeBrowsing();
            }).catch(function (err) {
                console.log('Let\'s try again');
                loginAction();
            });
        }
    } catch (e) {
        error();
    }
}

function signOut() {
    console.log("\nSorry to see you go \nBye Bye !!!");
    init();
}


function initialHelp() {
    console.log('\n-create [userId] [password]  creates a new account for userId');
    console.log('-signIn [userId] [password]  sign in a user');
}

function shoppingHelp() {
    console.log('-help                         shows a list of the options available to use on the command line');
    console.log('-list [inStock | toBeShipped] lists all the books in the current stock, or the list of books to be shipped');
    console.log('-view [bookId]                given a bookId, shows the info for that book');
    console.log('-order [bookId]               order a book by moving it from the \'in stock\' list to the \'to be shipped\' list');
    console.log('-return [bookId]              returns a book (moves it from the \'to be shipped\' list back to the \'in stock\' list)');
    console.log('-signOut                      signs out current user');
}

function getInventoryList() {
    var Inventory = require('./Inventory.js');
    var storeInventory = new Inventory;
    Session.storeInventory = storeInventory.printInventory();
}

function getBookVew(id) {
    var Book = require('./Book.js');
    var oBook = new Book;
    oBook.printBookInformation(id);
}

function placeOrder(bookId) {
    var isValidBook = isBookValid(bookId);
    if (isValidBook) {
        var success = substraktFromInventory(bookId);
        if (success) {
            thisSession.user.addBookToMyCart(bookId);
        }
    } 
}
/**
 * Functions is determiing what list to pring the inventory or the shipping card of the user and will dispatch it accordengly 
 * @param {string} request 'instock'|'tobeshipped' 
 */
function getListOfBooks(request) {
    request === 'instock' ? getInventoryList() :
        request === 'tobeshipped' ? getShippingList() :
            console.log('Please choose what list you want to see. You can specify InStock or ToBeShipped');
}

function getShippingList() {
    thisSession.user.cart.print();
}

// =========== Helping function ===============================  
function returnBookToStock(bookId) {
    var isValidBook = isBookValid(bookId);
    if (isValidBook) {
        var success = thisSession.user.substractBook(bookId);
        if (success) {
            addtoInventory(bookId);
        }
    } else {
        console.log('This book is not a valid book - you probably don\'t reaaly have it in your cart. Check again.');
    }
}

function isBookValid(bookId) {
    if (!bookId) {
        console.log('Did you forget to specify the book?');
        return;
    }
    var Book = require('./Book.js');
    var oBook = new Book;
    return oBook.getBookDetails(bookId);
}

function substraktFromInventory(bookId) {
    var Inventory = require('./Inventory.js');
    var storeInventory = new Inventory;
    var update = storeInventory.update(storeInventory.action.SUBTRACT, bookId);
    if (storeInventory.status.SUCCUSS === update.status) {
        return true;
    } else if (update.message) {
        console.log(update.message);
    }
}

function addtoInventory(bookId) {
    var Inventory = require('./Inventory.js');
    var storeInventory = new Inventory;
    var succesfullyUpdated = storeInventory.update(storeInventory.action.ADD, bookId);
    if (storeInventory.STATUS.SUCCUSS === succesfullyUpdated) {
        return true;
    } else if (succesfullyUpdated.message) {
        console.log(succesfullyUpdated.message);
    }
}

function loadUserData(oUser) {
    var User = require('./User.js');
    try {
        thisSession.user = new User(oUser.user);
        var ready = thisSession.user.getReady();
        if (ready) {
            ready.then(function () {
                resumeBrowsing();
            });
        }
    } catch (e) {
        error();
    }
}

function error() {
    console.log('Some error accure, let\'s just resume browsing options');
    resumeBrowsing();
}

function _cleanTheInputString(action) {
    var oInfo = {};
    if (action.startsWith('-help')) {
        oInfo.action = '-help';
    } else if (action.startsWith('-signout')) {
        oInfo.action = '-signout';
    } else if (action.startsWith('-create') || action.startsWith('-signin')) {
        oInfo.action = action.startsWith('-create') ? '-create' : '-signin';
        oInfo.userInfo = _getUserAndPassword(action.replace(oInfo.action, '').trim());
        return oInfo;
    } else if (action.startsWith('-list')) {
        oInfo.action = '-list';
        oInfo.data = (action.replace(oInfo.action, '')).trim();
    } else if (action.startsWith('-view') || action.startsWith('-order') || action.startsWith('-return')) {
        oInfo.action = action.startsWith('-view') ? '-view' : action.startsWith('-order') ? '-order' : '-return';
        oInfo.data = (action.replace(oInfo.action, '')).trim();   
    } else {
        oInfo.action = undefined;
    }
    return oInfo;
}

function _getUserAndPassword(sString) {
    //TODO check input validation for wired characters etc.
    var oUser = {};
    var userAndPass = sString.split(' ');
    oUser.user = userAndPass[0];
    // In case there is multiple spaces after it
    var password = sString.replace(oUser.user, '').trim();
    oUser.pass = password;
    return oUser;
}