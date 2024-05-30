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
// Function to end the current game
function endCurrentGame() {
    if (currentGame) {
        currentGame.endGame(); // End the game if it exists
    }
}

// Define the Game class
class Game {
    constructor() {
        this.gridSize = 10; // Set the grid size
        this.grid = []; // Initialize the grid array
        this.players = ["player1", "player2"]; // Define the players
        this.currentTurnIndex = 0; // Set the current turn index
        this.monsters = {
            player1: [],
            player2: []
        }; // Initialize monsters for each player
        this.removedMonsters = {
            player1: 0,
            player2: 0
        }; // Initialize count of removed monsters for each player
        this.turnEnded = false; // Flag to indicate if the turn has ended
    }

     // Initialize the game
     init() {
        this.createGrid(); // Create the game grid
        this.displayPlayerInfo(); // Display player information
    }

    // Create the game grid
    createGrid() {
        const gameGrid = document.getElementById('game-grid'); // Get the grid element
        gameGrid.innerHTML = ''; // Clear existing grid
        this.grid = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(null)); // Create a 10x10 grid

        // Create grid cells
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.onclick = () => this.handleCellClick(i, j); // Attach click event handler
                gameGrid.appendChild(cell); // Add cell to the grid
            }
        }
    }

    

