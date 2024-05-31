// Listen for messages from the main thread
self.onmessage = function(event) {
    const { action, grid } = event.data;
    if (action === 'checkConflicts') {
        // Perform the conflicts checking here
        const conflicts = findConflicts(grid); // Assuming you have a function to find conflicts
        // Post back the result to the main thread
        postMessage({ action: 'conflictsChecked', result: conflicts });
    }
}

// Function to find conflicts in the grid
function findConflicts(grid) {
    const conflicts = [];

    // Iterate through each cell in the grid
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            if (cell) {
                // Check if there are multiple monsters in the same cell
                if (cell.length > 1) {
                    // If multiple monsters are present, it's a conflict
                    conflicts.push({ row: i, col: j, monsters: cell });
                }
            }
        }
    }

    // Return the conflicts information
    return conflicts;
}

