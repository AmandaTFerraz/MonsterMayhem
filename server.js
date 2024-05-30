const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let currentGame = null;
let gameCount = 0;
let playerStats = {
    player1: { wins: 0, losses: 0 },
    player2: { wins: 0, losses: 0 }
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
