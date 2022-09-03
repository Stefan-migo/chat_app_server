const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js'); //here we have the routes for the sign in and sign up.

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); //it allows us to make cross-origin requests.
app.use(express.json()); // it allows us to pass json payloads from the frontend to the backend.
app.use(express.urlencoded()); // it is a build in middleware expression on nodejs

app.get('/', (req, res)=> {
    res.send('hello, world!');
});

app.use('/auth', authRoutes); 


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));