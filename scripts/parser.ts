/* (async function() {
  try {
    const response = await fetch('http://localhost/mockData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
})(); */

import { Router } from "../routing/router.js";
interface QuizOption {
  label: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

type Quiz = QuizQuestion[];

(async () => {
  document
    .getElementById("quizFile1")
    ?.append(await Router.loadTemplates("pop"));
})();

export function init(position: number) {
  document
    .querySelector<HTMLInputElement>(".startQuiz")
    ?.addEventListener("click", async function () {
      /* if (!(this instanceof HTMLInputElement)) {
        return;
      } */
      console.log(this);

      /* let file = this.files?.[0];
      if (file === undefined) throw Error("no file was seleted!"); */
      let file = JSON.parse(localStorage.getItem("quizzes") || "[]");
      // let result = await readQuizFile(file.fileContent);
      let data: Quiz;
      try {
        console.log(file[position].fileContent);
        data = JSON.parse(file[position].fileContent);
        mkQuiz(data);
      } catch (error) {
        let container = document.querySelector<HTMLDivElement>("#container");
        container!.style.color = "var(--incorrect)";
        container!.innerText =
          "the file either is not of type 'json' or isn't in the correct format";
        console.warn(error);
      }
    });

  function readQuizFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        try {
          if (this.result !== null) {
            resolve(this.result as string);
            // let data = JSON.parse(this.result)
          } else {
            reject(new Error("file is empty"));
          }
        } catch (error) {
          reject(new Error("parsing failed"));
        }
      };
    });
  }

  function mkQuiz(content: Quiz) {
    let container = document.querySelector<HTMLDivElement>("#container");
    if (!container) {
      container = document.createElement("div");
      container.id = "container";
      document.body.append(container);
    }

    container.innerHTML = "";

    content.forEach((element, index) => {
      let quizContainer = document.createElement("div");
      quizContainer.classList.add("quiz-container");
      quizContainer.addEventListener("click", function () {
        const allContainers =
          document.querySelectorAll<HTMLDivElement>(".quiz-container");
        allContainers.forEach((c) => c.classList.remove("active"));
        this.classList.add("active");
      });

      //NOTE: Questions
      let quizQuestion = document.createElement("div");
      quizQuestion.classList.add("quiz-question");
      quizQuestion.innerText = element.question;

      //NOTE : options
      let quizOptions = document.createElement("div");
      quizOptions.classList.add("quiz-options");
      element.options.forEach((option) => {
        let quizOption: HTMLDivElement = document.createElement("div");
        quizOption.classList.add("quiz-option");
        quizOption.setAttribute("selected", "false");
        quizOption.innerText = option.label;
        quizOption.onclick = function () {
          let element = this as HTMLDivElement;
          switch (element.getAttribute("selected")) {
            case "false":
              element.setAttribute("selected", "true");
              break;
            case "true":
              element.setAttribute("selected", "false");
              break;
            default:
              element.setAttribute("selected", "false");
              break;
          }
        };
        quizOptions.append(quizOption);
      });

      let quizFeedback = document.createElement("div");
      quizFeedback.classList.add("quiz-feedback");
      quizFeedback.innerText = "yoo this is a feedback" + index;

      quizContainer.append(quizQuestion, quizOptions, quizFeedback);

      container.append(quizContainer);
    });

    //TODO: add input quiz

    let quizInput: HTMLInputElement = document.createElement("input");
    quizInput.classList.add("quiz-input");

    let quizSubmit = document.createElement("button");
    quizSubmit.id = "quiz-submit";
    quizSubmit.innerText = "submit";
    quizSubmit.addEventListener("click", function () {
      validateQuiz();
      console.log("yo dumb gang lol");
    });
    const quizFile = document.getElementById("quizFile");
    if (quizFile && quizFile.parentElement) {
      quizFile.parentElement.remove();
    }
    container.append(quizSubmit);
  }

  function validateQuiz() {
    const allContainers =
      document.querySelectorAll<HTMLDivElement>(".quiz-container");
    allContainers.forEach((c) => c.classList.remove("active"));
  }

  function unloadQuiz() {
    document.querySelector<HTMLDivElement>("container")!.innerHTML = "";
  }
}

loadQuizCards();
function loadQuizCards() {
  const quizCards = document.querySelector<HTMLDivElement>(".quiz-cards");
  const quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");

  interface quizFormat {
    quizId: string;
    quizTitle: string;
    quizDescription: string;
    fileName: string;
    fileContent: Object | string;
    dateUploaded: string;
  }

  quizzes.forEach((element: quizFormat, index: number) => {
    const quizCardGrid = document.createElement("div");
    quizCardGrid.setAttribute("data-id", element.quizId);
    quizCardGrid.classList.add("quiz-card-grid");

    const quizCard = document.createElement("div");
    quizCard.classList.add("quiz-card");

    const quizCardTitle = document.createElement("div");
    quizCardTitle.classList.add("quiz-card-title");
    quizCardTitle.textContent = element.quizTitle;

    const quizCardDesc = document.createElement("p");
    quizCardDesc.classList.add("quiz-card-desc");
    quizCardDesc.textContent = element.quizDescription;

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("icon");
    closeBtn.classList.add("danger");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent = "✕";
    closeBtn.onclick = function () {
      let elem = this as HTMLButtonElement;
      let parent = elem.parentElement?.parentElement;
      if (parent) parent.remove();

      let data = JSON.parse(localStorage.getItem("quizzes") || "[]");
      data = data.filter(
        (item: quizFormat) =>
          item.quizId !== quizCardGrid.getAttribute("data-id"),
      );
      localStorage.setItem("quizzes", JSON.stringify(data));
      console.log("matched");
    };

    const quizCardActions = document.createElement("div");
    quizCardActions.classList.add("quiz-card-actions");

    const startBtn = document.createElement("button");
    startBtn.classList.add("icon");
    startBtn.classList.add("startQuiz");
    startBtn.textContent = "▶ Start";
    startBtn.onclick = function () {
      init(index);
    };
    const statsBtn = document.createElement("button");
    statsBtn.classList.add("icon");
    statsBtn.classList.add("primary");
    statsBtn.textContent = "📊 Stats";

    quizCardActions.append(startBtn, statsBtn);
    quizCard.append(closeBtn, quizCardTitle, quizCardDesc, quizCardActions);
    quizCardGrid.append(quizCard);
    console.log(quizCards);
    quizCards?.append(quizCardGrid);
  });
}
