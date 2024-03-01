const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        minLength: 3,
    },
    lastName: {
        type: String,
        require: true,
        minLength: 3,
    },
    email: {
        type: String,
        require: true,
        minLength: 10
    },
    password: {
        type: String,
        require: true,
        minLength: 4,
    },
    createdCreature: [{
        type: mongoose.Types.ObjectId,
        ref: 'Creature',
    }],
    votedCreature: [{
        type: mongoose.Types.ObjectId,
        ref: 'Creature',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;

