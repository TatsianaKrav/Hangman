import { questions } from "./questions-list.js";
import { alphabet } from "./constants.js";
import { enKeyboard } from "./constants.js";
import { checkGame, playAgain, chooseQuestion } from "./utils.js";

const bodyElem = document.body;
let { question, answer } = {};
let incorrectCounter = 0;
let manBodyParts = [];
let modal = {};

const containerElem = document.createElement("div");
containerElem.classList.add("container");
bodyElem.appendChild(containerElem);

function showGallow() {
  const gallowElem = document.createElement("div");
  gallowElem.classList.add("gallow");
  containerElem.appendChild(gallowElem);

  const imageElem = document.createElement("img");
  imageElem.classList.add("gallow-img");
  imageElem.setAttribute("src", "assets/hangman.png");
  imageElem.setAttribute("alt", "gallow");

  gallowElem.appendChild(imageElem);

  const manElem = document.createElement("div");
  manElem.classList.add("hangman");

  const headElem = document.createElement("div");
  headElem.classList.add("head");
  headElem.classList.add("man");

  const bodyManElem = document.createElement("div");
  bodyManElem.classList.add("body");
  bodyManElem.classList.add("man");

  const leftArmElem = document.createElement("div");
  leftArmElem.classList.add("left-arm");
  leftArmElem.classList.add("man");

  const rightArmElem = document.createElement("div");
  rightArmElem.classList.add("right-arm");
  rightArmElem.classList.add("man");

  const leftLegElem = document.createElement("div");
  leftLegElem.classList.add("left-leg");
  leftLegElem.classList.add("man");

  const rightLegElem = document.createElement("div");
  rightLegElem.classList.add("right-leg");
  rightLegElem.classList.add("man");

  manElem.appendChild(headElem);
  manElem.appendChild(bodyManElem);
  manElem.appendChild(leftArmElem);
  manElem.appendChild(rightArmElem);
  manElem.appendChild(leftLegElem);
  manElem.appendChild(rightLegElem);

  gallowElem.appendChild(manElem);

  manBodyParts = Array.from(document.getElementsByClassName("man"));
}

function showQuiz() {
  const prevQuestion = localStorage.getItem("question");
  [answer, question] = chooseQuestion(questions);

  if (prevQuestion && prevQuestion === question) {
    console.log(1);
    chooseQuestion(questions);
    [answer, question] = chooseQuestion(questions);
  }

  const quizElem = document.createElement("div");
  quizElem.classList.add("quiz");

  const secretWordElem = document.createElement("div");
  secretWordElem.classList.add("secret-word");

  for (let i = 0; i < answer.length; i++) {
    const underscoreElem = document.createElement("div");
    underscoreElem.classList.add("underscore");
    secretWordElem.appendChild(underscoreElem);
  }

  const questionElem = document.createElement("div");
  questionElem.classList.add("question");

  const questionTaskElem = document.createElement("p");
  questionTaskElem.innerText = `Вопрос: ${question}`;

  questionElem.appendChild(questionTaskElem);

  const incorrectScoreElem = document.createElement("div");
  incorrectScoreElem.classList.add("incorrect-score");
  incorrectScoreElem.innerHTML = `<span>Неверные попытки: &nbsp;</span> 
  <div class="incorrect"> <span class="incorrect-counter">${incorrectCounter}</span> / 6</div>`;

  const keyboardElem = document.createElement("div");
  keyboardElem.classList.add("keyboard");

  for (let i = 0; i < alphabet.length; i++) {
    const letterElem = document.createElement("button");
    letterElem.classList.add("letter");
    letterElem.innerText = alphabet[i];

    letterElem.addEventListener("click", (e) => {
      const chosenLetter = e.target.innerText.toLowerCase();

      if (e.target.classList.contains("guessed")) {
        e.target.preventDefault();
      }

      if (answer.includes(chosenLetter)) {
        const answArr = answer.split("");
        answArr.forEach((item, index) => {
          if (item === chosenLetter) {
            const upperElems = document.getElementsByClassName("underscore");
            upperElems[index].innerText = chosenLetter.toUpperCase();
            upperElems[index].classList.add("right");
          }
        });
      } else {
        manBodyParts[incorrectCounter].style.display = "block";
        incorrectCounter++;
        const incorrectCounterElem =
          document.querySelector(".incorrect-counter");
        incorrectCounterElem.innerText = incorrectCounter;
      }

      e.target.classList.add("guessed");
      e.target.setAttribute("disabled", true);

      checkGame(incorrectCounter, answer, showPopup);
    });

    keyboardElem.appendChild(letterElem);
  }
  containerElem.appendChild(secretWordElem);
  containerElem.appendChild(questionElem);
  containerElem.appendChild(incorrectScoreElem);
  containerElem.appendChild(keyboardElem);
}

