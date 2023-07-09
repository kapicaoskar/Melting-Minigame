const hackState = '<div class="melting">                <p>Utrzymaj Temperature</p>                <div class="bar">                    <div class="melter"></div>                    <div class="cursor"></div>                </div>                <div class="progressbar">                    <p>Pozostały czas</p>                    <div class="progress">                        <div id="fill" class="progress-fill"></div>                    </div>                    <div class="keyCaps">                        <div class="left"><i class="fa-solid fa-arrow-left"></i></div>                        <div class="right"><i class="fa-solid fa-arrow-right"></i></div>                    </div>                </div>            </div>'
const getReadyState = '<div class="melting">                <p style="position: fixed; top: 40%; left: 50%; transform: translate(-50%,-40%); font-size:1.3vw">Przygotuj sie</p>                <div class="progressbar">                    <p>Pozostały czas</p>                    <div class="progress">                        <div id="fill" class="progress-fill"></div>                    </div>                    <div class="keyCaps">                        <div class="left"><i class="fa-solid fa-arrow-left"></i></div>                        <div class="right"><i class="fa-solid fa-arrow-right"></i></div>                    </div>                </div>            </div>'
const winState = '<div class="melting">                <p style="position: fixed; top: 40%; left: 50%; transform: translate(-50%,-40%); font-size:1.3vw">Wygrałeś!</p>                <div class="progressbar">                    <p>Pozostały czas</p>                    <div class="progress">                        <div id="fill" class="progress-fill"></div>                    </div>                    <div class="keyCaps">                        <div class="left"><i class="fa-solid fa-arrow-left"></i></div>                        <div class="right"><i class="fa-solid fa-arrow-right"></i></div>                    </div>                </div>            </div>'
const loseState = '<div class="melting">                <p style="position: fixed; top: 40%; left: 50%; transform: translate(-50%,-40%); font-size:1.3vw">Przegrałeś!</p>                <div class="progressbar">                    <p>Pozostały czas</p>                    <div class="progress">                        <div id="fill" class="progress-fill"></div>                    </div>                    <div class="keyCaps">                        <div class="left"><i class="fa-solid fa-arrow-left"></i></div>                        <div class="right"><i class="fa-solid fa-arrow-right"></i></div>                    </div>                </div>            </div>'
let didWin = false
let interval = ""

const startProgressBar = (duration, onComplete) => {
    let progressBar = document.getElementById("fill");
    let progress = 100;
    const interval = 10;
    const timer = setInterval(function () {
        if (progress <= 0) {
            clearInterval(timer);
            if (typeof onComplete === "function") {
                onComplete()
            }
        } else {
            progress -= (interval / duration) * 100;
            if (progress < 0) {
                progress = 0;
            }
            progressBar.style.width = progress + "%";
        }
    }, interval);
}

const startHack = () => {
    startProgressBar(20000, function () {
        if (didWin) {
            winHack()
        } else {
            loseHack()
        }
    });
    let melter = document.querySelector('.melter')
    let cursor = document.querySelector('.cursor')
    const gameInterval = setInterval(() => {
        let resize = melter.style.left
        if (resize === "") { resize = 50 } else { resize = resize.replace("%", ""), resize = parseInt(resize) }
        const min = 1
        const max = 2
        const resize2 = Math.floor(Math.random() * (max - min + 1) + min);
        if (resize2 == 1) {
            if (resize >= 85) {
                const min = 1
                const max = 3
                const resize2 = resize - Math.floor(Math.random() * (max - min + 1) + min);
                const resize3 = resize2 + "%"
                melter.style.left = resize3
            }
            if (!resize <= 15 && resize < 85) {
                const min = 1
                const max = 3
                const resize2 = resize + Math.floor(Math.random() * (max - min + 1) + min);
                const resize3 = resize2 + "%"
                melter.style.left = resize3
            }
        }
        if (resize2 == 2) {
            if (resize >= 85) {
                const min = 1
                const max = 3
                const resize2 = resize - Math.floor(Math.random() * (max - min + 1) + min);
                const resize3 = resize2 + "%"
                melter.style.left = resize3
            }
            if (!resize <= 15 && resize < 85) {
                const min = 1
                const max = 3
                const resize2 = resize - Math.floor(Math.random() * (max - min + 1) + min);
                const resize3 = resize2 + "%"
                melter.style.left = resize3
            }
        }
        const meltRect = melter.getBoundingClientRect();
        const cursorRect = cursor.getBoundingClientRect()
        if (meltRect.left >= cursorRect.left || meltRect.left < (cursorRect.left - 100)) {
            loseHack()
            didWin = false
        } else {
            didWin = true
        }
    }, 150)
    interval = gameInterval
}


const moveCursor = (event) => {
    let cursor = document.querySelector('.cursor')
    let resize = cursor.style.left
    if (resize === "") { resize = 50 } else { resize = resize.replace("%", ""), resize = parseInt(resize) }
    const key = event.keyCode;
    if (key === 37) {
        if (resize <= 2.5) { } else {
            cursor.style.left = `${resize - 1}%`
        }
    } else if (key === 39) {
        if (resize >= 98.5) { } else {
            cursor.style.left = `${resize + 1}%`
        }
    }
}

const loadHack = () => {
    didWin = false
    interval = ""
    document.querySelector('body').style.display = "block"
    startProgressBar(3000, function () {
        document.querySelector(".container").innerHTML = hackState
        startHack()
    });
}


const loseHack = () => {
    document.querySelector(".container").innerHTML = loseState
    clearInterval(interval)
    startProgressBar(3000, function () {
        document.querySelector('body').style.display = "none"
        fetch(`https://${GetParentResourceName()}/win`, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8', }, body: JSON.stringify({ win: false }) })
    });
}


const winHack = () => {
    document.querySelector(".container").innerHTML = winState
    clearInterval(interval)
    startProgressBar(3000, function () {
        document.querySelector('body').style.display = "none"
        fetch(`https://${GetParentResourceName()}/win`, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8', }, body: JSON.stringify({ win: true }) })
    });
}

window.addEventListener('keydown', moveCursor);
window.addEventListener('message', function (event) { if (event.data.type === "START_HACK") loadHack(); })

