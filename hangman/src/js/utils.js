export function randomQuesion(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function chooseQuestion(questions) {
  let random = randomQuesion(0, questions.length);
  const quizItem = questions[random];
  const question = quizItem.question;
  localStorage.setItem("question", `${question}`);
  const answer = quizItem.answer;
  console.log(answer);
  return [answer, question];
}

export function checkGame(incorrectCounter, answer, cb) {
  const underscoreElems = document.querySelectorAll(".underscore.right");

  if (incorrectCounter === 6 || underscoreElems.length === answer.length) {
    setTimeout(() => {
      cb();
    }, 700);
  }
}

export function playAgain(cb) {
  const button = document.querySelector(".button");
  button.onclick = () => {
    cb();
  };
}
