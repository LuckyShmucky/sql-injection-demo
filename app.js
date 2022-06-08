const http = require('http')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use('/login')
const db = new sqlite3.Database(":memory:");
db.serialize(() => {
db.run(`CREATE TABLE users (username TEXT, password TEXT, title TEXT)`);
db.run(`INSERT INTO users VALUES ('privilegedUser', 'privilegedUser', 'Administrator')`);
 
});


app.get('/', (req, res) =>{
    try{
        res.sendFile('index.html')
    } catch(error){
        res.status(error.status || 500)
        res.send(`${error}`)
    }
})

app.post('/login', (req, res) => {
    try{ 
    let username = req.body.username
    let password = req.body.password
    console.log({username, password})
    let query = "SELECT title FROM users where username = '" + username + "' and password = '" + password + "'";
    db.get(query, function (err, row) {
        if (err) {
            console.log('The first condition ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            console.log('Hello <b>' + row.title + `!</b><br /> 
            This file contains all your secret data: <br /><br /> 
            SECRETS <br /><br /> MORE SECRETS <br /><br /> 
            <a href="/index.html">Go back to login</a>`);
        }
    });
    

    } catch(error){
        res.status(error.status || 500)
        res.send(`${error}`)
    }
})

app.listen(3003, () => {
    console.log('server is running')
})