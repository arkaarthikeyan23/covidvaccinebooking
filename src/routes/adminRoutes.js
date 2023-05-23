const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
  

router.get('/',(req,res)=>{
    res.render('adminLogin')
})
router.get('/login', adminController.getAdminLoginPage);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);
router.get('/dashboard', adminController.getDashboardPage);
router.get('/search', adminController.getSearchPage);
router.post('/centres', adminController.addCentre);
router.get('/dosage', adminController.getDosageDetails);
router.post('/remove-centre', adminController.removeCentre);

module.exports = router;
