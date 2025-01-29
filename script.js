let score = 0;
let totalNumberOfQuestions = 5;
let numberOfQuestionsAsked = 0;
let quizContainer = document.getElementById("quiz-container");
let scoreResult = document.getElementById("scoreResult");
let questionObject;

function displayScore(){
    scoreResult.textContent = `SCORE: ${score}/${numberOfQuestionsAsked}`
}
function getQuestion() {
  const apiUrl =
    "https://opentdb.com/api.php?amount=1&category=11&difficulty=easy&type=multiple";
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    questionObject = JSON.parse(this.responseText);
    const question = questionObject.results[0].question;
    const correctAnswer = questionObject.results[0].correct_answer;
    const incorrectAnswers = questionObject.results[0].incorrect_answers;
    const allAnswers = [correctAnswer, ...incorrectAnswers];
    allAnswers.sort(() => Math.floor(Math.random() * allAnswers.length));

    //text to speech
    const speakQuestion = new SpeechSynthesisUtterance(question);
    speakQuestion.onend = function () {
        let index = 0;
        function speakNextAnswer() {
            if (index < allAnswers.length) {
              const speakAnswer = new SpeechSynthesisUtterance(allAnswers[index]);
              speakAnswer.onend = function () {
                index++; // Move to the next answer
                speakNextAnswer(); // Speak the next one
              };
              window.speechSynthesis.speak(speakAnswer);
            }
          }
          speakNextAnswer();
    };
    window.speechSynthesis.speak(speakQuestion);

    quizContainer.innerHTML = `
        <h4>${question}</h4>
        <div id="answer-buttons">
        ${allAnswers
          .map((answer) => `<button>${answer}</button><br>`)
          .join("")}
        </div>
        <div id="feedback"></div>
        `;
    const answerButtons =document.querySelectorAll("#answer-buttons button");
    answerButtons.forEach((button) =>{
        button.addEventListener("click",()=> checkCorrectAnswer(button.textContent, correctAnswer));}
    );
  };    
  xhr.open("GET", apiUrl, true);
  xhr.send();
}
function checkCorrectAnswer(selectedAnswer, correctAnswer){
    let feedback = document.getElementById("feedback");
    if(selectedAnswer === correctAnswer){
        score++;
        feedback.textContent = "Answer correct !";
        const correctText = new SpeechSynthesisUtterance("Answer correct");
        window.speechSynthesis.speak(correctText);
    }else{
        feedback.textContent = `Wrong answer, the correct answer was ${correctAnswer}`;
        const wrongText = new SpeechSynthesisUtterance(`Wrong answer, the correct answer was ${correctAnswer}`);
        window.speechSynthesis.speak(wrongText);
    }
    numberOfQuestionsAsked++;
    displayScore();
    if(numberOfQuestionsAsked !== totalNumberOfQuestions){
        setTimeout(()=>getQuestion(),2000);
    }else{
        setTimeout(()=>{
            scoreResult.textContent="";
            const message = score === 5 ? "Perfect" : score > 4 ? "Well Done" : "Better luck next time.";
            quizContainer.innerHTML=`
            <h1>GAME OVER</h1>
            <p>You scored ${score} out of ${totalNumberOfQuestions}</p>
            <p>${message}</p>
            <button id="play-again-button">Play again ?</button>`
            document.getElementById("play-again-button").addEventListener("click",()=>startGame());
        },2000);
    }
}
function startGame(){
    score= 0;
    numberOfQuestionsAsked = 0;
    quizContainer.innerHTML=`
    <h1>Movie quiz game</h1>
    <div><button id="start-game">Start Game</button></div>`
    document.getElementById("start-game").addEventListener("click",()=>(getQuestion()));
}
startGame();