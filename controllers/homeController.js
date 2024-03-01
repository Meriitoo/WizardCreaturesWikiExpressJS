const router = require('express').Router();
const creaturesService = require('../services/creaturesService');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    console.log(req.user)
    res.render('home');
});

router.get('/profile', isAuth, async (req, res) => {
    const userId = req.user._id;

    const creatures = await creaturesService.getMyCreatedPost(userId);
    const owner = await creaturesService.findOwner(userId);

    res.render('home/profile', { creatures, owner });
});

module.exports = router;