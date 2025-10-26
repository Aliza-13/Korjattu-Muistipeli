
// game.js
import { createBoard } from './board.js';

document.addEventListener('DOMContentLoaded', () => {
    let timerEl = document.getElementById('timer');
    if (!timerEl) {
        const topbar = document.querySelector('.topbar') || document.body;
        const status = document.createElement('div'); 
        status.className = 'status';
        timerEl = document.createElement('span');
        timerEl.id = 'timer';
        timerEl.textContent = '0:00';
        timerEl.style.display = 'none'; 
        status.appendChild(document.createTextNode('Aika: '));
        status.appendChild(timerEl);
        topbar.appendChild(status);
    }

    // Aloitusprompt
    let cardCount = null;
    while(true) {
        const input = prompt("Syötä parillinen korttien lukumäärä, esim: 6, 12 tai 16");
        if (input === null) {
            cardCount = 12;
            break;
        }

        const n = parseInt(input, 10);
        if (Number.isNaN(n) || n < 4) {
            alert("Anna kelvollinen numero, vähintään 4");
            continue;
        }
        if (n % 2 !== 0) {
            alert("Korttien määrä täytyy olla parillinen luku.");
            continue;
        }

        if (n > 16) {
            alert("Korttien määrä on liian suuri, maksimi on 16");
            continue;
        }

        cardCount = n;
        break;
    }

    createBoard(cardCount);

    // Ajastinlogiikka
    let timerInterval = null;
    let elapsed = 0;

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
    function updateTimerDisplay() {
        if (timerEl) timerEl.textContent = formatTime(elapsed);
    }

    // Ajastin käynnistyy ennenkuin peli alkaa
    document.addEventListener('gameStart', () => {
        if (timerEl) timerEl.style.display = '';
        //käynnistä
        if (timerInterval) clearInterval(timerInterval);
        elapsed = 0;
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            elapsed++;
            updateTimerDisplay();
        }, 1000);
    });

    // ajastin pysähtyy ja ilmoittaa voitosta
    document.addEventListener('gameWin', (e) => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        updateTimerDisplay();
        const totalPairs = e.detail?.totalPairs ?? '-';
        alert(`Onnea! löysit kaikki ${totalPairs} paria, aikasi oli ${formatTime(elapsed)}`);
    });

    // ajastimen nollaus varmistetaan
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            elapsed = 0;
            if (timerEl) timerEl.style.display = 'none';
            location.reload();
        });
    }

    const newGameBtn = document.getElementById('newgame-btn');
    if (newGameBtn) {
        newGameBtn.addEventListener('click', () => {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            elapsed = 0;
            if (timerEl) timerEl.style.display = 'none';
            createBoard(12);
        });
    }
});
