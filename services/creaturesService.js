const Creature = require('../models/Creature');
const User = require('../models/User');


exports.getAll = () => Creature.find().lean();

exports.create = async (ownerId, creaturesData) => {
    const createdCreature = await Creature.create({ ...creaturesData, owner: ownerId });

    await User.findByIdAndUpdate(ownerId, {$push : {createdCreature: createdCreature._id}});

    return createdCreature;
}

exports.getOne = (creatureId) => Creature.findById(creatureId).lean();

exports.findOwner = (userId) => User.findById(userId).lean();

exports.vote = async (userId, creatureId) => {
    const creature = await Creature.findById(creatureId); 
    const user = await User.findById(userId);
    //Todo: if user already sign in the course
    creature.votes.push(userId);
    user.votedCreature.push(creatureId);

    await creature.save();
    await user.save();

    // await Course.findByIdAndUpdate(courseId, { $push: { signUpList: userId }}); 
};

exports.votedUsernames = (creatureId) => {
    return Creature.findById(creatureId).populate('votes', 'email').lean().then(creature => {
        return creature.votes.map(user => user.email).join(', ');
    });
};

exports.edit = (creatureId, creatureData) => Creature.findByIdAndUpdate(creatureId, creatureData, { runValidators: true });

exports.delete = (creatureId) => Creature.findByIdAndDelete(creatureId);

exports.getMyCreatedPost = (userId) => Creature.find({ owner: userId}).lean();