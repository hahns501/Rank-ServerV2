import jwt from 'jsonwebtoken';
import pool from '../db.js';
import {Verify} from '../middleware/Verify.js';


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
        // console.log(users);
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

    const {email, password} = req.body;
    console.log(`Recieved username: ${email}, password: ${password}`);

    let q = `select user_id,email,password,role from user where user.email = '${email}'`


    // replace with actual db
    let user = null;
    const dbRes = null;

    try{
        let data = await pool.query(q);

        let serEmail = data[0][0].email;
        let serPass = data[0][0].password;
        let serRole = data[0][0].role;
        let serId = data[0][0].user_id;

        if(serPass !== password){
            console.log('Incorrect Password');
            res.status(400).send("Password is incorrect");
            return
        }

        user = {'id': serId, 'email':serEmail, 'role':serRole};
    }catch(err){
        res.status(400).send("No User Found");
        return
    }

    console.log(user);

    if(user){
        const accessToken = generateAccessToken(user);
        // Need to store
        const refreshToken = generateRefreshToken(user);

        console.log(accessToken)
        refreshTokens.push(refreshToken);

        const userInfo = {
            "user" : {
                "email" : user.email,
                "role" : user.role
            },
            "accessToken" : accessToken
        }

        res.send(userInfo);
    }else{
        console.log('no user')
        res.status(400).send("No User Found");
    }

}

export const createUser = async(req,res) => {
    let newUserData = req.body;

    let q = `insert into user(email, password, first_name, last_name, job_position, role) values ('${newUserData.email}', '${newUserData.password}', '${newUserData.fName}', '${newUserData.lName}', '${newUserData.occupation}', '${newUserData.role}')`;

    console.log(newUserData);

    try{
        let dbRes = await pool.query(q);
        console.log(dbRes);
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