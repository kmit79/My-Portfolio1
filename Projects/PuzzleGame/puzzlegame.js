const boardElement = document.getElementById('board');
const imageSelect = document.getElementById('imageSelect');
const puzzleSize = 3; // 3x3
const tileSize = 100; // Size of each tile in pixels

// Array representing the current positions of the tiles.
// 0 is the first tile (0,0), 1 is (0,1), ..., 8 is the empty slot.
let tiles = [];
let currentImageUrl = '';

// Function to calculate the (X, Y) coordinates of a tile based on its index.
function getCoordinates(index) {
    return {
        x: index % puzzleSize,
        y: Math.floor(index / puzzleSize)
    };
}

// Array initialization function.
function initTiles() {
    tiles = [];
    for (let i = 0; i < puzzleSize * puzzleSize - 1; i++) {
        tiles.push(i); // Tiles 0 to 7
    }
    tiles.push(null); // Empty slot
}

// Main function: creates the board and displays the tiles.
function createBoard() {
    boardElement.innerHTML = '';
    tiles.forEach((tileIndex, currentIndex) => {
        const tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');

        if (tileIndex === null) {
            tileDiv.classList.add('empty');
        } else {
            // This is an image tile - set its background.
            tileDiv.style.backgroundImage = `url(${currentImageUrl})`;

            // Calculate the original position of the tile (to determine which part of the image to show).
            const originalCoords = getCoordinates(tileIndex);
            
            // Calculate the background-position.
            // Important: we move the background left and up, so we use negative values.
            // Since the board is in RTL, we must flip the image X-axis 
            // so that tile 0 (rightmost on the board) shows the original right part of the image instead of the left.
            const backgroundX = (puzzleSize - 1 - originalCoords.x) * tileSize;
            const backgroundY = originalCoords.y * tileSize;
            
            tileDiv.style.backgroundPosition = `-${backgroundX}px -${backgroundY}px`;

            // Inside the createBoard loop, where the tileDiv is created:
            tileDiv.setAttribute('data-number', tileIndex + 1);            
        }

        tileDiv.addEventListener('click', () => moveTile(currentIndex));
        boardElement.appendChild(tileDiv);
    });
}

function moveTile(currentIndex) {
    const emptyIndex = tiles.indexOf(null);
    const currentCoords = getCoordinates(currentIndex);
    const emptyCoords = getCoordinates(emptyIndex);

    // Adjacency check (difference must be exactly 1 in X or Y, but not both).
    const isAdjacent = Math.abs(currentCoords.x - emptyCoords.x) + Math.abs(currentCoords.y - emptyCoords.y) === 1;

    if (isAdjacent) {
        // Swap positions in the array.
        [tiles[currentIndex], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[currentIndex]];
        createBoard();
        checkWin();
    }
}

function changeImage() {
    currentImageUrl = imageSelect.value;
    shuffleGame(); // Automatically shuffle when changing the image.
}

function shuffleGame() {
    initTiles(); // Start from a completely solved board [0, 1, 2, ..., null].
    
    let shuffleMoves = 0;
    const maxShuffleMoves = 100; // Number of shuffle steps.

    while (shuffleMoves < maxShuffleMoves) {
        const emptyIndex = tiles.indexOf(null);
        const neighbors = getValidNeighbors(emptyIndex);
        
        // Select a random neighbor and swap with it.
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        [tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]];
        shuffleMoves++;
    }

    document.getElementById('message').textContent = '';
    createBoard();
    toggleHints(); // Ensure hints state is applied after a new board is created
}

// Helper function to find indices of valid neighbors for the empty slot.
function getValidNeighbors(emptyIndex) {
    const coords = getCoordinates(emptyIndex);
    const neighbors = [];
    
    const possibleMoves = [
        { x: coords.x - 1, y: coords.y }, // Left
        { x: coords.x + 1, y: coords.y }, // Right
        { x: coords.x, y: coords.y - 1 }, // Up
        { x: coords.x, y: coords.y + 1 }  // Down
    ];

    possibleMoves.forEach(move => {
        if (move.x >= 0 && move.x < puzzleSize && move.y >= 0 && move.y < puzzleSize) {
            neighbors.push(move.y * puzzleSize + move.x);
        }
    });

    return neighbors;
}

function checkWin() {
    // Check if each tile is in its original index.
    const isWon = tiles.every((tileIndex, currentIndex) => {
        if (currentIndex === tiles.length - 1) {
            return tileIndex === null; // The last slot must be empty.
        }
        return tileIndex === currentIndex; // All others in order.
    });

    if (isWon) {
        // Hide numbers on win
        boardElement.classList.remove('show-hints'); // Hide numbers on win
        const hintToggle = document.getElementById('hintToggle');
        if (hintToggle) {
            hintToggle.checked = false; // Uncheck the toggle
        }
        // Show the full image (turn the empty slot into the last tile).
        tiles[tiles.length - 1] = tiles.length - 1;
        createBoard();
        // Remove 'empty' class from the last tile.
        boardElement.lastChild.classList.remove('empty');
        
        document.getElementById('message').textContent = 'כל הכבוד! פתרת את הפאזל!';
    }
}

// Function to toggle number visibility based on the checkbox state
function toggleHints() {
    const hintToggle = document.getElementById('hintToggle');
    if (hintToggle && hintToggle.checked) {
        boardElement.classList.add('show-hints');
    } else {
        boardElement.classList.remove('show-hints');
    }
}

// Initial initialization
currentImageUrl = imageSelect.value;
shuffleGame();
createBoard();