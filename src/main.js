import { GameState, PHASES } from './game/GameState.js';
import { MATERIALS } from './game/materials.js';

const state = new GameState();
let truckDriving = false;
const $ = (selector) => document.querySelector(selector);
const els = {
  stars: $('#stars'), missionTitle: $('#mission-title'), missionText: $('#mission-text'), phasePill: $('#phase-pill'),
  openShop: $('#open-shop'), shopHelp: $('#shop-help'), shopDialog: $('#shop-dialog'), closeShop: $('#close-shop'), shopDone: $('#shop-done'),
  shopGrid: $('#shop-grid'), shopOrderSummary: $('#shop-order-summary'), truckAction: $('#truck-action'), truckTitle: $('#truck-title'),
  truckDetail: $('#truck-detail'), unloadCounter: $('#unload-counter'), materialsRow: $('#materials-row'), mixerVisual: $('#mixer-visual'),
  mixerStatus: $('#mixer-status'), ingredientList: $('#ingredient-list'), mixAction: $('#mix-action'), mixCounter: $('#mix-counter'),
  foundationZone: $('#foundation-zone'), foundationStatus: $('#foundation-status'), pourAction: $('#pour-action'), gameMessage: $('#game-message')
};
const swissNumber = new Intl.NumberFormat('de-CH');
const PHASE_COPY = {
  [PHASES.SHOPPING]: { pill: '1 · Einkaufen', title: 'Ein Fundament bauen', text: 'Kaufe ein Baumaterial im Laden.' },
  [PHASES.UNLOADING]: { pill: '2 · Abladen', title: 'LKW abladen', text: 'Tippe den LKW 3× an.' },
  [PHASES.USING]: { pill: '3 · Einfüllen', title: 'Material benutzen', text: 'Tippe jedes Material an.' },
  [PHASES.MIXING]: { pill: '4 · Mischen', title: 'Beton mischen', text: 'Tippe den Mischer 10× an.' },
  [PHASES.POURING]: { pill: '5 · Giessen', title: 'Fundament fertigstellen', text: 'Giesse den Beton ins Fundament.' }
};

function materialLabel(materials) {
  return MATERIALS.filter((material) => materials[material.id] > 0)
    .map((material) => `${materials[material.id]}× ${material.label}`).join(', ');
}

function pulse(element) {
  element.classList.remove('pulse');
  void element.offsetWidth;
  element.classList.add('pulse');
}

function renderShop() {
  els.shopGrid.innerHTML = '';
  for (const material of MATERIALS) {
    const count = state.waitingAtShop[material.id];
    const card = document.createElement('article');
    card.className = 'shop-item';
    card.style.setProperty('--material-colour', material.colour);
    card.innerHTML = `<div class="material-icon" aria-hidden="true">${material.icon}</div><div class="shop-item-copy"><h3>${material.label}</h3><p>${material.description}</p><span class="owned-count">Für den LKW: ${count}</span></div>`;
    const buy = document.createElement('button');
    buy.type = 'button'; buy.className = 'buy-button';
    buy.disabled = state.phase !== PHASES.SHOPPING || state.stars < material.price;
    buy.innerHTML = `<span>⭐ ${swissNumber.format(material.price)}</span><strong>Kaufen</strong>`;
    buy.addEventListener('click', () => { if (state.buyMaterial(material.id)) pulse(buy); render(); });
    card.append(buy);
    els.shopGrid.append(card);
  }
  els.shopOrderSummary.textContent = state.waitingTotal ? `Für den LKW bereit: ${materialLabel(state.waitingAtShop)}` : 'Noch nichts für den LKW gekauft.';
}

function renderMaterials() {
  els.materialsRow.innerHTML = '';
  for (const material of MATERIALS) {
    const amount = state.unloaded[material.id];
    const pile = document.createElement('button');
    pile.type = 'button'; pile.className = 'material-pile'; pile.style.setProperty('--material-colour', material.colour);
    pile.disabled = state.phase !== PHASES.USING || amount === 0;
    pile.innerHTML = `<span class="pile-icon" aria-hidden="true">${material.icon}</span><strong>${material.label}</strong><span>${amount > 0 ? `${amount} bereit` : 'leer'}</span>`;
    pile.addEventListener('click', () => {
      if (state.useMaterial(material.id)) {
        pulse(pile);
        els.mixerVisual.classList.add('receive-material');
        window.setTimeout(() => els.mixerVisual.classList.remove('receive-material'), 450);
      }
      render();
    });
    els.materialsRow.append(pile);
  }
}

