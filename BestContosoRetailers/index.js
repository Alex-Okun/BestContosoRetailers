//const express = require('express');

//const app = express();
//const port =  3000;
//app.listen(port, () => console.log('listening at 3000'));
//app.use(express.static('Web'));

//app.use(express.json({limit: '1mb'}));

//app.get('/api', (request, response) => {
//    console.log('I got your request..doing the thingy');
//    console.log(request.body);
//    const myApp = require('./App/app.js');
//    const oInventory = myApp.getInventory();
//    response.json({
//        status: 'success',
//        data: { data: oInventory}
//    })
//});