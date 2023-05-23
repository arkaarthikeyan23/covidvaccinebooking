const User = require('../models/User');
const Centre = require('../models/Centre');
const Vaccine = require('../models/Vaccine');
const bcrypt = require('bcrypt');

// User controller actions
exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Incorrect password.');
    }

    req.session.user = user;
    res.redirect('/user/search');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getSignupPage = (req, res) => {
  res.render('signup');
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    req.session.user = user;
    res.redirect('/user/search');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/user/login');
};

exports.getSearchPage = async (req, res) => {
  try {
    const centres = await Centre.find();
    res.render('userDashboard', { centres });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.searchCentres = async (req, res) => {
  
  const { centre, workingHours } = req.query;
  console.log(req.query)

  try {
    let searchConditions = {};

    // Add search condition for vaccination center
    if (centre) {
      searchConditions = { centreId: centre };
    }

    // Add search condition for working hours
    if (workingHours) {
      searchConditions.workingHours = { $regex: workingHours, $options: 'i' };
    }

    // Perform the search using the search conditions
    const centres = await Centre.find(searchConditions);

    res.render('searchResults', { centres });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.applyForSlot = async (req, res) => {
  // Check if centreId exists in the request body
  if (!req.body.centreId) {
    return res.status(400).send('centreId is required.');
  }
  const { centreId } = req.body;
  try {
    const centre = await Centre.findById(centreId);
    if (!centre) {
      return res.status(404).send('Centre not found.');
    }

    if (centre.slotsAvailable < 1) {
      return res.status(400).send('No slots available.');
    }

    centre.slotsAvailable -= 1;
    await centre.save();

    const vaccine = new Vaccine({
      userId: req.session.user._id,
      centreId,
    });
    await vaccine.save();

    res.redirect('/user/search');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
