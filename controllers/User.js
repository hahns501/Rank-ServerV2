import jwt from 'jsonwebtoken';
import pool from '../db.js';
import {Verify} from '../middleware/Verify.js';

const users = [
    {
        id: '1',
        username: 'Shang',
        password: '12345678',
        role: "admin"
    },
    {
        id: '1',
        username: 'Jank',
        password: '12345678',
        role: "user"
    }
]

// Generate an access token
// Creat env file and use real secret key
const generateAccessToken = (user) => {
    return jwt.sign({ id:user.id, isAdmin:user.role}, "mySecretKey", { expiresIn: "15m"});
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id:user.id, isAdmin:user.isAdmin}, "myRefreshSecretKey", { expiresIn: "15m"});

}

// Need to use real db to store refreshTokens when generated to check if invalid
let refreshTokens = []

export const getAllUsers = async(req,res)=>{
    let q = 'select * from user';

    console.log("Fetching all users");
    try{
        let users = await pool.query(q);
        console.log(users);
        res.status(200).json(users[0]);
    }catch(err){
        console.log(err);

        res.status(400).send('Database Error');
    }
}

export const refreshToken = async (req, res) => {
    // Take the refresh token from user
    const refreshToken = req.body.token

    //  Send an error if there is no token or it's invalid
    if(!refreshToken) return res.status(401).send("You are not authenticated!");
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).send("Refresh token is not valid");
    }

    jwt.verify(refreshToken, 'myRefreshSecretKey', (err, user) =>{
        err && console.log(err);
        // Deletes from array but needs to be from db
        refreshTokens = refreshTokens.filter(token => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        })
    });
    // If everything is ok, create new access token, refresh token and send to user

}

export const testUser = async(req,res) => {
    let newUserData = req.body;
    console.log('testUser');
    console.log(req.user);

    try{
        res.status(200).send("Good");
    }catch(err){
        console.log(err);
        res.status(400).send("Bad");
    }
}

export const loginUser = async (req, res) => {
    console.log("Logging in User");

    const {username, password} = req.body;
    console.log(`Recieved username: ${username}, password: ${password}`)

    // replace with actual db
    const user = users.find( u => {
        return u.username === username && u.password === password;
    });

    if(user){
        const accessToken = generateAccessToken(user);
        // Need to store
        const refreshToken = generateRefreshToken(user);

        console.log(accessToken)
        refreshTokens.push(refreshToken);

        const userInfo = {
            "user" : {
                "username" : user.username,
                "role" : user.role
            },
            "accessToken" : accessToken
        }

        res.send(userInfo);
    }else{
        res.status(400).send("No User Found");
    }
}

export const createUser = async(req,res) => {
    let newUserData = req.body;

    try{
        console.log(newUserData);
        res.status(200).send("Good");
    }catch(err){
        console.log(err);
        res.status(400).send("Bad");
    }
}

export const logoutUser = async (req,res) => {
    const refreshToken = req.body.token;

    refreshTokens = refreshTokens.filter(token => token != refreshToken);
    res.status(200).send("You have logged out successfully")

}

/*

Test Cases to make
 1. Check if Admins can delete their own account and others
 2. Check if users can delete their own account

*/

export const deleteUser = async (req, res) => {
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).send("User has been deleted");
    }else{
        res.status(403).send("Unable to delete user");
    }
}