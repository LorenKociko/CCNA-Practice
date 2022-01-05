const det = document.getElementById("det")
let details = navigator.userAgent;
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(details);
if (!isMobileDevice) {
    det.open = 'true'
}

const questionDiv = document.getElementById("questiondiv")
questionDiv.style.fontSize = '1.00em'
const questionArea = document.getElementById("question")
const answersArea = document.getElementById("answers")
const previousBtn = document.getElementById("previousBtn")
const checkBtn = document.getElementById("checkBtn")
const nextBtn = document.getElementById("nextBtn")
const subboxes = document.getElementsByClassName('subbox')
const numberOfQuestions = document.getElementById("numq")
const plusBtn = document.getElementById("plusBtn")
const minusBtn = document.getElementById("minusBtn")
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
document.addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
        checkBtn.click()
    } else if (e.keyCode === 37) {
        previousBtn.click()
    } else if (e.keyCode === 39) {
        nextBtn.click()
    }
})

let selectedModules = []
let selectedQuestions = []
let shuffledQuestions = shuffleArray(selectedQuestions)
let index = 0

for (let i = 0; i < subboxes.length; i++) {
    subboxes[i].addEventListener('change', () => {
        let mooduleId = subboxes[i].children[0].id
        let indx = selectedModules.indexOf(mooduleId)
        if (selectedModules.includes(mooduleId)) {
            selectedModules.splice(indx, 1)
        } else {
            selectedModules.push(mooduleId)
        }
        updateQuestions()
        update()

    })
}

function updateQuestions() {
    selectedQuestions = []
    for (let i = 0; i < selectedModules.length; i++) {
        selectedQuestions.push(...eval(selectedModules[i]))
    }
}

function update() {
    index = 0
    shuffledQuestions = shuffleArray(selectedQuestions)
    main()
}

function main() {
    document.activeElement.blur();
    answersArea.innerHTML = ''
    answersArea.setAttribute('class', '')
    let currentQuestion = {}
    if (shuffledQuestions.length > 0) {
        currentQuestion = shuffledQuestions[index]
        buttonsControl(2)
    } else {
        currentQuestion = {
            question: "Please select a module you want to study"
        }
        index = -1
        buttonsControl(1)
    }
    numberOfQuestions.innerText = `${index+1}/${shuffledQuestions.length}`
    questionArea.innerHTML = currentQuestion.question
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}
checkBtn.addEventListener('click', () => {
    answersArea.setAttribute('class', 'checked')
})
nextBtn.addEventListener('click', () => {
    index++
    buttonsControl()
    main()
})
previousBtn.addEventListener('click', () => {
    index--
    buttonsControl()
    main()
})

function buttonsControl(flag = 0) {
    if (flag == 1) {
        previousBtn.disabled = true
        checkBtn.disabled = true
        nextBtn.disabled = true
    } else if (flag == 2) {
        previousBtn.disabled = false
        checkBtn.disabled = false
        nextBtn.disabled = false
    }
    if (index <= 0) {
        previousBtn.disabled = true
    } else {
        previousBtn.disabled = false
    }
    if (index >= shuffledQuestions.length - 1) {
        nextBtn.disabled = true
    } else {
        nextBtn.disabled = false
    }

}