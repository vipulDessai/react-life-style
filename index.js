const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the bulid directory
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(path.join(__dirname, 'build', 'index.html')));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);