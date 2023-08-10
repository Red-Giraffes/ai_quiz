// Supabase Initialization
const supabaseUrl = 'https://airfdancdzkaxebikanm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpcmZkYW5jZHprYXhlYmlrYW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2NjQ0OTksImV4cCI6MjAwNzI0MDQ5OX0.GnIe2Zdg3d5Vv00a201j7GKilZ0pGicrcgDvRd5sPGM';
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
            
        ]
    },
    
];
// Additional questions here

// Function to start the quiz
function startQuiz() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    setNextQuestion();

    function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        score++;
    }
    // Optionally: remove all buttons or disable them to prevent multiple selections
}

function showQuestion(question) {
    questionContainer.innerHTML = ''; // clear previous content
    
    const questionElem = document.createElement('div');
    questionElem.innerText = question.question;
    questionContainer.appendChild(questionElem);
    
    question.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.innerText = answer.text;
        btn.classList.add('btn');
        if (answer.correct) {
            btn.dataset.correct = answer.correct;
        }
        btn.addEventListener('click', selectAnswer);
        questionContainer.appendChild(btn);
    });
}
}

// Function to set the next question
function setNextQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endQuiz();
    }
}

// Function to show the current question
function showQuestion(question) {
    questionContainer.innerHTML = ''; // clear previous content
    
    const questionElem = document.createElement('div');
    questionElem.innerText = question.question;
    questionContainer.appendChild(questionElem);
    
    question.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.innerText = answer.text;
        btn.classList.add('btn');
        if (answer.correct) {
            btn.dataset.correct = answer.correct;
        }
        btn.addEventListener('click', selectAnswer);
        questionContainer.appendChild(btn);
    });
}

// Function to end the quiz
async function endQuiz() {
    // Display score to the user
    document.getElementById("result").innerText = `Your score is: ${score}`;

    const username = prompt("Enter your name for the leaderboard:");
    
    let { data, error } = await supabase
        .from('scores')
        .insert([{ name: username, score: score }]);
    
    if (error) {
        console.error("Error inserting score:", error);
    }

    // Display the leaderboard
    displayLeaderboard();
}

// Function to display the leaderboard
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

// Start the quiz when the page loads
startQuiz();

