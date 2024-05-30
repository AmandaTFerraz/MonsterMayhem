// Initialize the current game to null and set game count to 0
let currentGame = null;
let gameCount = 0;

// Define player statistics for wins and losses
let playerStats = {
    player1: { wins: 0, losses: 0 },
    player2: { wins: 0, losses: 0 }
};


// Function to start a new game
function startNewGame() {
    currentGame = new Game(); // Create a new Game instance
    currentGame.init(); // Initialize the new game
    gameCount++; // Increment the game count
    updateGameStats(); // Update the displayed game statistics
}
