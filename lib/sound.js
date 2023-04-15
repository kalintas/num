
import Sound from "react-native-sound";

Sound.setCategory("Playback");

const buttonPress = new Sound("button_press.wav", Sound.MAIN_BUNDLE);
const buttonRelease = new Sound("button_release.wav", Sound.MAIN_BUNDLE);

const win = new Sound("win.wav", Sound.MAIN_BUNDLE);
const lose = new Sound("lose.wav", Sound.MAIN_BUNDLE);
const timeout = new Sound("timeout.wav", Sound.MAIN_BUNDLE);
const turn = new Sound("turn.wav", Sound.MAIN_BUNDLE);


let isMuted = false;

function playSound(sound) {
    
    if (!isMuted) {
        sound.stop();
        sound.play();
    }
}

export function playButtonPress() {
    playSound(buttonPress);
}

export function playButtonRelease() {

    playSound(buttonRelease);
}

export function playWinSound() {

    playSound(win);
    
}
export function playLoseSound() {

    playSound(lose);
}

export function playTimeoutSound() {

    playSound(timeout);
}

export function stopTimeoutSound() {

    timeout.stop();
}


export function playTurnSound() {

    playSound(turn);
}

export function setMuted(muted) {

    isMuted = muted;
}

