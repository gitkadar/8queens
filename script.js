const boardElement = document.getElementById('chessboard');
const statusElement = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');

let queenPositions = []; // Stores objects like {row: 0, col: 0}
let gameActive = false;

// Create the board
function createBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((r + c) % 2 === 0 ? 'light' : 'dark');
            square.dataset.row = r;
            square.dataset.col = c;
            square.addEventListener('click', () => handleSquareClick(r, c));
            boardElement.appendChild(square);
        }
    }
}

function handleSquareClick(row, col) {
    if (!gameActive) return;

    // Check if queen is already there to remove it
    const index = queenPositions.findIndex(q => q.row === row && q.col === col);
    if (index !== -1) {
        queenPositions.splice(index, 1);
        updateBoard();
        return;
    }

    // Check if placement is valid
    if (isSafe(row, col)) {
        queenPositions.push({ row, col });
        updateBoard();
        checkWin();
    } else {
        statusElement.innerText = "Cannot place Queen here! Square is under attack.";
        statusElement.style.color = "red";
        setTimeout(() => {
            if(gameActive) {
                statusElement.innerText = `Queens placed: ${queenPositions.length}`;
                statusElement.style.color = "#333";
            }
        }, 1500);
    }
}

function isSafe(row, col) {
    for (let q of queenPositions) {
        // Same row or column
        if (q.row === row || q.col === col) return false;
        // Diagonals
        if (Math.abs(q.row - row) === Math.abs(q.col - col)) return false;
    }
    return true;
}

function updateBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(sq => sq.classList.remove('queen'));
    
    queenPositions.forEach(q => {
        const index = q.row * 8 + q.col;
        squares[index].classList.add('queen');
    });

    statusElement.innerText = `Queens placed: ${queenPositions.length}`;
}

function checkWin() {
    if (queenPositions.length === 8) {
        statusElement.innerText = "YOU WIN! All 8 Queens are safe!";
        statusElement.style.color = "green";
        gameActive = false;
    }
}

startBtn.addEventListener('click', () => {
    queenPositions = [];
    gameActive = true;
    createBoard();
    statusElement.innerText = "Game Started! Place your first Queen.";
    statusElement.style.color = "#333";
});

endBtn.addEventListener('click', () => {
    gameActive = false;
    statusElement.innerText = "Game Ended. Press Start to play again.";
    statusElement.style.color = "#333";
});

// Initialize empty board on load
createBoard();