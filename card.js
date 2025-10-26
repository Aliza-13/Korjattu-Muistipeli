
// card.js (esimerkkiversio)
export function createCardElement(symbol) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.card = symbol;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = symbol;

    const back = document.createElement('div');
    back.className = 'card-back';
    back.textContent = '❓'; // tai tyhjä kuvio

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    return card;
}

export function flipCard(cardElement) {
    if (!cardElement) return false;
    // jos jo flipped, älä flipata uudestaan
    if (cardElement.classList.contains('flipped')) return false;
    cardElement.classList.add('flipped');

    // Frontin tekstin asetukset (varmistetaan)
    const front = cardElement.querySelector('.card-front');
    if (front && !front.textContent) front.textContent = cardElement.dataset.card || '';

    return true;
}
