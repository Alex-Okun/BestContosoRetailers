'use strict';
'use global';

module.exports = Register;

const Datastore = require('nedb');
const cryptoJSON = require('crypto-json');
const algorithm = 'camellia-128-cbc';
const encoding = 'hex';
const password = 'myPassword';

function Register(user, pass) {
    this.user = user;
    this.pass = pass;
}

Register.prototype.signIn = function () {
    const db = new Datastore('users.db');
    db.loadDatabase();
    var oUser = this;
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
                console.log("\nYou authenticated :-) Welcome back");
                return true;
            } else {
                console.log("\nYour user or password is incorrect please try again");
                return false;
            }
        } else {
            console.log("\nUser you provided doesn't exist, the good news are you can create a new user.\nCheck - help");
            return false;
        }
    });

    findUserData.catch(function(err) {
        console.log("Something complitly off" + err);
    });
}

Register.prototype.createNewUser = function () {
    const db = new Datastore('users.db');
    // make sure there are no duplications
    db.ensureIndex({ fieldName: 'user', unique: true }, function (err) {});
    db.loadDatabase();

    if (!this.user || !this.pass) {
        console.log('You didn\'t specifid user and password, please start again');
    }

    var keys = ['pass'];
    var sEncripteddata = cryptoJSON.encrypt(this, password, { encoding, keys, algorithm });
    db.insert(sEncripteddata);
    console.log('You are all set with the new user! \nIf you want to login please choose -signin and provide your new user and password');
};