function renderMixer() {
  const contents = MATERIALS.filter((material) => state.mixer[material.id] > 0);
  els.ingredientList.innerHTML = contents.length ? contents.map((material) => `<span>${material.icon} ${state.mixer[material.id]}</span>`).join('') : '<span class="muted">Noch leer</span>';
  els.mixerStatus.textContent = state.mixerTotal ? `${state.mixerTotal} Material${state.mixerTotal === 1 ? '' : 'ien'} im Mischer.` : 'Noch kein Material im Mischer.';
  els.mixCounter.textContent = `${state.mixTaps}/10`;
  els.mixAction.disabled = !state.canMix;
  els.mixAction.classList.toggle('ready', state.canMix);
  els.mixerVisual.classList.toggle('is-mixing', state.phase === PHASES.MIXING && state.mixTaps > 0);
}

function renderTruck() {
  const collecting = state.phase === PHASES.SHOPPING && state.waitingTotal > 0;
  const unloading = state.phase === PHASES.UNLOADING;
  els.truckAction.disabled = truckDriving || (!collecting && !unloading);
  els.truckAction.classList.toggle('ready', collecting || unloading);
  els.truckAction.classList.toggle('driving', truckDriving);
  els.unloadCounter.hidden = !unloading; els.unloadCounter.textContent = `${state.unloadTaps}/3`;
  if (truckDriving) { els.truckTitle.textContent = 'Unterwegs zur Baustelle'; els.truckDetail.textContent = materialLabel(state.truckCargo); }
  else if (collecting) { els.truckTitle.textContent = 'Material abholen'; els.truckDetail.textContent = `${state.waitingTotal} Material${state.waitingTotal === 1 ? '' : 'ien'} warten im Laden`; }
  else if (unloading) { els.truckTitle.textContent = 'LKW abladen'; els.truckDetail.textContent = '3× auf den LKW tippen'; }
  else if (state.phase !== PHASES.SHOPPING) { els.truckTitle.textContent = 'LKW ist leer'; els.truckDetail.textContent = 'Material liegt an der Baustelle'; }
  else { els.truckTitle.textContent = 'Warte auf Material'; els.truckDetail.textContent = 'Im Laden einkaufen'; }
}

function renderFoundation() {
  els.pourAction.disabled = !state.canPour;
  els.pourAction.classList.toggle('ready', state.canPour);
  els.foundationZone.classList.toggle('pour-ready', state.canPour);
  els.foundationZone.classList.toggle('has-foundation', state.foundations > 0);
  els.foundationStatus.textContent = state.foundations > 0 ? `${state.foundations} Fundament${state.foundations === 1 ? '' : 'e'} fertig gebaut.` : 'Noch leer – bereit für Beton.';
}

function render() {
  const copy = PHASE_COPY[state.phase];
  els.stars.textContent = swissNumber.format(state.stars);
  els.phasePill.textContent = copy.pill; els.missionTitle.textContent = copy.title; els.missionText.textContent = copy.text; els.gameMessage.textContent = state.message;
  els.openShop.classList.toggle('ready', state.phase === PHASES.SHOPPING);
  els.openShop.disabled = state.phase !== PHASES.SHOPPING;
  els.shopHelp.textContent = state.phase === PHASES.SHOPPING ? (state.waitingTotal ? `${state.waitingTotal} Material${state.waitingTotal === 1 ? '' : 'ien'} bestellt` : 'Material kaufen') : 'Nach dem Fundament wieder offen';
  renderShop(); renderTruck(); renderMaterials(); renderMixer(); renderFoundation();
}

els.openShop.addEventListener('click', () => { if (state.phase === PHASES.SHOPPING) els.shopDialog.showModal(); });
els.closeShop.addEventListener('click', () => els.shopDialog.close());
els.shopDone.addEventListener('click', () => els.shopDialog.close());
els.truckAction.addEventListener('click', () => {
  if (state.phase === PHASES.SHOPPING && state.canCollect) {
    state.collectWithTruck(); truckDriving = true; render();
    window.setTimeout(() => { truckDriving = false; render(); }, 900);
  } else if (state.unloadTruckTap()) { pulse(els.truckAction); render(); }
});
els.mixAction.addEventListener('click', () => { if (state.mixTap()) pulse(els.mixerVisual); render(); });
els.pourAction.addEventListener('click', () => {
  if (state.pourFoundation()) { els.foundationZone.classList.add('poured'); window.setTimeout(() => els.foundationZone.classList.remove('poured'), 650); }
  render();
});

render();
