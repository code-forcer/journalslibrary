const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load environment variables
dotenv.config();
const app = express();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev')); // Log HTTP requests

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set the View Engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Import Routes
const indexRoutes = require('./routes/index');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const authregRoutes = require('./routes/auth');
const authlogRoutes = require('./routes/login');
const authorsguideRoutes = require('./routes/authorsguide');
const callforpaperRoutes = require('./routes/callforpaper');
const checkforpaperstatusRoutes = require('./routes/checkpaperstatus');
const editorialboardRoutes = require('./routes/editorialboard');
const payfeeRoutes = require('./routes/payfee');
const peerreviewRoutes = require('./routes/peerreview');
const submitmanuscriptsRoutes = require('./routes/submitmanuscripts');
const topicsRoutes = require('./routes/topics');

// Use Routes
app.use('/', indexRoutes);
app.use('/', aboutRoutes);
app.use('/',contactRoutes);
app.use('/',authregRoutes);
app.use('/',authlogRoutes);
app.use('/', authorsguideRoutes);
app.use('/', callforpaperRoutes);
app.use('/',checkforpaperstatusRoutes);
app.use('/',editorialboardRoutes);
app.use('/',payfeeRoutes);
app.use('/',peerreviewRoutes);
app.use('/',submitmanuscriptsRoutes);
app.use('/',topicsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}🔥`);
});



