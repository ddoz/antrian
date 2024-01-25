let intro = new Audio("audio/intro.mp3");
let nomorAntrian = new Audio("audio/nomor_antrian.mp3");
let keLoket = new Audio("audio/ke_loket.mp3");

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

const playSound = async (number, loket) => {
    await intro.play();
    intro.onended = () => {
        nomorAntrian.play();
        nomorAntrian.onended = async () => {
            var character = number
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
                }else {
                    audio.onended = async () => {
                        playLoket(loket);
                    }
                }
            }, true);

        }
    }
}

const playLoket = async (loket) => {
    await keLoket.play();
    keLoket.onended = () => {
        var audio = new Audio();
        audio.src = numberList[loket];
        audio.play();
    }
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
    
        //check local storage apakah sesi sudah aktif atau belum
        var sessionName = localStorage.getItem('NAMA_SESI');
        if(!sessionName) {
            document.getElementById('content').style.display = 'none';
            document.getElementById('prepare').style.display = 'flex';
        }else {
            document.getElementById('content').style.display = 'flex';
            document.getElementById('prepare').style.display = 'none';
            buildContent();
        }
    }
};


const buildContent = () => {
    document.getElementById('content').style.display = 'flex';
    document.getElementById('prepare').style.display = 'none';
    document.getElementById('resetSesi').style.display = 'block';
    var namaSesi = localStorage.getItem('NAMA_SESI');
    var jumlahLoket = localStorage.getItem('JUMLAH_LOKET');
    document.getElementById('namaSesi').innerHTML = namaSesi; 
    for (let index = 1; index <= jumlahLoket; index++) {

        var baseUrl = window.location.origin;
        const url = baseUrl + "/server.php";
        var formData = new FormData();
        formData.append('state', 'LOKET_ANTRIAN');
        formData.append('namaSesi', namaSesi);
        formData.append('loket', index);
        fetch(url, {
            method : "POST",
            body: formData,
        }).then(
            response => response.json() 
        ).then(
            (res) => { 
                var num = res.number;
                document.getElementById('namaSesi').innerHTML += `
                    <div id="content-${index}" class="content">
                        <label>LOKET ${index}</label>
                        <div id="box-number-${index}">
                            <div id="number-${index}" class="number">${num}</div>
                        </div>
                        <div id="box-button-${index}">
                            <button onclick="call(${index})">PANGGIL</button>
                            <button onclick="next(${index})">></button>
                        </div>
                    </div>
                `
            }
        );

    }
}

function next(loket) {
    var namaSesi = localStorage.getItem('NAMA_SESI')
    var baseUrl = window.location.origin;
    const url = baseUrl + "/server.php";
    var formData = new FormData();
    formData.append('state', 'NEXT_NUMBER');
    formData.append('namaSesi', namaSesi);
    formData.append('loket', loket);
    fetch(url, {
        method : "POST",
        body: formData,
    }).then(
        response => response.json() 
    ).then(
        (res) => { 
            var loket = res.loket;
            var next = res.next;
            document.getElementById('number-'+loket).innerHTML = next;
            playSound(next.toString(),loket);
        }
    );
}

function call(loket) {
    var number = document.getElementById('number-'+loket).innerHTML;
    playSound(number,loket);
}

function resetSession() {
    let text = "Reset Sesi Antrian?";
    if (confirm(text) == true) {
        localStorage.clear();
        location.reload();
    } 
}

function enterSession() {
    var baseUrl = window.location.origin;
    const url = baseUrl + "/server.php";
    var formData = new FormData();
    formData.append('state', 'CREATE_SESSION');
    formData.append('jumlahLoket', document.getElementById('jumlahLoket').value);
    fetch(url, {
        method : "POST",
        body: formData,
    }).then(
        response => response.json() 
    ).then(
        (res) => { 
            localStorage.setItem('NAMA_SESI', res.namaSesi);
            localStorage.setItem('JUMLAH_LOKET', res.jumlahLoket);
            buildContent();
        }
    );
}

