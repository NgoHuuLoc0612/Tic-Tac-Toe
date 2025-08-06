document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const restartButton = document.getElementById('restartButton');
    const cells = document.querySelectorAll('.cell');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const scoreDrawElement = document.getElementById('scoreDraw');

    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', '']; // Represents the 3x3 board
    let gameActive = true;
    let scores = {
        X: 0,
        O: 0,
        draw: 0
    };

    const winningConditions = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal from top-left
        [2, 4, 6]  // Diagonal from top-right
    ];

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        // If cell is already filled or game is over, do nothing
        if (board[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        // Update board state and UI
        board[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase()); // Add 'x' or 'o' class for styling

        checkResult();
    };

    const checkResult = () => {
        let roundWon = false;
        let winningLine = null;

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue; // Skip if any cell in the condition is empty
            }
            if (a === b && b === c) {
                roundWon = true;
                winningLine = winCondition;
                break; // Found a winner
            }
        }

        if (roundWon) {
            statusElement.textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            scores[currentPlayer]++;
            highlightWinningCells(winningLine);
            updateScoreboard();
            return;
        }

        // Check for a draw (if all cells are filled and no winner)
        if (!board.includes('')) {
            statusElement.textContent = 'Game is a draw!';
            gameActive = false;
            scores.draw++;
            updateScoreboard();
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
    };

    const highlightWinningCells = (winningLine) => {
        winningLine.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    };

    const restartGame = () => {
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        statusElement.textContent = `Player ${currentPlayer}'s turn`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell'); // Clear classes
        });
        // Scoreboard is not reset, it keeps track of multiple games
    };

    const updateScoreboard = () => {
        scoreXElement.textContent = scores.X;
        scoreOElement.textContent = scores.O;
        scoreDrawElement.textContent = scores.draw;
    };

    // Add event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);

    // Initial game state setup
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
    updateScoreboard();
});