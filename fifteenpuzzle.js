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

// Functions
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
    do {
        tiles.sort(() => Math.random() - 0.5);
    } while (!isSolvable());
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
    const inversions = tiles
        .filter(tile => tile !== null)
        .flatMap((tile, i, arr) => arr.slice(i + 1).map(next => tile > next ? 1 : 0))
        .reduce((acc, inv) => acc + inv, 0);
    const emptyRowFromBottom = 4 - Math.floor(tiles.indexOf(null) / 4);
    return (inversions + emptyRowFromBottom) % 2 === 0;
}
