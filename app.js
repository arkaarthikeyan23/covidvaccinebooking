const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// Set up MongoDB connection
mongoose.connect('mongodb+srv://kaarthikeyan:Kaarthi2002@vaccinationbookingapp.mc8axno.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Set up session middleware
app.use(
  session({
    secret: 'mySecretKey123!@#',
    resave: false,
    saveUninitialized: true,
  })
);

// Set up request body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up static file serving
app.use(express.static('public'));

// Set up EJS as the view engine
app.set('views',path.join(__dirname,'src','views'))
app.set('view engine', 'ejs');

// Set up API routes
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
