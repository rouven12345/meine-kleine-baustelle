# Meine kleine Baustelle

Erster Webspiel-Prototyp für Kinder ab 6. Ohne externe Abhängigkeiten oder Anmeldung.

## Spielen
Mit Node.js 24: `npm run dev`, dann http://localhost:5173 öffnen.

Bagger, Lastwagen oder Kran auswählen, anschließend den großen Bauplatz antippen. Vier Bauaktionen ergeben ein Haus; danach Dachfarbe wählen. Fortschritt wird im Browser gespeichert. „Neu bauen“ öffnet eine Bestätigung, bevor zurückgesetzt wird. Sound lässt sich oben rechts einschalten.

## Prüfen und veröffentlichen
`npm test` prüft Baufolge und Spielstandvalidierung. `npm run build` erstellt `dist/`, das auf statischem Webhosting bereitgestellt werden kann. GitHub Actions führt Test und Build aus und liefert das Webspiel als Artefakt. Eine Veröffentlichung ist noch nicht eingerichtet.

## Aufbau
`src/state.js`: reine Spiellogik; `src/game.js`: Bedienung, Animation, Sound und Speicherung; `index.html`: responsive Oberfläche und SVG-Spielwelt.

Dies ist ein kleiner HTML/SVG-Prototyp. Phaser/Vite, weitere Bauprojekte und freie Ortsgestaltung sind noch nicht enthalten. Browser- und Tabletprüfung stehen aus.
