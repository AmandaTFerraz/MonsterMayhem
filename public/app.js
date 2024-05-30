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

    // Display player information
    displayPlayerInfo() {
        const playerInfo = document.getElementById('player-info');
        playerInfo.innerHTML = `
            Player 1 Monsters: ${this.monsters.player1.length}<br>
            Player 2 Monsters: ${this.monsters.player2.length}<br>
            Current Turn: ${this.players[this.currentTurnIndex]}
        `; // Show number of monsters and current turn
    }

    // Handle cell click event
    handleCellClick(row, col) {
        if (this.turnEnded) return; // Do nothing if turn has ended
        const currentPlayer = this.players[this.currentTurnIndex];
        if (this.isPlayerEdge(row, col, currentPlayer) && this.grid[row][col] === null) {
            const monsterType = this.getMonsterTypeFromPlayer();
            if (monsterType) {
                this.placeMonster(row, col, currentPlayer, monsterType); // Place monster if valid
            }
        } else if (this.grid[row][col] && this.grid[row][col].player === currentPlayer) {
            this.moveMonster(row, col, currentPlayer); // Move monster if it's the current player's monster
        }
        this.checkForConflicts(); // Check for any conflicts after action
        this.displayPlayerInfo(); // Update player info display
        this.checkForElimination(); // Check if any player is eliminated
    }

    // Check if the cell is on the player's edge
    isPlayerEdge(row, col, player) {
        if (player === "player1" && row === 0) return true; // Player 1's edge is row 0
        if (player === "player2" && row === this.gridSize - 1) return true; // Player 2's edge is the last row
        return false;
    }

    // Get the monster type from the player
    getMonsterTypeFromPlayer() {
        const monsterType = prompt("Enter monster type (V for Vampire, W for Werewolf, G for Ghost):");
        if (["V", "W", "G"].includes(monsterType)) {
            return monsterType; // Return valid monster type
        } else {
            alert("Invalid monster type"); // Show error for invalid input
            return null;
        }
    }

     // Place the monster on the grid
     placeMonster(row, col, player, monsterType) {
        const monster = { type: monsterType, row, col, player, hasMoved: false };
        this.grid[row][col] = monster; // Place monster in grid
        this.monsters[player].push(monster); // Add monster to player's list
        this.renderMonster(monster); // Render monster on the grid
    }

    // Move the monster to a new position
    moveMonster(row, col, player) {
        const monster = this.grid[row][col];
        if (monster && monster.player === player && !monster.hasMoved) {
            const newRow = prompt("Enter new row:");
            const newCol = prompt("Enter new column:");
            if (this.isValidMove(row, col, newRow, newCol, player)) {
                this.grid[row][col] = null; // Clear old position
                monster.row = parseInt(newRow);
                monster.col = parseInt(newCol);
                monster.hasMoved = true; // Mark monster as moved
                this.grid[newRow][newCol] = monster; // Place monster in new position
                this.checkForConflicts(); // Check for conflicts after move
                this.renderGrid(); // Re-render the grid
            } else {
                alert("Invalid move"); // Show error for invalid move
            }
        }
    }

    // Check if the move is valid
    isValidMove(oldRow, oldCol, newRow, newCol, player) {
        newRow = parseInt(newRow);
        newCol = parseInt(newCol);
        if (newRow < 0 || newRow >= this.gridSize || newCol < 0 || newCol >= this.gridSize) return false; // Check bounds
        if (this.grid[newRow][newCol] && this.grid[newRow][newCol].player !== player) return false; // Check for opponent's monster
        const dRow = Math.abs(newRow - oldRow);
        const dCol = Math.abs(newCol - oldCol);
        return (dRow === 0 || dCol === 0 || (dRow === dCol && dRow <= 2)) && this.isPathClear(oldRow, oldCol, newRow, newCol, player); // Validate move direction and path
    }

    // Check if the path is clear for the move
    isPathClear(oldRow, oldCol, newRow, newCol, player) {
        const stepRow = Math.sign(newRow - oldRow);
        const stepCol = Math.sign(newCol - oldCol);
        let row = oldRow + stepRow;
        let col = oldCol + stepCol;
        while (row !== newRow || col !== newCol) {
            if (this.grid[row][col] && this.grid[row][col].player !== player) return false; // Path is blocked by opponent's monster
            row += stepRow;
            col += stepCol;
        }
        return true; // Path is clear
    }

     // Render a monster on the grid
     renderMonster(monster) {
        const cell = document.querySelector(`[data-row='${monster.row}'][data-col='${monster.col}']`);
        cell.innerText = monster.type; // Show monster type
        cell.style.color = monster.player === "player1" ? "red" : "blue"; // Color based on player
    }

    // Render the entire grid
    renderGrid() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.querySelector(`[data-row='${i}'][data-col='${j}']`);
                const monster = this.grid[i][j];
                cell.innerText = monster ? monster.type : ''; // Show monster type or clear cell
                cell.style.color = monster ? (monster.player === "player1" ? "red" : "blue") : ''; // Color based on player
            }
        }
    }

    // Switch to the next player's turn
    switchTurn() {
        this.resetMonsterMoves(); // Reset move status of all monsters
        this.currentTurnIndex = this.determineNextPlayerIndex(); // Determine the next player's turn
        if (this.currentTurnIndex === -1) {
            this.endRound(); // End the round if no valid next player
        }
    }

     // Reset the move status of all monsters
     resetMonsterMoves() {
        this.players.forEach(player => {
            this.monsters[player].forEach(monster => {
                monster.hasMoved = false; // Allow monsters to move again
            });
        });
    }

    // Determine the next player's turn based on monster counts
    determineNextPlayerIndex() {
        const monsterCounts = this.players.map(player => this.monsters[player].length);
        const minCount = Math.min(...monsterCounts);
        const candidates = this.players.filter((player, index) => monsterCounts[index] === minCount);

        if (candidates.length === 1) {
            return this.players.indexOf(candidates[0]);
        } else {
            const randomIndex = Math.floor(Math.random() * candidates.length);
            return this.players.indexOf(candidates[randomIndex]);
        }
    }

    endPlayerTurn() {
        this.turnEnded = true;
        this.switchTurn();
        this.turnEnded = false;
    }

    endRound() {
        alert("Round ended. All players have taken their turns.");
        this.currentTurnIndex = 0;
        this.switchTurn();
    }

    checkForConflicts() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const monsters = this.getMonstersAtPosition(i, j);
                if (monsters.length > 1) {
                    this.resolveConflict(monsters);
                }
            }
        }
    }

    getMonstersAtPosition(row, col) {
        const monsters = [];
        if (this.grid[row][col]) {
            monsters.push(this.grid[row][col]);
        }
        return monsters;
    }

    resolveConflict(monsters) {
        if (monsters.length < 2) return;

        const [monster1, monster2] = monsters;
        const result = this.getConflictResult(monster1, monster2);

        if (result === 1) {
            this.removeMonster(monster2);
        } else if (result === -1) {
            this.removeMonster(monster1);
        } else if (result === 0) {
            this.removeMonster(monster1);
            this.removeMonster(monster2);
        }
    }

    getConflictResult(monster1, monster2) {
        const rules = {
            V: { W: 1, G: -1, V: 0 },
            W: { V: -1, G: 1, W: 0 },
            G: { V: 1, W: -1, G: 0 }
        };

        return rules[monster1.type][monster2.type];
    }

    removeMonster(monster) {
        const { row, col, player } = monster;
        this.grid[row][col] = null;
        this.monsters[player] = this.monsters[player].filter(m => m !== monster);
        this.removedMonsters[player]++;
        this.renderGrid();
    }

    checkForElimination() {
        const players = Object.keys(this.removedMonsters);
        players.forEach(player => {
            if (this.removedMonsters[player] >= 10) {
                this.endGame(this.players.find(p => p !== player));
            }
        });
    }

    endGame(winningPlayer) {
        if (!winningPlayer) {
            winningPlayer = this.players.find(p => p !== this.players[this.currentTurnIndex]);
        }
        alert(`${winningPlayer} wins!`);
        playerStats[winningPlayer].wins++;
        playerStats[this.players.find(p => p !== winningPlayer)].losses++;
        updateGameStats();
        currentGame = null; // Reset current game
    }
}

function updateGameStats() {
    const gameStats = document.getElementById('game-stats');
    gameStats.innerHTML = `
        Games Played: ${gameCount}<br>
        Player 1 - Wins: ${playerStats.player1.wins}, Losses: ${playerStats.player1.losses}<br>
        Player 2 - Wins: ${playerStats.player2.wins}, Losses: ${playerStats.player2.losses}
    `;
}

updateGameStats();









