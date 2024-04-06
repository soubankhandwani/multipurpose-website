// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const collection = require('./models/config');
const ShortUrl = require('./models/shortUrls');
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Setting up Express app and port
const app = express();
const port = 5000;

// Connecting to MongoDB (for url shortener and login/signup)
mongoose.connect('mongodb://localhost/multiWebsiteDB');

// Setting view engine to EJS
app.set('view engine', 'ejs');

// To use CSS
app.use(express.urlencoded({ extended: false }), bodyParser.json(), express.static(path.join(__dirname, 'css')), express.static(path.join(__dirname, 'images')), express.static(path.join(__dirname, 'js')));
app.use(express.static("css"));

// Session setup
app.use(session({
    secret: '1212121212',
    resave: false,
    saveUninitialized: true,
}));

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Logout Failed');
        } else {
            res.redirect('/');
        }
    });
});

// Middleware for user authentication
const authenticateUser = async (req, res, next) => {
    try {
        const isAuthenticated = req.session.isAuthenticated;
        if (isAuthenticated) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Routes (a route takes you to a page mentioned in the res.render(page name to go to) )
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/home', authenticateUser, (req, res) => {
    res.render('index');
});

app.get('/url-shortener', authenticateUser, async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('url-shortener', { shortUrls: shortUrls });
});

app.get('/yt-download', authenticateUser, (req, res) => {
    res.render('downloader');
});

app.get('/qr-scanner', authenticateUser, (req, res) => {
    res.render('qr-scanner');
});

app.get('/img-to-pdf', authenticateUser, (req, res) => {
    res.render('img-to-pdf');
});

app.get('/password-generator', authenticateUser, (req, res) => {
    res.render('password-generator');
});

// Handling URL shortening
app.post('/shortUrls', authenticateUser, async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/url-shortener');
});

// Handling URL redirection for short URLs
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
});

// Handling video download requests
app.post("/download", authenticateUser, async (req, res) => {
    const { videoUrl } = req.body;

    try {
        const info = await ytdl.getInfo(videoUrl);
        const downloadLink = `http://localhost:${port}/download/${info.videoDetails.videoId}`;
        res.json({ downloadLink });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error downloading video" });
    }
});

// Serving downloadable videos
app.get("/download/:videoId", (req, res) => {
    const { videoId } = req.params;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);
});

// Handling user signup
app.post("/signup", async (req, res) => {
    const data = {
        email: req.body.emailID,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
        res.send("User already exists. Please choose a different email!");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;
        await collection.create(data);
        res.send("Registration Success!");
    }
});

// Handling user login
app.post("/login", async (req, res) => {
    try {
        const user = await collection.findOne({ email: req.body.emailID });
        if (!user) {
            res.send("Username not found");
            return;
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordMatch) {
            req.session.isAuthenticated = true;
            res.redirect('/home');
        } else {
            res.send("Wrong Password");
        }
    } catch (error) {
        console.error('Login error:', error);
        res.send("Wrong details");
    }
});

// Start the server
app.listen(process.env.PORT || port);
