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

interface QuizOption {
  label: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

type Quiz = QuizQuestion[];

export function init() {
  document
    .getElementById("quizFile")
    ?.addEventListener("change", async function () {
      if (!(this instanceof HTMLInputElement)) {
        return;
      }
      let file = this.files?.[0];
      if (file === undefined) throw Error("no file was seleted!");
      let result = await readQuizFile(file);
      let data: Quiz;
      try {
        data = JSON.parse(result);
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

      quizContainer.append(
        quizQuestion,
        quizQuestion,
        quizOptions,
        quizFeedback,
      );

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
