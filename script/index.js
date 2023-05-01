import "./utils/utilities.js"; // add general function like toRadian
import "./utils/init3D.js"; // create 3D world


const formElems = document.querySelectorAll("#contact-form input, #contact-form textarea");
const images = document.querySelectorAll(".caroussel-content > *");
const autoDefil = document.querySelector(".caroussel .auto");
let progress = document.querySelector(".caroussel .progress");
const popup = document.querySelector(".popup")

let activeModal = "";
const inputs = []

const mailRule = /^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i; // mail must: start with letter after wich can be every letter number and -._ then @ and then domain with about same rule as mail name start with letter or number; no underscore then must avec . followed by extension (only letter with 2 or more character)
const basicRules = /^.{1,60}$/i // firstName, lastName, adress and city can more or less be anything depending on the country
const messageRule = /^.{10,500}$/ // message can also be anything only rule is preventing too short or long messages

let actualSlide = 0;
let autoSlideInterval;
initCaroussel()

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
}

window.closeModal = () => { // close any modal opened
    if (activeModal == "") return;
    document.removeEventListener("click", modalClick);
    activeModal.className = "modal-hidden";
    activeModal = "";
    world.update();
}

function modalClick(e) { // listener function for click -- check if click is not inside modal content close it
    if (window.activeModal == "") return; // if no modal oppened
    if (activeModal != e.target && e.target.parentNode.className != "close-modal") return; // if click outside of content or in the close btn continue -- close btn has an element inside so the click register on it -> go back to parent
    closeModal();
}

function displayPopup(customClass, message) {
    popup.innerHTML = message;
    popup.className = "popup active " + customClass;
    setTimeout(() => popup.className = "popup", 1500);
}

/* -------------------------------------------------------------------------- */
/*                                   CONTACT                                  */
/* -------------------------------------------------------------------------- */
formElems.forEach(elem => { // go through All form input
    elem["originalPlaceholder"] = elem.getAttribute("placeholder"); // keep original placeholder to put it back if success
    let err = elem.getAttribute("data-err"); // get and store errore message
    let regex = basicRules; // regex wanted for specific input
    switch (elem.name) { // if input is recognized change the regex to one specific for the input
        case "e-mail":
            regex = mailRule;
            break;
        case "message":
            regex = messageRule;
            break;
    }
    inputs.push({ // add element, rules and error messages to inputs array used for checking all input when submiting
        elem,
        regex,
        err
    });
    elem.addEventListener("blur", () => check(regex, elem, err)) // listen for focus change on input and check if correct
})

window.submitForm = () => { // check if all form is good before "submiting"
    let error = false;
    inputs.forEach(input => { // check all input
        if (!check(input.regex, input.elem, input.err)) error = true;
    })
    if (error) { // if one or more error alert it
        displayPopup("fail", ":/ At least one wrong entry");
        return;
    }
    displayPopup("sucess", "Success !");
}

function check(regEx, input, errorTxt) { // check if one input is valid
    if (regEx.test(input.value)) { // test regex
        // regex success => apply success style + placeholder
        input.className = "sucess";
        input.setAttribute("placeHolder", input.originalPlaceholder);
        return true;
    }
    // regex success => apply error style + placeholder and reset input value
    input.className = "fail";
    input.value = "";
    input.setAttribute("placeHolder", errorTxt);
    return false;
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
    progress.forEach(dot => dot.className = "dot");
    progress[actualSlide].className = "dot active";
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
    autoDefil.setAttribute("data-state", "play"); // change datastae of play/pause container to update CSS
}
window.play = play;

window.pause = () => {
    clearInterval(autoSlideInterval);
    autoDefil.setAttribute("data-state", "pause"); // change datastae of play/pause container to update CSS
}

function initCaroussel() {
    if (autoDefil.getAttribute("data-state") == "play") play();
    images.forEach((e, i) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        progress.appendChild(dot);
        dot.addEventListener("click", () => goToSlide(i));
    })
    progress = progress.querySelectorAll("*");
    progress[0].className = "dot active";
}
