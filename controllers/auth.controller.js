require('dotenv').config()
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');


const register = async (req, res) =>{
    /* const {name, email, password} = req.body;
    
    if(!name || !email || !password){
        throw new BadRequestError("Please provide complete info (name, email and password");
    }

    const id = new Date().getDate(); */
    //const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'})
    
    const user = await User.create({...req.body})
    const token = user.generateAccessToken();
    res.status(StatusCodes.CREATED).json({msg:'user created successfully', user, token})                                                                                                                                                 
    
}
const login = async (req, res) =>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError("Please provide both email and password");
        
    }

    const user = await User.findOne({email});

    if (!user) {
        throw new UnauthenticatedError("invalid credentials");
    }
    
    const isPassword = await user.comparePassword(password);
    console.log(isPassword);
    

    if (!isPassword) {
        throw new UnauthenticatedError("invalid credentials");
    }

    const token = user.generateAccessToken();

    res.status(200).json({msg:`user ${user.name} logged in successfully`, token})
}

const dashboard = async (req, res) =>{
    const LuckyNumber = Math.floor(Math.random()*100);
    
    res.status(200).json({
        msg: `Hello ${req.user.username}`, 
        secret: `here is your secret number ${LuckyNumber}`
    })
    
}

module.exports = {register, login, dashboard}