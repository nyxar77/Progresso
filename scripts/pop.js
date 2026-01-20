"use strict";
const modal = document.querySelector("#modal");
const openBtn = document.querySelector("#openModal");
const closeBtn = modal?.querySelector(".close");
const uploadBtn = document.querySelector("#uploadBtn");
const fileInput = document.querySelector("#fileInput");
const statusDiv = document.querySelector("#uploadStatus");
const quizTitle = document.querySelector("#quizTitle");
const quizDescription = document.querySelector("#quizDescription");
openBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
});
closeBtn?.addEventListener("click", function () {
    modal.style.display = "none";
    statusDiv.textContent = "";
});
window.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
        statusDiv.textContent = "";
    }
});
if (uploadBtn && fileInput && statusDiv && quizTitle && quizDescription) {
    uploadBtn.addEventListener("click", function () {
        if (fileInput === null)
            return;
        const file = fileInput.files?.[0];
        if (!file) {
            statusDiv.style.color = "var(--incorrect)";
            statusDiv.textContent = "No file selected!";
            return;
        }
        if (file.type !== "application/json") {
            statusDiv.style.color = "var(--incorrect)";
            statusDiv.textContent = "Incorrect filetype! Not a JSON file";
            return;
        }
        if (!quizTitle.value || !quizDescription.value) {
            statusDiv.textContent = "Don't leave Title and Description empty";
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileContent = e.target?.result;
            /* const formData = new FormData();
          formData.append("file", file); */
            try {
                let quizzes = JSON.parse(localStorage.getItem("quizzes") || "[]");
                const newQuiz = {
                    quizId: Date.now().toString(),
                    quizTitle: quizTitle.value,
                    quizDescription: quizDescription.value,
                    fileName: file.name,
                    fileContent: fileContent,
                    dateUploaded: new Date().toISOString(),
                };
                quizzes.push(newQuiz);
                localStorage.setItem("quizzes", JSON.stringify(quizzes));
                statusDiv.style.color = "var(--text)";
                statusDiv.textContent = "Quiz uploaded successfully!";
                fileInput.value = "";
                quizTitle.value = "";
                quizDescription.value = "";
            }
            catch (err) {
                console.error("Error parsing JSON:", err);
                statusDiv.style.color = "var(--incorrect)";
                statusDiv.textContent = "Invalid JSON file content!";
            }
        };
        reader.readAsText(file);
    });
}
