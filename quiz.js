// Supabase Initialization
const supabaseUrl = 'https://airfdancdzkaxebikanm.supabase.co';
const supabaseAnonKey = '...';  // Make sure to have your actual Anon Key here
const { createClient } = window.supabase;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const questionContainer = document.getElementById('question-container');
const nextButton = document.getElementById('next');
let shuffledQuestions, currentQuestionIndex, score = 0;

const questions = [
    {
        question: 'What does AI stand for?',
        answers: [
            { text: 'Artificial Intelligence', correct: true },
            { text: 'Amazing Interface', correct: false },
            // Add other choices if you want
        ]
    },
    {
        question: 'Which of the following is a programming language?',
        answers: [
            { text: 'Python', correct: true },
            { text: 'Snake', correct: false },
            { text: 'Lizard', correct: false },
            { text: 'Gecko', correct: false }
        ]
    },
    {
        question: 'Which company developed the Android operating system?',
        answers: [
            { text: 'Apple', correct: false },
            { text: 'Microsoft', correct: false },
            { text: 'Google', correct: true },
            { text: 'Samsung', correct: false }
        ]
    }
    // Add more questions here
];

function startQuiz() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    setNextQuestion();
}

function setNextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endQuiz();
    }
}

function showQuestion(question) {
    questionContainer.innerText = question.question;
    // Logic to display answer choices
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        questionContainer.appendChild(button);
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        score++;
    }
    Array.from(questionContainer.children).forEach(button => {
        if (button.tagName === 'BUTTON') {
            button.disabled = true;
        }
    });
}

async function endQuiz() {
    // Display score
    document.getElementById("result").innerText = `Your score is: ${score}`;

    const username = prompt("Enter your name for the leaderboard:");
    let { data, error } = await supabase
        .from('scores')
        .insert([{ name: username, score: score }]);
    if (error) {
        console.error("Error inserting score:", error);
    }
    displayLeaderboard();
}

async function displayLeaderboard() {
    let { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(50);
    if (error) {
        console.error("Error fetching leaderboard:", error);
        return;
    }
    var leaderboardHtml = "<h2>Leaderboard</h2><ul>";
    for (let i = 0; i < data.length; i++) {
        leaderboardHtml += `<li>${data[i].name} - ${data[i].score}</li>`;
    }
    leaderboardHtml += "</ul>";
    document.getElementById("leaderboard").innerHTML = leaderboardHtml;
}

startQuiz();
