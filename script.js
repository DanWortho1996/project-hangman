let game;
let aiGame;
const aiLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const wordList = [
    "JAVASCRIPT", "PYTHON", "TROJAN", "HORSE", "BETA", "PANTHER", "STARSHIP", 
    "ENTERPRISE", "SUMMERTIME", "SOLIDER", "WINTER", "TECHNICAL", "SPECIAL", 
    "HANGMAN", "ASSASSIN", "NECESSARY", "GOLIATH"
];

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

function startSolo() {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    game = new Hangman(randomWord);
    updateUI();
    document.getElementById("message").textContent = "";
    document.getElementById("player-letters").innerHTML = "";
}

function startAIDuel() {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    game = new Hangman(randomWord);
    aiGame = new Hangman(randomWord);
    updateUI();
    document.getElementById("message").textContent = "AI Duel Mode Started!";
    document.getElementById("player-letters").innerHTML = "";
    document.getElementById("ai-letters").innerHTML = "";
    aiTurn();
}

function makeGuess() {
    const input = document.getElementById("guess-input");
    const letter = input.value.trim().toUpperCase(); // Convert to uppercase
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

function updateUI() {
    document.getElementById("hidden-word").textContent = game.hiddenWord;
    document.getElementById("lives").textContent = `Lives: ${game.lives}`;
}

function updateUsedLetters(letter, isPlayer) {
    const span = document.createElement("span");
    span.textContent = letter;
    
    if (isPlayer) {
        span.style.color = game.word.includes(letter) ? "green" : "red";
        document.getElementById("player-letters").appendChild(span);
    } else {
        span.style.color = aiGame.word.includes(letter) ? "green" : "red";
        document.getElementById("ai-letters").appendChild(span);
    }
}

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

document.getElementById("solo-btn").addEventListener("click", startSolo);
document.getElementById("ai-btn").addEventListener("click", startAIDuel);
document.getElementById("guess-btn").addEventListener("click", makeGuess);
