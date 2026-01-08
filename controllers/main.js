require('dotenv').config()
const { BadRequestError } = require('../errors');
const jwt = require('jsonwebtoken')

const register = async (req, res) =>{
    const {name, username, password} = req.body;
    if(!name || !username || !password){
        throw new BadRequestError("Please provide email and password");
        
    }
    const id = new Date().getDate();
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'})

    res.status(200).json({msg:'user created successfully', token})
}
const login = async (req, res) =>{
    const {username, password} = req.body;
    if(!username || !password){
        throw new BadRequestError("Please provide email and password");
        
    }
    const id = new Date().getDate();
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'})

    res.status(200).json({msg:'user created successfully', token})
}

const dashboard = async (req, res) =>{
    const LuckyNumber = Math.floor(Math.random()*100);
    
    res.status(200).json({
        msg: `Hello ${req.user.username}`, 
        secret: `here is your secret number ${LuckyNumber}`
    })
    
}

module.exports = {register, login, dashboard}