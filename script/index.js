import "./utils/utilities.js"; // add general function like toRadian
import init3D from "./utils/init3D.js"; // create 3D world
import { Caroussel, Form } from "./dom.js";

window.colors = {
    day: {
        environment: {
            light: [0xFCE8B0, 1],
            sun: [0xFDEEC4, 2],
            fog: 0xe8e7e1
        },
        css: {
            green: "176, 215, 181",
            beige: "223, 219, 212",
            text: "30, 30, 30",
        }
    },
    night: {
        environment: {
            light: [0x6D72C3, 0.2],
            sun: [0x94C5CC, 0.1],
            fog: 0x5b6378
        },
        css: {
            green: "36, 76, 64",
            beige: "73, 71, 97",
            text: "239, 241, 237",
        }
    },
};

let activeModal = ""; // oppened modal

window.caroussel = new Caroussel();
window.contactForm = new Form();
init3D()

/* -------------------------------------------------------------------------- */
/*                        DOM INTERACTION FROM 3D SCENE                       */
/* -------------------------------------------------------------------------- */
window.openModal = targetId => { // open modal like caroussel
    document.body.style.cursor = "initial";
    if (activeModal) closeModal();
    activeModal = document.getElementById(targetId);
    activeModal.className = "modal-active";
    cancelAnimationFrame(world.frameRequest); // stop updating render to save perf
    activeModal.addEventListener("click", modalClick);
    if (targetId == "projects") caroussel.slides[caroussel.actualSlide].querySelector("video").play(); // play video which should be paused
}

window.closeModal = () => { // close any modal opened
    if (activeModal == "") return;
    document.removeEventListener("click", modalClick);
    activeModal.className = "modal-hidden";
    activeModal = "";
    world.update();
    
    caroussel.slides[caroussel.actualSlide].querySelector("video").pause(); // pause video to save perfs
    caroussel.pause(); // pause caroussel defil to save perf
}

function modalClick(e) { // listener function for click -- check if click is not inside modal content close it
    if (window.activeModal == "") return; // if no modal oppened
    if (activeModal != e.target && e.target.parentNode.className != "close-modal") return; // if click outside of content or in the close btn continue -- close btn has an element inside so the click register on it -> go back to parent
    closeModal();
}
