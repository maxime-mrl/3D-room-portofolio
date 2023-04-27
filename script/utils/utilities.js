window.toRadian = (angle) => { // convert degree to radian
    return angle * Math.PI/180;
}

window.playAudio = (target) => {
    target.audio.play();
    return new Audio(target.src);
}
