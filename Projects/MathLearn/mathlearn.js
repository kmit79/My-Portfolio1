/**
 * MathLearn.js - Educational Math Game Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let score = 0;
    let currentNum1 = 0;
    let currentNum2 = 0;
    let correctAnswer = 0;
    let userTypedAnswer = "";
    let questionsSolved = 0;
    const levelGoal = 10; // Questions per progress cycle
    let timerInterval;
    const TIME_LIMIT = 20; // Seconds per question
    let timeLeft = TIME_LIMIT;

    // --- DOM Element Selectors ---
    const num1Display = document.querySelectorAll('.num')[0];
    const num2Display = document.querySelectorAll('.num')[1];
    const operatorDisplay = document.querySelector('.operator');
    const answerBox = document.querySelector('.answer-box');
    const scoreDisplay = document.querySelector('.score');
    const mascot = document.querySelector('.mascot');
    const numpad = document.querySelector('.numpad');
    const timerDisplay = document.getElementById('time-left');
    const overlay = document.getElementById('times-up-overlay');

    function startTimer(resume = false) {
        clearInterval(timerInterval);
        if (!resume) timeLeft = TIME_LIMIT;
        if (timerDisplay) timerDisplay.textContent = timeLeft;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        }, 1000);
    }

    function handleTimeout() {
        if (overlay) overlay.classList.remove('hidden');
        mascot.textContent = "⏰";
        mascot.classList.add('sad');
        
        // Reset user input state
        userTypedAnswer = "";
        answerBox.textContent = "?";
        answerBox.style.color = "inherit";

        setTimeout(() => {
            if (overlay) overlay.classList.add('hidden');
            generateQuestion();
        }, 2000);
    }

    /**
     * Generates a new random multiplication question and resets input state
     */
    function generateQuestion() {
        startTimer();
        const operators = ['+', '-', '×', '÷'];
        const operator = operators[Math.floor(Math.random() * operators.length)];

        if (operator === '+') {
            currentNum1 = Math.floor(Math.random() * 50) + 1;
            currentNum2 = Math.floor(Math.random() * 50) + 1;
            correctAnswer = currentNum1 + currentNum2;
        } else if (operator === '-') {
            currentNum1 = Math.floor(Math.random() * 50) + 10;
            currentNum2 = Math.floor(Math.random() * (currentNum1 - 1)) + 1;
            correctAnswer = currentNum1 - currentNum2;
        } else if (operator === '×') {
            currentNum1 = Math.floor(Math.random() * 10) + 1;
            currentNum2 = Math.floor(Math.random() * 10) + 1;
            correctAnswer = currentNum1 * currentNum2;
        } else if (operator === '÷') {
            const tempAns = Math.floor(Math.random() * 9) + 1;
            currentNum2 = Math.floor(Math.random() * 9) + 1;
            currentNum1 = tempAns * currentNum2; // Ensures an integer result
            correctAnswer = tempAns;
        }

        // Update UI
        num1Display.textContent = currentNum1;
        num2Display.textContent = currentNum2;
        if (operatorDisplay) operatorDisplay.textContent = operator;
        
        // Reset Mascot
        mascot.textContent = "🤔";
        mascot.classList.remove('happy', 'sad');
        
        userTypedAnswer = "";
        answerBox.textContent = "?";
        answerBox.style.color = "inherit";
    }

    /**
     * Updates the score and progress bar based on performance
     */
    function updateUI() {
        scoreDisplay.textContent = `ניקוד: ${score}`;

        // Trigger "pop" animation for a stylish feedback when score updates
        scoreDisplay.classList.remove('score-pop');
        void scoreDisplay.offsetWidth; // Force reflow to allow re-triggering the animation
        scoreDisplay.classList.add('score-pop');
    }

    /**
     * Evaluates the user's answer and provides feedback
     */
    function checkAnswer() {
        if (userTypedAnswer === "") return;

        clearInterval(timerInterval);
        const isCorrect = parseInt(userTypedAnswer) === correctAnswer;

        if (isCorrect) {
            score += 10;
            questionsSolved++;
            answerBox.style.color = "#22c55e"; // Success Green
            mascot.textContent = "🥳";
            mascot.classList.add('happy');
            
            setTimeout(() => {
                updateUI();
                generateQuestion();
            }, 600);
        } else {
            answerBox.style.color = "#ef4444"; // Error Red
            mascot.textContent = "😟";
            mascot.classList.add('sad');
            // Briefly show red, then clear input for a second attempt
            setTimeout(() => {
                userTypedAnswer = "";
                answerBox.textContent = "?";
                answerBox.style.color = "inherit";
                startTimer(true); // Resume timer for the second attempt
            }, 600);
        }
    }

    // --- Event Listeners ---
    numpad.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.textContent;

        if (button.classList.contains('clear')) {
            userTypedAnswer = "";
            answerBox.textContent = "?";
        } else if (button.classList.contains('submit')) {
            checkAnswer();
        } else if (userTypedAnswer.length < 3) {
            // Append number input
            userTypedAnswer += action;
            answerBox.textContent = userTypedAnswer;
        }
    });

    // Keyboard support for better UX
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' && userTypedAnswer.length < 3) {
            userTypedAnswer += e.key;
            answerBox.textContent = userTypedAnswer;
        } else if (e.key === 'Enter') {
            checkAnswer();
        } else if (e.key === 'Backspace' || e.key === 'Escape') {
            userTypedAnswer = "";
            answerBox.textContent = "?";
        }
    });

    // Initialize Game
    updateUI();
    generateQuestion();
});