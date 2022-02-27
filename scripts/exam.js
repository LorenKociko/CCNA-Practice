// load localstorage
function loadLocalStorage() {
    if (localStorage['exam']) {
        return JSON.parse(localStorage.getItem('exam'))
    }
    alert("Something went wrong, we redirect you to the main menu.")
    window.location.href = "./index.html"
}
let parameters = loadLocalStorage()


// start hooks
const questionDiv = document.getElementById("questiondiv")
questionDiv.style.fontSize = '1.45em'
const questionArea = document.getElementById("question")
const answersArea = document.getElementById("answers")
const nextBtn = document.getElementById("nextBtn")
const plusBtn = document.getElementById("plusBtn")
const minusBtn = document.getElementById("minusBtn")
const questionNumber = document.getElementById("question-number")

// init

let selectedModules = parameters.selectedExams
let selectedQuestions = []
for (let i = 0; i < selectedModules.length; i++) {
    selectedQuestions.push(...eval(selectedModules[i]))
}
let finalQuestionsArray = []
if (parameters.questions == "All") {
    finalQuestionsArray = shuffleArray(selectedQuestions)
} else {
    finalQuestionsArray = shuffleArray(selectedQuestions).slice(selectedQuestions.length - parameters.questions)
}
let index = 0
let score = 0
let scoreIncriment = 1000 / finalQuestionsArray.length
let wrongAnswered = []

// main 
function main() {
    questionNumber.innerText = `${index+1}/${finalQuestionsArray.length}`
    document.activeElement.blur();
    answersArea.innerHTML = ''
    answersArea.setAttribute('class', '')
    if (index == finalQuestionsArray.length - 1) {
        nextBtn.outerHTML = '<input type="button" class="btns" id="submitBtn" value="Submit" onClick="showResults()">'
        nextBtn.value = 'Submit'
    }
    let currentQuestion = {}
    if (finalQuestionsArray.length > 0) {
        currentQuestion = finalQuestionsArray[index]
    } else {
        currentQuestion = {
            question: "Something went wrong!"
        }
    }
    questionArea.innerHTML = `${index+1}. ` + currentQuestion.question
    displayAnswers(currentQuestion)
}

function displayAnswers(currentQuestion) {
    let typeOfQuestion = (currentQuestion.type) === 'single' ?
        'radio' : 'checkbox'
    for (let i = 0; i < currentQuestion.answers.length; i++) {
        let answerElementDiv = document.createElement('div')
        let answerElementInput = document.createElement('input')
        let answerElementLabel = document.createElement('label')
        answerElementDiv.style.width = "100%"
        answerElementInput.setAttribute('type', `${typeOfQuestion}`);
        answerElementInput.setAttribute('name', 'answers');
        answerElementInput.setAttribute('class', 'answers-collection');
        answerElementInput.setAttribute('id', `${i}`);
        if (currentQuestion.correct.includes(i)) {
            answerElementDiv.setAttribute('class', 'correntAnswer');
        }
        answerElementLabel.setAttribute('for', `${i}`);
        answerElementLabel.innerText = currentQuestion.answers[i]
        answersArea.appendChild(answerElementDiv)
        answerElementDiv.appendChild(answerElementInput)
        answerElementDiv.appendChild(answerElementLabel)
    }
}

function checkAnswer() {
    let answers = document.querySelectorAll(".answers-collection")
    let selectedAnswers = []
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            selectedAnswers.push(i)
        }
    }
    if (selectedAnswers.length != finalQuestionsArray[index].correct.length) {
        alert(`Error! Please select the right number of answers (${finalQuestionsArray[index].correct.length}).`)
        return null
    }
    return selectedAnswers
}

