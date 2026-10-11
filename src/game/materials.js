export const MATERIALS = Object.freeze([
  { id: 'gravel', label: 'Kies', icon: '🪨', price: 2_000, colour: '#8d99a6', description: 'Kleine Steine für eine starke Baustelle.' },
  { id: 'cement', label: 'Zement', icon: '🧱', price: 4_000, colour: '#6e7480', description: 'Feines Pulver, das alles zusammenhält.' },
  { id: 'water', label: 'Wasser', icon: '💧', price: 500, colour: '#48b4e8', description: 'Ein frischer Schluck für den Beton.' },
  { id: 'sand', label: 'Sand', icon: '🏖️', price: 1_500, colour: '#e7b760', description: 'Goldener Sand aus der Sandgrube.' }
]);

export const MATERIAL_BY_ID = Object.freeze(Object.fromEntries(MATERIALS.map((material) => [material.id, material])));
export const emptyMaterials = () => Object.fromEntries(MATERIALS.map((material) => [material.id, 0]));
export const totalMaterials = (materials) => Object.values(materials).reduce((total, amount) => total + amount, 0);
