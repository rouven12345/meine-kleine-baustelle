# Meine kleine Baustelle

Ein ruhiges, kindgerechtes Baustellenspiel: Baumaterial einzeln einkaufen,
vom LKW abladen, in den Betonmischer geben und ein Fundament giessen.

## Spielen

Die Anwendung ist statisch und braucht keinen Build-Schritt. `index.html` in
einem Browser öffnen oder einen lokalen Webserver starten:

```bash
python3 -m http.server 5173
```

Danach `http://localhost:5173` öffnen.

## Spielablauf

1. Kies, Zement, Wasser oder Sand einzeln im Laden kaufen.
2. Den LKW anklicken, damit er das gekaufte Material abholt.
3. Den LKW dreimal anklicken und alles abladen.
4. Jedes abgeladene Material in den Betonmischer geben.
5. Den Mischer zehnmal anklicken.
6. Das Fundament giessen.

Es gibt bewusst **kein Rezept**: Schon ein beliebiges Material genügt für ein
Fundament. Werden mehrere Materialien gekauft, werden alle in den Mischer
gegeben.

## Tests

```bash
npm test
```
