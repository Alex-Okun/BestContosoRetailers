const cryptoJSON = require('crypto-json')
const Datastore = require('nedb');
const algorithm = 'camellia-128-cbc';
const encoding = 'hex';
const keys = ['hello', 'bar', 'baz', 'a', 'b', 'test'];
const password = 'myPassword';

const database = new Datastore('users.db');
database.loadDatabase();

function createNewUser(sUserName, sPassword) {
    oUser = {
        user: sUserName,
        pass: sPassword
    }
    keys = [pass];
    var sEncripteddata = cryptoJSON.encrypt(oUser, password, { encoding, keys, algorithm });
    console.log(sEncripteddata);
}

createNewUser('user1', 'password1');