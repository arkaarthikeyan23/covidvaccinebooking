const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
 

router.get('/',(req,res)=>{
    res.render('login')
})
// User routes
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/login', userController.getLoginPage);
router.post('/login', userController.login);
router.get('/signup', (req, res) => {
    res.render('signup');
  });
router.get('/signup', userController.getSignupPage);
router.post('/signup', userController.signup);
router.get('/logout', userController.logout);
router.get('/search', userController.getSearchPage);
router.get('/searchResults', userController.searchCentres);
router.post('/apply', userController.applyForSlot);


module.exports = router;