function updatePoints(selectedAnswers) {
    let correctAnswers = [...finalQuestionsArray[index].correct]
    let fragment = scoreIncriment / correctAnswers.length
    let flagWrong = correctAnswers.length
    for (let i = 0; i < selectedAnswers.length; i++) {
        for (let j = 0; j < correctAnswers.length; j++) {
            if (correctAnswers[j] === selectedAnswers[i]) {
                score += fragment
                flagWrong--
            }
        }
    }
    if (flagWrong) {
        wrongAnswered.push(finalQuestionsArray[index])
    }
}


// timer
if (parameters.time !== "Unlimited") {
    var defaults = {},
        one_second = 1000,
        one_minute = one_second * 60,
        one_hour = one_minute * 60,
        startDate = new Date(),
        face = document.getElementById('lazy');
    let futureDate = new Date(startDate.getTime() + parameters.time.slice(0, -1) * 60 * 1000)
        // let futureDate = new Date(startDate.getTime() + 1 * 60 * 1000)

    var requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());
    tick();

    function tick() {

        var now = new Date(),
            elapsed = futureDate - now,
            parts = [];

        if (elapsed < 0) {
            showResults()
            return
        }
        parts[0] = '' + Math.floor(elapsed / one_hour);
        parts[1] = '' + Math.floor((elapsed % one_hour) / one_minute);
        parts[2] = '' + Math.floor(((elapsed % one_hour) % one_minute) / one_second);

        parts[0] = (parts[0].length == 1) ? '0' + parts[0] : parts[0];
        parts[1] = (parts[1].length == 1) ? '0' + parts[1] : parts[1];
        parts[2] = (parts[2].length == 1) ? '0' + parts[2] : parts[2];
        face.innerText = parts.join(':');
        requestAnimationFrame(tick);
    }
}
// day night toggler
let state = 'night'

function toggler() {
    if (state === 'day') {
        state = 'night'
        document.getElementById("modeicon").src = "./Icons/day.png"
        document.body.style.setProperty("background-color", "rgb(60, 64, 67)", "important")
        document.body.style.setProperty("color", "rgba(255, 255, 255, 0.7)", "important")
        document.getElementById("modeicon").style.filter = "invert(1)"
        document.body.style.transition = "0.5s"

    } else {
        state = 'day'
        document.getElementById("modeicon").src = "./Icons/dark.png"
        document.body.style.setProperty("background-color", "white", "important")
        document.body.style.setProperty("color", "black", "important")
        document.getElementById("modeicon").style.filter = "invert(0)"
        document.body.style.transition = "0.5s"

    }
}


// buttons eventlisteners
minusBtn.addEventListener('click', () => {
    let fontSize = parseFloat(questionDiv.style.fontSize)
    questionDiv.style.cssText = ''
    questionDiv.style.fontSize = `${fontSize-0.05}em`
})
plusBtn.addEventListener('click', () => {
    let fontSize = parseFloat(questionDiv.style.fontSize)
    questionDiv.style.cssText = ''
    questionDiv.style.fontSize = `${fontSize+0.05}em`
})

nextBtn.addEventListener('click', () => {
    let selectedAnswers = checkAnswer()
    if (selectedAnswers) {
        updatePoints(selectedAnswers)
        index++

        main()
    }
})


// shufftle logic
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

//show results
function showResults() {
    document.getElementById("blur-here").style.filter = "blur(10px)"
    document.getElementById("overlay-outer").style.display = "grid"

    let scoreElement = document.getElementById("score")
    let result = document.getElementById("result")
    let resultText = document.getElementById("result-text")
    scoreElement.innerText = Math.round(score)
    if (score >= 800) {
        result.innerText = 'Pass'
        result.style.color = "rgb(0,137,109)"
        resultText.innerText = `Congratulations!! You passed this CCNA Exam simulation. Hope you also pass the real exam, best of luck!!`
    } else {
        result.innerText = 'Fail'
        result.style.color = "rgb(201,86,58)"
        resultText.innerText = `Unfortunately you were unable to pass this CCNA Exam simulation, but dont give up!! Best of luck on your real exam!!`

    }
}


main()