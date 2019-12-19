'use strict';
'use global';
/**
 * Register used to create new users to be  able to login or to authenticate for the existing once
 **/
module.exports = Register;

const Datastore = require('nedb');
const db = new Datastore('users.db');
db.loadDatabase(function (err) { });
const cryptoJSON = require('crypto-json');
const algorithm = 'camellia-128-cbc';
const encoding = 'hex';
const password = 'myPassword';

function Register(user, pass) {
    this.user = user;
    this.pass = pass;
}

Register.prototype.signIn = function () {
    var oUser = this;
    return new Promise(function (resolveMain, rejectMain) {
        // Searching if the user if already exist 
        var oDBData = null;
        db.find({ user: oUser.user }, function (err, data) {
            if (data && data[0]) {
                oDBData = {
                    user: data[0].user,
                    pass: data[0].pass
                }
                if (oDBData && oDBData.user && oDBData.pass) {
                    // If user was found need to check if the password is correct
                    let keys = ['pass'];
                    var sencripteddata = cryptoJSON.encrypt(oUser, password, { encoding, keys, algorithm });
                    if (sencripteddata.pass === oDBData.pass) {
                        console.log("\nYou are authenticated :-)");
                        resolveMain('Authnetication succeeded');
                    } else {
                        console.log("\nYour user or password is incorrect please try again");
                        rejectMain('Password is incorrect');
                    }
                } else {
                    console.log("\nUser you provided doesn't exist, the good news are you can create a new user.\nCheck - help");
                    rejectMain('User doesn\'t exist');
                }

            }
            if (!oDBData) {
                console.log("Something complitly off" + err);
                rejectMain();
            }
        });
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