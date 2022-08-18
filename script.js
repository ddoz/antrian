let intro = new Audio("audio/intro.mp3");
let nomorAntrian = new Audio("audio/nomor_antrian.mp3");

var numberList = [
    "audio/kosong.mp3",
    "audio/1.mp3",
    "audio/2.mp3",
    "audio/3.mp3",
    "audio/4.mp3",
    "audio/5.mp3",
    "audio/6.mp3",
    "audio/7.mp3",
    "audio/8.mp3",
    "audio/9.mp3"
]

const btnPlay = document.getElementById("btn-play");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnReset = document.getElementById("btn-reset");

const textNumber = document.getElementById("number");
const textLastNumber = document.getElementById("last-number");
var defaultNumber = 1;

const playSound = async () => {
    await intro.play();
    intro.onended = () => {
        nomorAntrian.play();
        nomorAntrian.onended = async () => {
            var character = textNumber.innerHTML
            var playlist = [];
            
            var audio = new Audio();
            for(let i = 0; i< character.length; i++) {
                playlist[i] = numberList[character[i]];
            }
            var i = 0;
            audio.src = playlist[0];
            audio.play();

            audio.addEventListener('ended', function () {
                if(i<playlist.length - 1) {
                    i++;
                    audio.src = playlist[i];
                    audio.play();
                }
            }, true);
        }
    }
}

const playNomorAntrian = (number) => {
    new Promise (resolve => {
        numberList[number].play();
        numberList[number].onended = () => {
           return resolve();
        }
    }) 
}

const startUp = () => {
    var lastNumber = localStorage.getItem("last-number");
    if(!lastNumber) {
        localStorage.setItem("last-number", defaultNumber);
        textNumber.innerHTML = defaultNumber;
        textLastNumber.innerHTML = defaultNumber;
    }else {
        textNumber.innerHTML = lastNumber;
        textLastNumber.innerHTML = lastNumber;
    }
}

const next = () => {
    var lastNumber = localStorage.getItem("last-number");
    var nextNumber = parseInt(lastNumber) + 1;
    localStorage.setItem("last-number", nextNumber);
    textNumber.innerHTML = nextNumber;
    playSound();
    textLastNumber.innerHTML = localStorage.getItem('last-number');
}

const prev = () => {
    var lastNumber = localStorage.getItem("last-number");
    if(lastNumber > 1) {
        var prevNumber = parseInt(lastNumber) - 1;
        localStorage.setItem("last-number", prevNumber);
        textNumber.innerHTML = prevNumber;
        playSound();
        textLastNumber.innerHTML = localStorage.getItem('last-number');
    }
}

const reset = () => {
    textNumber.innerHTML = defaultNumber;
    textLastNumber.innerHTML = defaultNumber;
    localStorage.setItem("last-number", defaultNumber);
}

btnPlay.addEventListener("click", ()=>{
    playSound();
});

btnNext.addEventListener("click", ()=>{
    next();
});

btnPrev.addEventListener("click", () => {
    prev();
})

btnReset.addEventListener("click", ()=>{
    reset();
})

startUp();
