const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path')


app.set('port',5000);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));
//routes
app.get('/',(req,res) =>{
    res.sendFile(path.resolve(__dirname, './public/html/register.html'))
});

app.get('/chat',(req,res) =>{
    res.sendFile(path.resolve(__dirname, './public/html/index.html'))
});
exports.default = app;