'use strict';
'use global';

const cryptoJSON = require('crypto-json')
const Datastore = require('nedb');
const algorithm = 'camellia-128-cbc';
const encoding = 'hex';
const password = 'myPassword';
// Load DB to authenticate the user
const db = new Datastore('users.db');
db.loadDatabase();

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function init(){
    nextAction();
};

function nextAction() {
    rl.question('\nWhat would you like to do? (For options -help) ', function (action) {
        action = action.trim().toLocaleLowerCase();
        var oAction = _cleanTheInputString(action);
        switch (oAction.action) {
            case '-help':
                help();
                init();
                break;
            case '-create':
                createNewUser(oAction.userInfo);
                break;
            case '-signin':
                signIn(oAction.userInfo);
                break;
            case '-signout':
                signOut();
                break;
            default:
                console.log('This command doesn\'t exist');
                init();
        }
    });
}

function help() {
    console.log('\naccount create [userId] [password]   creates a new account for userId');
    console.log('account signIn [userId] [password]   sign in a user');
    console.log('signOut                              signs out current user');
}

function signOut() {
    rl.close;
    console.log("\nSorry to see you go \nBye Bye !!!");
    setTimeout(function () {
        rl.close();
        process.exit(0);
    }, 2000);
};

function signIn(oUser) {
    // Searching if the user already exist 
    var findUserData = new Promise(function (resolve, reject) {
        //add try and catch in case it's empty
        db.find({ user: oUser.user }, function (err, data) {
            let oDBuser = {};
            if (data && data[0]) {
                oDBuser = {
                    user: data[0].user,
                    pass: data[0].pass
                }
            }
            resolve(oDBuser);
        });
    });

    findUserData.then(function (oDBUser) {
        // The user was found in th db, next step will be to compare that passwords
        // In order to keep users password encipted all the time dusring this program 
        // instead of decripting the password in the db and compering with what the user just provided
        // the input will be decripted and compared against the information stored in the db
        if (oDBUser && oDBUser.user && oDBUser.pass) {
            let keys = ['pass'];
            var sencripteddata = cryptoJSON.encrypt(oUser, password, { encoding, keys, algorithm });
            if (sencripteddata.pass === oDBUser.pass) {
                console.log("You authenticated :-) Welcome back");
                startShopping();
            } else {
                console.log("Your user or password is incorrect please try again");
                init();
            }
        } else {
            console.log("User you provided doesn't exist, the good news are you can create a new user.\nCheck - help");
            init();
        }
    })
    findUserData.catch(function () {
        //
    })
}

function createNewUser(oUser) {
    //TODO check for duplications
    if (!oUser.user || !oUser.pass) {
        console.log('You didn\'t specifid user and password, please start again');
    }

    var keys = ['pass'];
    var sEncripteddata = cryptoJSON.encrypt(oUser, password, { encoding, keys, algorithm });
    db.insert(sEncripteddata);
    console.log('You are all set with the new user, if you want to login please choose -signin and provide your new user and password');
    init();
};

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

function startShopping(user) {
    var User = require('./User.js');
    var cUser = new User('asif');
    var sm = cUser.something();
    cUser.updateShoppingList();
}

rl.on("close", function () {
    process.exit(0);
});

init();



//======================
function newUser() {
    rl.question('Can\'t find this user. would you like to register? [yes/no] :', function (bSetupNewUser) {
        if (bSetupNewUser === 'yes') {
            rl.question('Setup a new user: ', function (sNewUser) {
                rl.question('Setup a password: ', function (sNewPassword) {
                    createNewUser(sNewUser, sNewPassword);
                    console.log('You all set you can shop now :-)');
                    launchShoping(sNewUser);
                    //load the app.js and create json file for this user
                });
            });
        } else {
            console.log("\nSorry to see you go \nBye Bye !!!");
            setTimeout(function () {
                rl.close();
                process.exit(0);
            }, 500);
        }
    });
};


function signInOld() {
    console.log('Please provide user and password');
    rl.question('User : ', function (sUser) {
        rl.question("Password : ", function (sPass) {
            var oUser = {
                user: sUser,
                pass: sPass
            };
            // Searching if the user already exist 
            var findUserData = new Promise(function (resolve, reject) {
                //add try and catch in case it's empty
                db.find({ user: sUser }, function (err, data) {
                    let oDBuser = {};
                    if (data && data[0]) {
                        oDBuser = {
                            user: data[0].user,
                            pass: data[0].pass
                        }
                    }
                    resolve(oDBuser);
                });
            });
            findUserData.then(function (oDBUser) {
                console.log(oDBUser);
                // The user was found in th db, next step will be to compare that passwords
                // In order to keep users password encipted all the time dusring this program 
                // instead of decripting the password in the db and compering with what the user just provided
                // the input will be decripted and compared against the information stored in the db
                if (oDBUser && oDBUser.user && oDBUser.pass) {
                    let keys = ['pass'];
                    var sencripteddata = cryptoJSON.encrypt(oUser, password, { encoding, keys, algorithm });
                    if (sencripteddata.pass === oDBUser.pass) {
                        console.log("You authenticated :-) Welcome back");
                        launchShoping(oUser.user);
                    } else {
                        console.log("Your user or password is incorrect please try again");
                    }
                    //load the json file of shipping for that user
                } else {
                    newUser();
                }
            })
            findUserData.catch(function () {
                newUser();
            })
        });
    });
};