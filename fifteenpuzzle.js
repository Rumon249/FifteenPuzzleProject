// Select DOM elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const victoryScreen = document.getElementById('victory-screen');
const settingsScreen = document.getElementById('settings-screen');
const playButton = document.getElementById('play-button');
const shuffleButton = document.getElementById('shuffle-button');
const playAgainButton = document.getElementById('play-again-button');
const settingsButton = document.getElementById('settings-button');
const saveSettingsButton = document.getElementById('save-settings-button');
const puzzleContainer = document.getElementById('puzzle-container');
const imageOptions = document.querySelectorAll('.image-option');
const themeSelector = document.getElementById('theme-selector');

// Game state
let selectedImage = 'img1.png';
let tiles = [];

// Event Listeners
playButton.addEventListener('click', startGame);
shuffleButton.addEventListener('click', shuffleTiles);
playAgainButton.addEventListener('click', startGame);
settingsButton.addEventListener('click', () => toggleScreen(settingsScreen));
saveSettingsButton.addEventListener('click', saveSettings);
imageOptions.forEach(option =>
    option.addEventListener('click', () => selectImage(option))
);


function startGame() {
    toggleScreen(gameScreen);
    initializePuzzle();
}

function initializePuzzle() {
    puzzleContainer.innerHTML = '';
    tiles = Array.from({ length: 15 }, (_, i) => i + 1).concat(null);
    shuffleTiles();
    renderPuzzle();
}

function shuffleTiles() {
    let isValid = false;

    while (!isValid) {
        // Generate a shuffled array with numbers 1-15 and one `null` for the empty space
        tiles = Array.from({ length: 15 }, (_, i) => i + 1).concat(null);
        tiles.sort(() => Math.random() - 0.5);

        // Check solvability
        isValid = isSolvable();
    }

    renderPuzzle();
}



function renderPuzzle() {
    puzzleContainer.innerHTML = '';
    tiles.forEach((tile, index) => {
        const div = document.createElement('div');
        div.className = tile ? 'puzzle-tile' : 'puzzle-tile empty';
        
        if (tile) {
            div.style.backgroundImage = `url('${selectedImage}')`;
            div.style.backgroundPosition = calculateBackgroundPosition(tile - 1);
            div.textContent = tile; // Show the number on top of the image
        }
        
        puzzleContainer.appendChild(div);
        if (tile) div.addEventListener('click', () => moveTile(index));
    });
}



function calculateBackgroundPosition(index) {
    const x = (index % 4) * -100;
    const y = Math.floor(index / 4) * -100;
    return `${x}px ${y}px`;
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const isAdjacent = [1, -1, 4, -4].includes(emptyIndex - index);
    if (isAdjacent) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        renderPuzzle();
        checkVictory();
    }
}

function checkVictory() {
    if (tiles.slice(0, -1).every((tile, i) => tile === i + 1)) {
        toggleScreen(victoryScreen);
    }
}

function saveSettings() {
    const selectedTheme = themeSelector.value;
    document.body.className = selectedTheme; 
    const screens = document.querySelectorAll('#settings-screen, #home-screen, #game-screen, #victory-screen'); 
    screens.forEach(screen => {
         screen.className = selectedTheme; // Apply the selected theme to all screens 
         });

    toggleScreen(gameScreen);
}

function selectImage(option) {
    imageOptions.forEach(img => img.classList.remove('selected'));
    option.classList.add('selected');
    selectedImage = option.src;
}

function toggleScreen(screen) {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    victoryScreen.style.display = 'none';
    settingsScreen.style.display = 'none';
    screen.style.display = 'block';
}

function isSolvable() {
    const flatTiles = tiles.filter(tile => tile !== null); // Exclude the empty tile
    let inversions = 0;
    // Count inversions (pairs where a larger number precedes a smaller one)
    for (let i = 0; i < flatTiles.length; i++) {
        for (let j = i + 1; j < flatTiles.length; j++) {
            if (flatTiles[i] > flatTiles[j]) {
                inversions++;
            }
        }
    }
    // Calculate the row of the empty tile from the bottom (1-based index)
    const emptyRowFromBottom = 4 - Math.floor(tiles.indexOf(null) / 4);
    // A puzzle is solvable if:
    // Number of inversions is even when the empty tile is on an odd row from the bottom
    // Number of inversions is odd when the empty tile is on an even row from the bottom
    return (inversions % 2 === 0) === (emptyRowFromBottom % 2 !== 0);
}


