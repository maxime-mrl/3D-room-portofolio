import "./utils/utilities.js"; // add general function like toRadian
import init3D from "./utils/init3D.js";
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
            white: "232, 231, 225",
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
            white: "91, 99, 120",
        }
    },
};

let activeModal = ""; // oppened modal

window.caroussel = new Caroussel();
window.contactForm = new Form();

/* -------------------------------------------------------------------------- */
/*                        DOM INTERACTION FROM 3D SCENE                       */
/* -------------------------------------------------------------------------- */
window.openModal = targetId => { // open modal
    if (activeModal) closeModal();
    document.body.style.cursor = "initial";
    activeModal = document.getElementById(targetId);
    activeModal.className = "modal modal-active";
    cancelAnimationFrame(world.frameRequest); // stop updating render to save perf
    activeModal.addEventListener("click", modalClick);
    if (targetId == "projects") caroussel.oppen() // play video caroussel video
}

window.closeModal = () => { // close modal opened
    if (activeModal == "") return;
    document.removeEventListener("click", modalClick);
    activeModal.className = "modal";
    activeModal = "";
    world.update();
    caroussel.close()
}

function modalClick(e) { // listener function for click -- check if click is not inside modal content close it
    if (window.activeModal == "") return; // if no modal oppened
    if (activeModal != e.target && e.target.parentNode.className != "close-modal") return; // if click outside of content or in the close btn continue -- close btn has an element inside so the click register on it -> go back to parent
    closeModal();
}
init3D() // create 3D world
