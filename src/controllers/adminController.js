const Admin = require('../models/Admin');
const Centre = require('../models/Centre');
const Vaccine = require('../models/Vaccine');
const bcrypt = require('bcrypt');

// Render the admin login page
exports.getAdminLoginPage = (req, res) => {
  res.render('admin-login');
};

// Handle admin login form submission
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).send('Admin not found.');
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(401).send('Invalid password.');
    }

    // Set admin session data
    req.session.admin = admin;

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

exports.getSearchPage = async (req, res) => {
  try {
    const centres = await Centre.find();
    res.render('adminDashboard', { centres });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getDashboardPage = async (req, res) => {
  try {
    const centres = await Centre.find();
    res.render('adminDashboard', { centres });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.addCentre = async (req, res) => {
  const { name, workingHours, slotsAvailable } = req.body;
  try {
    const centre = new Centre({
      name,
      workingHours,
      slotsAvailable,
    });
    await centre.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getDosageDetails = async (req, res) => {
  try {
    const dosageDetails = await Vaccine.aggregate([
      {
        $group: {
          _id: '$centreId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'centres', // Assuming the collection name for centres is 'centres'
          localField: '_id',
          foreignField: '_id',
          as: 'centre'
        }
      },
      {
        $project: {
          _id: 0,
          // centreId: '$_id',
          centreName: { $arrayElemAt: ['$centre.name', 0] },
          dosageCount: '$count'
        }
      }
    ]);

    res.send(dosageDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.removeCentre = async (req, res) => {
  const { centreId } = req.body;
  try {
    await Centre.findByIdAndRemove(centreId);
    await Vaccine.deleteMany({ centreId });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
