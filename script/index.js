import "./utils/utilities.js"; // add general function like toRadian
import "./utils/init3D.js"; // create 3D world

const images = document.querySelectorAll(".images > *");
const autoDefil = document.querySelector(".auto");
let actualSlide = 0;
let autoSlideInterval;
let activeModal = "";

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
window.changeSlide = to => { // changes slide
    images[actualSlide].className = "hidden";
    actualSlide += to;
    if (actualSlide < 0) { actualSlide = images.length-1 }
    else if (actualSlide >= images.length) { actualSlide = 0 }
    // now we know which image should be displayed
    images[actualSlide].className = "active";
}

window.play = () => { // start auto changing slide
    autoSlideInterval = setInterval(() => {
        changeSlide(1);
    }, 2000);
    autoDefil.className = "auto play";
}
window.pause = () => { // stop auto changing slide
    clearInterval(autoSlideInterval);
    autoDefil.className = "auto pause";
}
