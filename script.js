const landingPage = document.querySelector(".landing-page");
const gameCategory = document.querySelector(".game-category");
const quizSection = document.querySelector(".quiz");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const scoreElement = document.createElement("div");

let currentQuestionIndex = 0;
let questions = [];
let score = 0;

// Function to show the landing page and hide other sections
function showLandingPage() {
    landingPage.style.display = "";
    gameCategory.style.display = "none";
    quizSection.style.display = "none";
    scoreElement.style.display = "none"; // Hide score element
}

// Function to show the game category selection and hide other sections
function showGameCategory() {
    landingPage.style.display = "none";
    gameCategory.style.display = "";
    quizSection.style.display = "none";
    scoreElement.style.display = "none"; // Hide score element
}

// Function to show the quiz and hide other sections
function showQuiz(category) {
    landingPage.style.display = "none";
    gameCategory.style.display = "none";
    quizSection.style.display = "";
    score = 0; // Reset score when quiz starts
    currentQuestionIndex = 0; // Reset question index
    scoreElement.style.display = "none"; // Hide score element
    getQuestions(category);
}

// Function to fetch questions from the Open Trivia Database API
async function getQuestions(category) {
    const API_URL = `https://opentdb.com/api.php?amount=10&type=multiple&category=${encodeURIComponent(category)}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Check if the question property exists
        if (data.results && data.results.length > 0 && data.results[0].question) {
            questions = data.results;
            displayQuestion();
        } else {
            console.error("Invalid data format:", data);
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Function to display the current question
function displayQuestion() {
    optionsContainer.style.display = '';
    const currentQuestion = questions[currentQuestionIndex];

    // Check if the currentQuestion object and its question property exist
    if (currentQuestion && currentQuestion.question) {
        questionElement.textContent = currentQuestion.question;

        optionsContainer.innerHTML = "";
        currentQuestion.incorrect_answers.forEach((option) => {
            addOption(option, false);
        });

        addOption(currentQuestion.correct_answer, true);
    } else {
        console.error("Invalid question format:", currentQuestion);
    }
}

// Function to add option buttons to the options container
function addOption(text, isCorrect) {
    const optionElement = document.createElement("button");
    optionElement.textContent = text;
    optionElement.classList.add("option");
    optionElement.dataset.correct = isCorrect;
    optionElement.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionElement);
}

// Function to handle option selection
async function selectOption(event) {
    const selectedOption = event.target;
    const isCorrect = selectedOption.dataset.correct === "true";

    if (isCorrect) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        showScore();
    }
}

// Function to show the score
function showScore() {
    optionsContainer.style.display = 'none';
    questionElement.textContent = ""; // Clear the question text
    scoreElement.innerHTML = `Your score: ${score} out of ${questions.length}<br>
    <a href="#" id="restart-link" style="font-weight: bold; color: black;">RESTART</a>`;
    scoreElement.classList.add("score");
    quizSection.appendChild(scoreElement);
    scoreElement.style.display = ""; // Show score element

    // Add event listener to the restart link
    document.getElementById("restart-link").addEventListener("click", function(event) {
        event.preventDefault();
        showLandingPage();
    });
}

// Initial setup
showLandingPage();
