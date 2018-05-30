const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');

db.init();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/register', function(req, res) {
    if (!req.body.firstName || !req.body.LastName || !req.body.tel || !req.body.email || !req.body.password) {
        res.status(400).json({error: 'Wrong registrant data', 
        accepted_data_example: {
                "firstName": "firstname",
                "LastName": "Lastname",
                "tel": 123,
                "email": "test@example.com",
                "password": 123,
                "meta": {
                    "description": "test"
                },
            }
        });
    } else {
        db.userExists(req.body.email)
        .then(result => {
            if (result) {
                res.status(400).json({error: 'User already exists'});
            } else {
                return db.createUser(req.body);
            }
        })
        .then(user => {
            if (user) {
                res.json(user);
            }
        })
        .catch(error => console.log('Error test', error));
    }
});

app.get('/authorise', function(req, res) {

});

app.get('/logout', function(req, res) {

});

app.get('/users', authorise, function(req, res) {
    db.getAllUsers().then(result => res.json(result))
    .catch(error => res.status(500).json({error: 'Could not return data'}));
});

app.get('/users/:id', authorise, function(req, res) {
    // +req.params.id for a quick to number conversion
    db.getAllUsers().then(result => res.json(result.filter(item => item.id === +req.params.id)))
    .catch(error => res.status(500).json({error: 'Could not return data'}));
});

app.delete('/users/:id', authorise, function(req, res) {
    db.removeUserById(+req.params.id).then(result => res.json(result))
    .catch(error => res.status(500).json({error: 'Error during processing'}));
});

app.put('/users/:id', authorise, function(req, res) {
    db.patchUserById(+req.params.id, req.body).then(result => res.json(result))
    .catch(error => res.status(500).json({error: 'Error during processing'}));
});

// Other API calls are not supported
app.all("*", function(req, res) {
    res.status(404).json({
        error: "This API call is not supported"
    });
});


app.listen(3000, function() {
    console.log('Listening on port 3000!');
});

function authorise (req, res, next) {
/*
    // -----------------------------------------------------------------------
    // authentication middleware
  
    const auth = {login: 'yourlogin', password: 'yourpassword'} // change this
  
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [login, password] = new Buffer(b64auth, 'base64').toString().split(':')
  
    // Verify login and password are set and correct
    if (!login || !password || login !== auth.login || password !== auth.password) {
      res.set('WWW-Authenticate', 'Basic realm="401"') // change this
      res.status(401).send('Authentication required.') // custom message
      return
    }
  
    // -----------------------------------------------------------------------
    // Access granted...*/
    next()
  
  };