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
    speakQuestion.lang = "en-US";
    speakQuestion.onend = function () {
        let index = 0;
        function speakNextAnswer() {
            if (index < allAnswers.length) {
              const speakAnswer = new SpeechSynthesisUtterance(allAnswers[index]);
              speakAnswer.lang = "en-US";
              speakAnswer.onend = function () {
                index++; 
                speakNextAnswer();
              };
              window.speechSynthesis.speak(speakAnswer);
            }
          }
          speakNextAnswer();
    };
    window.speechSynthesis.speak(speakQuestion);

    quizContainer.innerHTML = `
        <h4 class="px-2 py-3 mb-5 border-bottom border-warning border-2 text-warning">${question}</h4>
        <div id="answer-buttons">
        ${allAnswers
          .map((answer) => `<button id="anwser-button" class="btn btn-outline-warning btn-lg w-75 my-2">${answer}</button><br>`)
          .join("")}
          </div>
          <div>
           <button id="get-spoken-answer" class="btn btn-outline-warning  btn-lg rounded-circle p-1 mb-3" data-bs-toggle="tooltip" data-bas-placement="top" title="Click to give answer by speech"><i class="bi bi-mic"></i></button>
        </div>
        <div id="feedback" class="p-2 m-2 fs-3"></div>
        `;
    const answerButtons =document.querySelectorAll("#answer-buttons button");
    answerButtons.forEach((button) =>{
        button.addEventListener("click",()=> checkCorrectAnswer(button.textContent, correctAnswer));}
    );
    const spokenButton = document.getElementById("get-spoken-answer");
    spokenButton.addEventListener("click", ()=>{
        startSpeechRecognition(correctAnswer);
    });
  };    
  xhr.open("GET", apiUrl, true);
  xhr.send();
}
function startSpeechRecognition(correctAnswer){
    if ('webkitSpeechRecognition' in window)
    {
        const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.continuous = false; //stop afer one sentence
        recognition.interimResults = false; // Only final results
        recognition.start();
        recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("You said: ", transcript);
        checkCorrectAnswer(transcript, correctAnswer);
        };
        recognition.onerror = function(event){
            console.log("Speech recognition error", event.error);
        }
        
    }else {
        console.log("Speech recognition not supported in this browser.");
    }
}
function checkCorrectAnswer(selectedAnswer, correctAnswer){
    let feedback = document.getElementById("feedback");
    if(selectedAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()){
        score++;
        feedback.textContent = "Answer correct !";
        feedback.classList.add("text-success");
        const correctText = new SpeechSynthesisUtterance("Answer correct");
        window.speechSynthesis.speak(correctText);
    }else{
        feedback.textContent = `Wrong answer, the correct answer was ${correctAnswer}`;
        feedback.classList.add("text-danger");
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
            const message = score === totalNumberOfQuestions ? "Perfect" : score > totalNumberOfQuestions-1 ? "Well Done" : "Better luck next time.";
            quizContainer.innerHTML=`
            <h1 class="display-4 mb-4 text-warning">GAME OVER</h1>
            <p class="fs-3 mb-3">You scored <span class="fw-bold">${score}</span> out of <span class="fw-bold">${totalNumberOfQuestions}</span></p>
            <p class="fs-4 mb-4">${message}</p>
            <button id="play-again-button" class="btn btn-outline-success btn-lg px-4 py-2 mt-4">Play again ?</button>`
            document.getElementById("play-again-button").addEventListener("click",()=>startGame());
        },2000);
    }
}
function startGame(){
    score= 0;
    numberOfQuestionsAsked = 0;
    quizContainer.innerHTML=`
    <h1 class="text-decoration-underline mb-5 pb-5">Movie quiz game</h1>
    <button id="start-game" class="btn btn-outline-success btn-lg px-4 py-2 mt-5">Start Game</button>`
    document.getElementById("start-game").addEventListener("click",()=> getQuestion());
}
startGame();