import test from 'node:test';
import assert from 'node:assert/strict';
import { GameState, PHASES } from '../src/game/GameState.js';

test('materials can be bought separately and cost stars', () => {
  const state = new GameState({ startingStars: 10_000 });
  assert.equal(state.buyMaterial('water'), true);
  assert.equal(state.buyMaterial('sand'), true);
  assert.equal(state.waitingAtShop.water, 1);
  assert.equal(state.waitingAtShop.sand, 1);
  assert.equal(state.stars, 8_000);
});

test('the truck needs exactly three taps before materials are usable', () => {
  const state = new GameState();
  state.buyMaterial('gravel'); state.collectWithTruck();
  state.unloadTruckTap(); state.unloadTruckTap();
  assert.equal(state.phase, PHASES.UNLOADING);
  assert.equal(state.unloaded.gravel, 0);
  state.unloadTruckTap();
  assert.equal(state.phase, PHASES.USING);
  assert.equal(state.unloaded.gravel, 1);
});

test('any one material makes a foundation possible without a recipe', () => {
  const state = new GameState();
  state.buyMaterial('water'); state.collectWithTruck();
  state.unloadTruckTap(); state.unloadTruckTap(); state.unloadTruckTap();
  state.useMaterial('water');
  assert.equal(state.phase, PHASES.MIXING);
  for (let tap = 0; tap < 10; tap += 1) state.mixTap();
  assert.equal(state.phase, PHASES.POURING);
  state.pourFoundation();
  assert.equal(state.foundations, 1);
  assert.equal(state.phase, PHASES.SHOPPING);
});

test('all bought materials have to be put into the mixer before mixing', () => {
  const state = new GameState();
  state.buyMaterial('gravel'); state.buyMaterial('cement'); state.collectWithTruck();
  state.unloadTruckTap(); state.unloadTruckTap(); state.unloadTruckTap();
  state.useMaterial('gravel');
  assert.equal(state.phase, PHASES.USING);
  assert.equal(state.mixTap(), false);
  state.useMaterial('cement');
  assert.equal(state.phase, PHASES.MIXING);
});
