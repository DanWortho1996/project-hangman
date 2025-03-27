let game;
let aiGame;
const aiLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Hangman Game Class
class Hangman {
    constructor(word) {
        this.word = word.toUpperCase();
        this.guessedLetters = new Set();
        this.lives = 6;
        this.updateHiddenWord();
    }

    guess(letter) {
        letter = letter.toUpperCase();
        if (this.guessedLetters.has(letter) || this.lives <= 0) return;
        this.guessedLetters.add(letter);

        if (!this.word.includes(letter)) {
            this.lives--;
        }
        this.updateHiddenWord();
        updateUI();
    }

    updateHiddenWord() {
        this.hiddenWord = this.word.split('').map(l => this.guessedLetters.has(l) ? l : '_').join(' ');
    }

    isGameOver() {
        return this.lives <= 0 || !this.hiddenWord.includes('_');
    }
}

// Start Solo Mode
function startSolo() {
    game = new Hangman("JAVASCRIPT");
    updateUI();
    document.getElementById("message").textContent = "";
    document.getElementById("player-letters").innerHTML = "";
}

// Start AI Duel Mode
function startAIDuel() {
    game = new Hangman("DEVELOPER");
    aiGame = new Hangman("PROGRAM");
    updateUI();
    document.getElementById("message").textContent = "AI Duel Mode Started!";
    document.getElementById("player-letters").innerHTML = "";
    document.getElementById("ai-letters").innerHTML = "";
    aiTurn();
}

// Make a guess
function makeGuess() {
    const input = document.getElementById("guess-input");
    const letter = input.value.trim();
    if (letter) {
        game.guess(letter);
        input.value = "";
        updateUsedLetters(letter, true);
        checkGameOver();
        if (!game.isGameOver()) {
            setTimeout(aiTurn, 1000);
        }
    }
}

// AI Turn
function aiTurn() {
    if (aiGame.isGameOver()) return;
    
    let aiGuess;
    do {
        aiGuess = aiLetters[Math.floor(Math.random() * aiLetters.length)];
    } while (aiGame.guessedLetters.has(aiGuess));
    
    aiGame.guess(aiGuess);
    document.getElementById("message").textContent = `AI guessed: ${aiGuess}`;
    updateUsedLetters(aiGuess, false);
    checkGameOver();
}

// Update the game UI
function updateUI() {
    document.getElementById("hidden-word").textContent = game.hiddenWord;
    document.getElementById("lives").textContent = `Lives: ${game.lives}`;
}

// Update used letters for both player and AI
function updateUsedLetters(letter, isPlayer) {
    const span = document.createElement("span");
    
    // Check whether it's the player's guess or the AI's guess
    const isCorrect = isPlayer ? game.word.includes(letter) : aiGame.word.includes(letter);
    
    // Set the color of the guessed letter based on whether it's correct
    span.style.color = isCorrect ? "green" : "red";
    span.textContent = letter;
    
    if (isPlayer) {
        document.getElementById("player-letters").appendChild(span);
    } else {
        document.getElementById("ai-letters").appendChild(span);
    }

    // Add space between the letters for better formatting
    const space = document.createElement("span");
    space.textContent = " ";
    if (isPlayer) {
        document.getElementById("player-letters").appendChild(space);
    } else {
        document.getElementById("ai-letters").appendChild(space);
    }
}

// Check if the game is over and display the appropriate message
function checkGameOver() {
    if (game.isGameOver() || aiGame.isGameOver()) {
        if (game.lives > 0 && !game.hiddenWord.includes("_")) {
            document.getElementById("message").textContent = "You Win!";
        } else if (aiGame.lives > 0 && !aiGame.hiddenWord.includes("_")) {
            document.getElementById("message").textContent = "AI Wins!";
        } else {
            document.getElementById("message").textContent = `Game Over! The word was: ${game.word}`;
            document.getElementById("hidden-word").textContent = game.word.split('').join(' ');
        }
    }
}

// Event Listeners
document.getElementById("solo-btn").addEventListener("click", startSolo);
document.getElementById("ai-btn").addEventListener("click", startAIDuel);
document.getElementById("guess-btn").addEventListener("click", makeGuess);
