const router = require('express').Router();
const creaturesService = require('../services/creaturesService');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorUtils');

router.get('/all-posts', async (req, res) => {
   const creatures = await creaturesService.getAll();
   res.render('creatures/all-posts', { creatures });
});

router.get('/create', isAuth, (req, res) => {
   res.render('creatures/create');
});

router.post('/create', isAuth, async (req, res) => {
   const creaturesData = req.body;

   try {
      await creaturesService.create(req.user._id, creaturesData);
   } catch (error) {
      return res.status(400).render('creatures/create', { ...creaturesData, error: getErrorMessage(error), creaturesData: creaturesData });

   }

   res.redirect('/creatures/all-posts');
});

router.get('/:creatureId/details', async (req, res) => {
   const creature = await creaturesService.getOne(req.params.creatureId);
   const totalVotes = creature.votes.length;

   const isOwner = creature.owner == req.user?._id;
   const creatureOwner = await creaturesService.findOwner(creature.owner).lean();
   const isVote = creature.votes?.some(user => user._id == req.user?._id);

   const whoVotes = await creaturesService.votedUsernames(req.params.creatureId);


   res.render('creatures/details', { ...creature, isOwner, isVote, creatureOwner, totalVotes, whoVotes});
});

router.get('/:creatureId/vote', isAuth, async (req, res) => {
   try {
      await creaturesService.vote(req.user._id, req.params.creatureId);
   } catch (error) {
      return res.status(400).render('404', { error: getErrorMessage(error) });
   }

   res.redirect(`/creatures/${req.params.creatureId}/details`);
});

router.get('/:creatureId/edit', isAuth, isOwner, async (req, res) => {
   const creature = await creaturesService.getOne(req.params.creatureId);
   res.render('creatures/edit', { ...creature });
});


router.post('/:creatureId/edit', isAuth, isOwner, async (req, res) => {
   const creatureData = req.body;

   try {
      await creaturesService.edit(req.params.creatureId, creatureData);
      res.redirect(`/creatures/${req.params.creatureId}/details`);

   } catch (error) {
      return res.render('creatures/edit', { ...creatureData, error: getErrorMessage(error)});
   };

});

router.get('/:creatureId/delete', isAuth, isOwner, async (req, res) => {

   await creaturesService.delete(req.params.creatureId);
   res.redirect('/creatures/all-posts')
});


async function isOwner(req, res, next) {
   const creature = await creaturesService.getOne(req.params.creatureId);

   if (creature.owner != req.user?._id) {
      return res.redirect(`/creatures/${req.params.creatureId}/details`);
   }

   next();
};


module.exports = router;


