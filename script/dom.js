const formElems = document.querySelectorAll("#contact-form input, #contact-form textarea");
const slides = document.querySelectorAll(".caroussel-content > *");
const autoDefil = document.querySelector(".caroussel .auto");
let progress = document.querySelector(".caroussel .progress");

export class Form {
    constructor() {
        this.inputs = [];
        this.mailRule = /^[a-z][-._a-z0-9]*@[a-z0-9][-.a-z0-9]+\.[a-z]{2,}$/i; // mail must: start with letter after wich can be every letter number and -._ then @ and then domain with about same rule as mail name start with letter or number; no underscore then must avec . followed by extension (only letter with 2 or more character)
        this.basicRules = /^.{1,60}$/; // firstName, lastName, adress and city can more or less be anything depending on the country
        this.messageRule = /^.{10,500}$/; // message can also be anything only rule is preventing too short or long messages

        formElems.forEach(elem => { // go through All form input
            elem["originalPlaceholder"] = elem.getAttribute("placeholder"); // keep original placeholder to put it back if success
            const err = elem.getAttribute("data-err"); // get and store errore message
            let regex = this.basicRules; // regex wanted for specific input
            switch (elem.name) { // if input is recognized change the regex to one specific for the input
                case "e-mail":
                    regex = this.mailRule;
                    break;
                case "message":
                    regex = this.messageRule;
                    break;
            }
            this.inputs.push({ // add element, rules and error messages to inputs array used for checking all input when submiting
                elem,
                regex,
                err
            });
            elem.addEventListener("blur", () => this.check(regex, elem, err)) // listen for focus change on input and check if correct
        })
    }

    submitForm = () => { // check if all form is good before "submiting"
        let error = false;
        this.inputs.forEach(input => { // check all input
            if (!this.check(input.regex, input.elem, input.err)) error = true;
        })
        if (error) { // if one or more error alert it
            displayPopup("fail", ":/ At least one wrong entry");
            return;
        }
        displayPopup("sucess", "Success !");
    }

    check = (regEx, input, errorTxt) => { // check if one input is valid
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
}

export class Caroussel {
    constructor() {
        this.slides = slides; // to be abble to acces from index.js
        slides.forEach((e, i) => { // add dot depending on slide number
            const dot = document.createElement("div");
            dot.className = "dot";
            progress.appendChild(dot);
            dot.addEventListener("click", () => this.goToSlide(i));
        })
        progress = progress.querySelectorAll("*");
        progress[0].className = "dot active";

        this.actualSlide = 0;
        this.autoSlideInterval = false;
    }

    changeSlide = (to) => {
        slides[this.actualSlide].className = "hidden-slide"; // hide last slide
        slides[this.actualSlide].querySelector("video").pause(); // pause old video for perfs
        this.actualSlide += to; // define slide to display for access latter slides array
        if (this.actualSlide < 0) this.actualSlide = slides.length-1;
        else if (this.actualSlide >= slides.length) this.actualSlide = 0;
        slides[this.actualSlide].className = "active"; // display wanted slide
        slides[this.actualSlide].querySelector("video").play();
        // update dot progress
        progress.forEach(dot => dot.className = "dot");
        progress[this.actualSlide].className = "dot active";
    }

    goToSlide = (to) => {
        if (to >= slides.length || to < 0) return;
        this.pause()
        slides[this.actualSlide].className = "hidden-slide"; // hide last image
        slides[this.actualSlide].querySelector("video").pause();
        this.actualSlide = to;
        this.changeSlide(0)
    }
    
    play = () => {
        if (this.autoSlideInterval) return pause();
        this.autoSlideInterval = setInterval(() => {
            if (document.querySelector(".caroussel .text:hover")) return;
            this.changeSlide(1)
        }, 6000);
        autoDefil.setAttribute("data-state", "play"); // change datastate of play/pause container to update CSS
    }

    pause = () => {
        if (!this.autoSlideInterval) return;
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = false;
        autoDefil.setAttribute("data-state", "pause"); // change datastate of play/pause container to update CSS
    }
}