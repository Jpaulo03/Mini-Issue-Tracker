const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const db = require('./models');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
require('./routes')(app);

db.sequelize.sync({
    //force: true
}).then(() => {
    console.log("db resync");
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})