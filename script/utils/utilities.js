const popup = document.querySelector(".popup");

window.toRadian = (angle) => { // convert degree to radian
    return angle * Math.PI/180;
}

window.playAudio = (target) => {
    target.audio.play();
    return new Audio(target.src);
}

window.setColors = (to) => {
    if (!colors[to]) return;
    
    document.documentElement.style.setProperty('--green', colors[to].css.green);
    document.documentElement.style.setProperty('--beige', colors[to].css.beige);
    document.documentElement.style.setProperty('--text', colors[to].css.text);
}


window.displayPopup = (customClass, message) => {
    popup.innerHTML = message;
    popup.className = "popup active " + customClass;
    setTimeout(() => popup.className = "popup", 1500);
}
