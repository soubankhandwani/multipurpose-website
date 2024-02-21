const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrls')
const bodyParser = require("body-parser");
const ytdl = require("ytdl-core");
const path = require('path')
const app = express()
const port = 5000
mongoose.connect('mongodb://localhost/urlShortener')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }), bodyParser.json(), express.static(path.join(__dirname, 'css')), express.static(path.join(__dirname, 'images')), express.static(path.join(__dirname, 'js')))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/url-shortener', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('url-shortener', { shortUrls: shortUrls })
})

app.get('/yt-download', (req, res) => {
    res.render('downloader')
})

app.get('/qr-scanner', (req, res) => {
    res.render('qr-scanner')
})

app.get('/img-to-pdf', (req, res) => {
    res.render('img-to-pdf')
})

app.get('/password-generator', (req, res) => {
    res.render('password-generator')
})

app.get('/password-generator', (req, res) => {
    res.render('password-generator')
})

app.get('/url-shortener', (req, res) => {
    res.render('url-shortener')
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/url-shortener')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.post("/download", async (req, res) => {
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

app.get("/download/:videoId", (req, res) => {
    const { videoId } = req.params;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);
});






app.listen(process.env.PORT || port);