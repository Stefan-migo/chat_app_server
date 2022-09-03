const crypto = require('crypto');
const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;

//enviromental variables to pass through to Stream (API). 
require('dotenv').config(); //this will allow us to call the enviroment variables inside of the nodejs app

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;


const login = async (req, res) => {
    try{
        const { username, password } = req.body;//we get the username and the password from the frontend
        
        const serverClient = connect(api_key, api_secret, app_id); //this will create a connection to Stream.
        const client = StreamChat.getInstance(api_key, api_secret); //we create a instans in order to query all the users from the database(Stream), that match this specific username.

        const { users } = await client.queryUsers({ name: username }); //now we are taking the username, and we want to query all the user from the database to see if anyone matches.

        if(!users.length) return res.status(400).json({ message: 'User not found'});//users.lenght bassically check if the user exists.
        const success = await bcrypt.compare(password, users[0].hashedPassword);//here is the user exists, we are checking if the hashed password we have stored into the database, matches with the password the user introduced in the front end.
        
        
        const token = serverClient.createUserToken(users[0].id); //we are creating a new token that passes the users id we already have within the database.

        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });//if the password matches with the hashed password, we will send back the correct information that belongs to that user.
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }

}

const signup = async (req, res) => {
    try{
        const { fullName, username, password, phoneNumber } = req.body;

        const userId = crypto.randomBytes(16).toString('hex'); //this one will create a random crypto string
        const serverClient = connect(api_key, api_secret, app_id); //this will create a connection to Stream.
        // all of this thing should be secret, so we are gonna use some enviromental variables to pass them through.
        const hashedPassword = await bcrypt.hash(password, 10); // this function will turn our plain password into a hashed password.   
        const token = serverClient.createUserToken(userId); 

        res.status(200).json({ token, userId, fullName, username, phoneNumber, hashedPassword });


    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
}

module.exports = { login, signup }