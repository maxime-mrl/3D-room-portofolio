import "./utils/utilities.js"; // add general function like toRadian
import "./utils/init3D.js"; // create 3D world

const burger = document.querySelector(".menu-nav > ul")
let activeModal = "";

const images = document.querySelectorAll(".caroussel-content > *");
const autoDefil = document.querySelector(".caroussel .auto");
let progress = document.querySelector(".caroussel .progress")
let actualSlide = 0;
let autoSlideInterval;
initCaroussel()

/* -------------------------------------------------------------------------- */
/*                                 BURGER MENU                                */
/* -------------------------------------------------------------------------- */
window.toggleBurger = () => {
    burger.classList.toggle("active")
}

/* -------------------------------------------------------------------------- */
/*                        DOM INTERACTION FROM 3D SCENE                       */
/* -------------------------------------------------------------------------- */
window.openModal = targetId => { // open modal like caroussel
    console.log("open")
    if (activeModal) closeModal();
    activeModal = document.getElementById(targetId);
    activeModal.className = "modal-active";
    cancelAnimationFrame(world.frameRequest); // stop updating render to save perf
    setTimeout(() => { // don't really know why, but the click that open modal is registered by this eventlistener if no timeout
        activeModal.addEventListener("click", modalClick);
    }, 100);
}

const closeModal = () => { // close any modal opened
    if (activeModal == "") return;
    document.removeEventListener("click", modalClick);
    activeModal.className = "modal-hidden";
    activeModal = "";
    world.update();
}

function modalClick(e) { // listener function for click -- check if click is not inside modal close it
    // need to check if user has clicked somewhere on modal (meaning child count too) and if not close modal
    if (window.activeModal == "") return;
    if (activeModal != e.target) return;
    closeModal();
}

/* -------------------------------------------------------------------------- */
/*                                  CAROUSSEL                                 */
/* -------------------------------------------------------------------------- */
window.changeSlide = (to) => {
    images[actualSlide].className = "hidden-slide"; // hide last image
    images[actualSlide].querySelector("video").pause();
    actualSlide += to; // define slide to display for access latter images array
    if (actualSlide < 0) actualSlide = images.length-1;
    else if (actualSlide >= images.length) actualSlide = 0;
    images[actualSlide].className = "active"; // display wanted image
    images[actualSlide].querySelector("video").play();
    // update dot progress
    progress.forEach(dot => {
        dot.className = "dot"
    })
    progress[actualSlide].className = "dot active"
}

window.goToSlide = (to) => {
    if (to >= images.length || to < 0) return;
    pause()
    images[actualSlide].className = "hidden-slide"; // hide last image
    images[actualSlide].querySelector("video").pause();
    actualSlide = to;
    changeSlide(0)
}

function play() {
    autoSlideInterval = setInterval(() => {
        if (document.querySelector(".caroussel .text:hover")) return;
        changeSlide(1)
    }, 6000);
    autoDefil.setAttribute("data-state", "play") // change datastae of play/pause container to update CSS
}
window.play = play;

window.pause = () => {
    clearInterval(autoSlideInterval);
    autoDefil.setAttribute("data-state", "pause") // change datastae of play/pause container to update CSS
}

function initCaroussel() {
    if (autoDefil.getAttribute("data-state") == "play") play();
    images.forEach((e, i) => {
        const dot = document.createElement("div")
        dot.className = "dot"
        progress.appendChild(dot)
        dot.addEventListener("click", () => goToSlide(i))
    })
    progress = progress.querySelectorAll("*")
    progress[0].className = "dot active"
}

