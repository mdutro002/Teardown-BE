const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const Pool = require('pg').Pool
const {Client} = require('pg');

//MIDDLEWARE
app.set('views', __dirname + '/views');
require('dotenv').config();
app.use(express.json());

const PORT = process.env.PORT || 3333
let pool = ''

//DB CONNECTION
if (process.env.DATABASE_URL) {
  console.log('database');
    pool = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
  pool.connect();
}

//API ROUTES
//ROUTES - GET ALL REVIEWS
app.get('/', cors(), (req, res) => {
  pool.query('SELECT * FROM reviews', (err, result) => {
    if (err){
      console.log(err)
      throw err
    }
    res.json(result.rows);
  })
})

//ROUTES - GET ALL CREATORS
app.get('/creators', (req, res) => {
  pool.query('SELECT first, last FROM creators', (err, result) => {
    if (err){
      console.log(err)
      throw err
    }
    res.json(result.rows);
  })
})

//ROUTES - CREATE REVIEW 
app.post('/review', cors(), (req, res) => {
  client.connect();
  const query = 'INSERT INTO reviews (site, reviewtitle, reviewbody, creatorID) VALUES ($1, $2, $3, $4) RETURNING *';
  const params = [req.body.site, req.body.reviewtitle, req.body.reviewbody, req.body.creatorID]
  client.query(query, params).then(data => {
    res.json(data.rows[0]);
    client.end();
  })
})

//ROUTES - CREATE CREATOR
app.post('/creators', cors(), (req, res) => {
  //sanitize and bcrypt password here
  client.connect();
  const query = 'INSERT INTO creators (first, last, pw) VALUES ($1, $2, $3) RETURNING *';
  const params = [req.body.firstname, req.body.lastname, req.body.pw];
  client.query(query, params).then(data => {
    res.json(data.rows[0]);
    client.end();
  })
})

//ROUTES - UPDATE REVIEW

//ROUTES - UPDATE CREATOR

//ROUTES - DELETE REVIEW

//ROUTES - DELETE CREATOR

//LISTENER
app.listen(PORT, () => {
  console.log("listening on ", PORT);
  console.log(process.env.DATABASE_URL);
})

//Reference the following guide when working with databases
//https://www.taniarascia.com/node-express-postgresql-heroku/

/* 
 LOCAL CONNECT SCRIPTS
  // console.log('posting locally');
  // pool = new Pool({
  //   user: process.env.DBUSER,
  //   password: process.env.PASSWORD,
  //   port: process.env.PG_PORT,
  //   database: process.env.DBNAME
  // })  
  // client = new Client({
  //   user: process.env.DBUSER,
  //   password: process.env.PASSWORD,
  //   port: process.env.PG_PORT,
  //   database: process.env.DBNAME
  // });

  // pool.connect((err, client, release) => {
  //   if (err){
  //     return console.error('Error acquiring client', err.stack)
  //   }
  //   client.query('SELECT NOW()', (err, result) => {
  //     if (err) {
  //       return console.error('Error executing query', err.stack)
  //     }
  //     console.log(result.rows);
  //   })
  // });

*/