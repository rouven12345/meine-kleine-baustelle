import { MATERIAL_BY_ID, emptyMaterials, totalMaterials } from './materials.js';

export const PHASES = Object.freeze({ SHOPPING: 'shopping', UNLOADING: 'unloading', USING: 'using', MIXING: 'mixing', POURING: 'pouring' });
const copyMaterials = (materials) => ({ ...materials });

/** Pure game logic. UI code renders this state, but does not own game rules. */
export class GameState {
  constructor({ startingStars = 1_000_000 } = {}) {
    this.stars = startingStars;
    this.phase = PHASES.SHOPPING;
    this.waitingAtShop = emptyMaterials();
    this.truckCargo = emptyMaterials();
    this.unloaded = emptyMaterials();
    this.mixer = emptyMaterials();
    this.unloadTaps = 0;
    this.mixTaps = 0;
    this.foundations = 0;
    this.message = 'Kaufe ein Baumaterial im Laden.';
  }

  get waitingTotal() { return totalMaterials(this.waitingAtShop); }
  get cargoTotal() { return totalMaterials(this.truckCargo); }
  get unloadedTotal() { return totalMaterials(this.unloaded); }
  get mixerTotal() { return totalMaterials(this.mixer); }
  get canCollect() { return this.phase === PHASES.SHOPPING && this.waitingTotal > 0; }
  get canMix() { return this.phase === PHASES.MIXING && this.mixerTotal > 0; }
  get canPour() { return this.phase === PHASES.POURING; }

  buyMaterial(materialId) {
    const material = MATERIAL_BY_ID[materialId];
    if (!material || this.phase !== PHASES.SHOPPING) return false;
    if (this.stars < material.price) { this.message = `Für ${material.label} fehlen Sterne.`; return false; }
    this.stars -= material.price;
    this.waitingAtShop[materialId] += 1;
    this.message = `${material.label} ist für den LKW bereit.`;
    return true;
  }

  collectWithTruck() {
    if (!this.canCollect) return false;
    this.truckCargo = copyMaterials(this.waitingAtShop);
    this.waitingAtShop = emptyMaterials();
    this.unloadTaps = 0;
    this.phase = PHASES.UNLOADING;
    this.message = 'Der LKW ist da. Tippe ihn 3× an, damit er alles ablädt.';
    return true;
  }

  unloadTruckTap() {
    if (this.phase !== PHASES.UNLOADING) return false;
    this.unloadTaps += 1;
    if (this.unloadTaps < 3) { this.message = `Prima! Noch ${3 - this.unloadTaps}× auf den LKW tippen.`; return true; }
    this.unloaded = copyMaterials(this.truckCargo);
    this.truckCargo = emptyMaterials();
    this.phase = PHASES.USING;
    this.message = 'Tippe jedes abgeladene Material an, damit es in den Betonmischer kommt.';
    return true;
  }

  useMaterial(materialId) {
    if (this.phase !== PHASES.USING || !MATERIAL_BY_ID[materialId] || this.unloaded[materialId] < 1) return false;
    this.unloaded[materialId] -= 1;
    this.mixer[materialId] += 1;
    if (this.unloadedTotal === 0) { this.phase = PHASES.MIXING; this.message = 'Alles ist im Mischer. Jetzt 10× mischen!'; }
    else this.message = 'Gut gemacht! Gib auch die übrigen Materialien in den Mischer.';
    return true;
  }

  mixTap() {
    if (!this.canMix) return false;
    this.mixTaps += 1;
    if (this.mixTaps >= 10) { this.phase = PHASES.POURING; this.message = 'Der Beton ist fertig. Jetzt kannst du das Fundament giessen!'; }
    else this.message = `Der Beton wird gemischt: ${this.mixTaps}/10.`;
    return true;
  }

  pourFoundation() {
    if (!this.canPour) return false;
    this.foundations += 1;
    this.phase = PHASES.SHOPPING;
    this.waitingAtShop = emptyMaterials(); this.truckCargo = emptyMaterials(); this.unloaded = emptyMaterials(); this.mixer = emptyMaterials();
    this.unloadTaps = 0; this.mixTaps = 0;
    this.message = `Juhu! Fundament ${this.foundations} ist fertig. Baue gleich noch eines!`;
    return true;
  }
}
