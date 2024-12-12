const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');

const flash = require('connect-flash');

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



const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
    session({
        secret: 'ankisyur369325djr2632qw23', // Replace with a strong, unique secret
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // Your MongoDB URI
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true, // Prevents client-side access
            secure: false, // Set to true if using HTTPS
        },
    })
);

// Flash Middleware
app.use(flash());

// Set Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
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
const dashboard = require('./routes/dashboard');
const logout = require('./routes/logout');
const userCountRoute = require('./routes/counter');
const subCountRoute = require('./routes/totalsubmission');
const contactCountRoute = require('./routes/totalcontacts');

const paymentCountRoute = require('./routes/totalpayment');
const capturepayRoute = require('./routes/capture-payment');
const alluploadedRoute = require('./routes/alluploaded');
const vieweachfileRoute = require('./routes/vieweachfile');
const alluserRoute = require('./routes/alluser');
const eachuserRoute = require('./routes/vieweachuser');

const allpaymentRoute = require('./routes/allpayment');
const issuesRoute = require('./routes/issues');

const allcontactsRoute = require('./routes/allcontacts');
const viewreviewersRoute = require('./routes/reviewers');


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
app.use('/' , dashboard);
app.use('/' ,logout);
app.use('/', userCountRoute);
app.use('/', subCountRoute);
app.use('/', contactCountRoute);
app.use('/', capturepayRoute);
app.use('/', alluploadedRoute);
app.use('/', vieweachfileRoute);
app.use('/', alluserRoute);
app.use('/', eachuserRoute);
app.use('/', allpaymentRoute);
app.use('/', paymentCountRoute);
app.use('/', issuesRoute);
app.use('/', allcontactsRoute);
app.use('/', viewreviewersRoute);

// Route to handle file download
app.get('/download/copyright-form', (req, res) => {
  const filePath = path.join(__dirname, 'public/authordownloads/Jl-copyright.pdf');
  res.download(filePath, 'Jl-copyright.pdf', (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      res.status(500).send('Error downloading file');
    }
  });
});
// Route to handle file download
app.get('/download/paper-format', (req, res) => {
  const filePath = path.join(__dirname, 'public/authordownloads/Journalslibrary-net-paper-format.docx');
  res.download(filePath, 'Paper-Format.docx', (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      res.status(500).send('Error downloading file');
    }
  });
});
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



