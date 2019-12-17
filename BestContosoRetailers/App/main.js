

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const thisSession = new Session();
init();

function Session() {
    this.data = {};
}

function init() {
    loginAction();
};

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

function actionBrowse() {
    nextAction();
}

function nextAction() {
    rl.question('\nWhat would you like to do now? (For options -help) ', function (input) {
        var action = input.trim().toLocaleLowerCase();
        var oAction = _cleanTheInputString(action);
        switch (oAction.action) {
            case '-help':
                shoppingHelp();
                actionBrowse();
                break;
            case '-list':
                getInventoryList(oAction.data);
                actionBrowse();
                break;
            case '-view':
                getBookVew(oAction.data);
                actionBrowse();
                break;
            case '-order':
                placeOrder(oAction.data);
                actionBrowse();
                break; 
            case '-return':
            case '-signout':
                signOut();
                break;
            default:
                console.log('This command doesn\'t exist');
                init();
        }
    });
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

function placeOrder(id) {
    var User = require('./User.js');
    var oUser = new User;
    oUser.addBookMyCart(id);
}

function signIn(oUser) {
    var Register = require('./Register.js');
    var login = new Register(oUser.user, oUser.pass);

    var authenticate = new Promise(function (resolve, reject) {
        let auth = login.signIn();
        setTimeout(function () {
            resolve(auth);
        }, 300);
        
    });
    authenticate.then(function (auth) {
        var User = require('./User.js');
        Session.user = new User(oUser.user);
        var ready = Session.user.getReady();

        if (ready) {
            ready.then(function () {
                console.log('Got my cart');
            });
        }
        actionBrowse();
    });
    authenticate.catch(function (err) {
        console.log('Something went wrong, let\'s try again');
    });
}

function signOut() {
    rl.close;
    console.log("\nSorry to see you go \nBye Bye !!!");
    setTimeout(function () {
        rl.close();
        process.exit(0);
    }, 2000);
}

function createUser(oUser) {
    var Register = require('./Register.js');
    var login = new Register(oUser.user, oUser.pass);
    login.createNewUser();
}

function initialHelp() {
    console.log('\naccount create [userId] [password]   creates a new account for userId');
    console.log('account signIn [userId] [password]   sign in a user');
}

function shoppingHelp() {
    console.log('-help                         shows a list of the options available to use on the command line');
    console.log('-list [inStock | toBeShipped] lists all the books in the current stock, or the list of books to be shipped');
    console.log('-view [bookId]                given a bookId, shows the info for that book');
    console.log('-order [bookId]               order a book by moving it from the \'in stock\' list to the \'to be shipped\' list');
    console.log('-return [bookId]              returns a book (moves it from the \'to be shipped\' list back to the \'in stock\' list)');
    console.log('-signOut                      signs out current user');
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