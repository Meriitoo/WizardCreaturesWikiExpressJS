const User = require('../models/User');
const bcrypt = require('bcrypt');

const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../constants');

exports.findByUsername = (firstName) => User.findOne({firstName});
exports.findByEmail = (email) => User.findOne({email});

exports.register = async  ( firstName, lastName, email, password, repeatPassword) =>
{
    //Validate both passwords
    if (password !== repeatPassword){
        throw new Error('Password missmatch');
    }
    
    // Check if user exists
    const existingUser = await this.findByUsername(firstName);

    // const existingUser = await User.findOne({
    //     $or: [
    //         { email },
    //         { username },
    //     ]
    // });

    if (existingUser){
        throw new Error('User exists');
    }

    //Add hash and salt
    const hashedPassword = await bcrypt.hash(password, 10);

   await  User.create ({ firstName, lastName, email, password: hashedPassword }); 

   return this.login(email, password); //login automatically after register
};

exports.login =  async (email, password) => 
{
    //User exists
    const user = await this.findByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    //Generate token
    const payload = {
        _id: user.id,
        email,
        firstName: user.firstName,
    };

   const token = await jwt.sign(payload, SECRET);

   return token;

};
   