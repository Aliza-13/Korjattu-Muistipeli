
// board.js
import { createCardElement, flipCard } from './card.js';

const allCards = [
    '🍎', '🍐', '🍒', '🍉', '🍇', '🍓', '🍌', '🍍',
    '🥝', '🥥', '🍑', '🍈', '🍋', '🍊', '🍏', '🍅'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let matchedPairs = 0;
let pairCountInGame = 0;
let gameStarted = false;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

export function createBoard(cardCount = 12) {
    const gameBoard = document.getElementById('game-board');
    if(!gameBoard) {
        console.error('game-board elementtiä ei löydy');
        return;
    }

    /* Reset pelitila */
    gameBoard.innerHTML = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    gameStarted = false;

    const pairCount = Math.floor(cardCount / 2);
    const safePairCount = Math.min(pairCount, allCards.length);
    pairCountInGame = safePairCount; // <-- tärkeä!

    const selectedCards = allCards.slice(0, safePairCount);
    const cards = [...selectedCards,...selectedCards];
    shuffle(cards);

    cards.forEach(card => {
        const cardElement = createCardElement(card);

        const onClick = (e) => {
            if (lockBoard) return;
            if (cardElement.classList.contains('flipped')  || cardElement.classList.contains('matched')) return;

            const didFlip = flipCard(cardElement);
            if(!didFlip) return;
            
            handleCardFlip(cardElement);
        };

        cardElement._onClick = onClick;
        cardElement.addEventListener('click', onClick);
        gameBoard.appendChild(cardElement);
    });
}

function handleCardFlip(cardElement) {
    // Aloitetaan peli
    if (!gameStarted) {
        gameStarted = true;
        document.dispatchEvent(new Event('gameStart'));
    }

    // estetään saman kortin valinta uudestaan
    if (cardElement === firstCard) return;

    if (!firstCard) {
        firstCard = cardElement;
        return;
    }

    // toinen kortti asetetaan ja lauta lukitaan
    secondCard = cardElement;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    if (!firstCard || !secondCard) {
        resetBoard();
        return;
    }

    const isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    if (firstCard && firstCard._onClick) firstCard.removeEventListener('click', firstCard._onClick);
    if (secondCard && secondCard._onClick) secondCard.removeEventListener('click', secondCard._onClick);

    if (firstCard) firstCard.classList.add('matched');
    if (secondCard) secondCard.classList.add('matched');

    matchedPairs++;
    if (matchedPairs >= pairCountInGame) {
        // peli voitettu — lähetetään event
        document.dispatchEvent(new CustomEvent('gameWin', {
            detail: {
                matchedPairs,
                totalPairs: pairCountInGame
            }
        }));
    }

    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        if (firstCard) {
            const f = firstCard.querySelector('.card-front');
            if (f) f.textContent = '';
            firstCard.classList.remove('flipped');
        }
        if (secondCard) {
            const s = secondCard.querySelector('.card-front');
            if (s) s.textContent = '';
            secondCard.classList.remove('flipped');
        }

        resetBoard();
    }, 1200);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
