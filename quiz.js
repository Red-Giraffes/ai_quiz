// In-memory leaderboard storage
var leaderboard = [];

function submitQuiz() {
    var name = document.getElementById("name").value;
    if(!name) {
        alert("Please enter your name");
        return;
    }

    var score = 0;

    // Q1
    if (document.querySelector('input[name="q1"]:checked').value === "John McCarthy") {
        score++;
    }

    // Q2
    if (document.querySelector('input[name="q2"]:checked').value === "Inverted Learning") {
        score++;
    }

    // Q3
    if (document.querySelector('input[name="q3"]:checked').value === "OpenAI") {
        score++;
    }

    // Q4
    var q4Answers = document.querySelectorAll('input[name="q4"]:checked');
    if (q4Answers.length === 1 && q4Answers[0].value === "Human Emotion Simulation") {
        score++;
    }

    // Q5
    if (document.querySelector('input[name="q5"]:checked').value === "Backpropagation") {
        score++;
    }

    // Update leaderboard
    updateLeaderboard(name, score);

    // Show current leaderboard
    showLeaderboard();
}

function updateLeaderboard(name, score) {
    leaderboard.push({name: name, score: score});

    // Sort leaderboard by score
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep top 50 users
    if (leaderboard.length > 50) {
        leaderboard = leaderboard.slice(0, 50);
    }
}

function showLeaderboard() {
    var leaderboardStr = "Leaderboard:\n";
    for (let i = 0; i < leaderboard.length; i++) {
        leaderboardStr += (i+1) + ". " + leaderboard[i].name + ": " + leaderboard[i].score + "\n";
    }
    alert(leaderboardStr);
}
