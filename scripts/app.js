"use strict";
window.addEventListener("urlchange", function () {
    document.querySelectorAll(".nav-links li a").forEach(element => {
        if (element.getAttribute("path") === window.location.pathname) {
            element.classList.add("active");
        }
        else {
            element.classList.remove("active");
        }
    });
});