function keyboardInput() {
  document.addEventListener("keydown", function (e) {
    {
      const modal = document.querySelector(".modal-window");
      if (modal) return false;

      const chosenLetter = e.key.toLowerCase();

      const charOnRightLang = alphabet.find(
        (char) => char.toLocaleLowerCase() === chosenLetter
      );
      const charOnIncorrLang = enKeyboard.find(
        (char) => char.toLowerCase() === chosenLetter
      );

      if (!charOnRightLang && charOnIncorrLang) {
        alert("Поменяйте язковую раскладку");
        return false;
      }

      if (!charOnRightLang && !charOnIncorrLang) {
        return false;
      }

      const letters = document.querySelectorAll(".letter");
      const result = Array.from(letters).find(
        (item) =>
          item.innerText.toLowerCase() === chosenLetter &&
          item.classList.contains("guessed")
      );

      if (result) return false;

      if (answer.includes(chosenLetter)) {
        const answArr = answer.split("");
        answArr.forEach((item, index) => {
          if (item === chosenLetter) {
            const upperElems = document.getElementsByClassName("underscore");
            upperElems[index].innerText = chosenLetter.toUpperCase();
            upperElems[index].classList.add("right");
          }
        });
      } else {
        manBodyParts[incorrectCounter].style.display = "block";
        incorrectCounter++;
        const incorrectCounterElem =
          document.querySelector(".incorrect-counter");
        incorrectCounterElem.innerText = incorrectCounter;
      }

      letters.forEach((item) => {
        if (item.innerText.toLowerCase() === chosenLetter) {
          item.classList.add("guessed");
          item.setAttribute("disabled", true);
        }
      });

      checkGame(incorrectCounter, answer, showPopup);
    }
  });
}

function showPopup() {
  const modalElem = document.createElement("div");
  modalElem.classList.add("modal");

  const modalWindowElem = document.createElement("div");
  modalWindowElem.classList.add("modal-window");

  const messageElem = document.createElement("div");
  messageElem.classList.add("message");
  if (incorrectCounter === 6) {
    messageElem.innerText = "Вы проиграли";
    messageElem.classList.add("fail");
  } else {
    messageElem.innerText = "Вы победили!";
    messageElem.classList.add("win");
  }

  const resultElem = document.createElement("div");
  resultElem.classList.add("result");
  resultElem.innerHTML = `Правильный ответ: <span>${answer}</span>`;

  const buttonElem = document.createElement("button");
  buttonElem.classList.add("button");
  buttonElem.innerText = "Начать заново";

  modalWindowElem.appendChild(messageElem);
  modalWindowElem.appendChild(resultElem);
  modalWindowElem.appendChild(buttonElem);

  modalElem.appendChild(modalWindowElem);
  containerElem.appendChild(modalElem);

  modal = document.querySelector(".modal");
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  bodyElem.style.overflowY = "hidden";

  playAgain(newGame);
}

function newGame() {
  bodyElem.style.overflowY = "auto";
  modal.style.visibility = "visible";
  modal.style.opacity = "0";

  incorrectCounter = 0;
  manBodyParts.forEach((item) => {
    item.style.display = "none";
  });
  containerElem.innerHTML = "";
  showGallow();
  showQuiz();
}

showGallow();
showQuiz();
keyboardInput();
