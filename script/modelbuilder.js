/**
 * Zur vereinfachten Nutzung und als kleine Optimierung
 * @type {number} Die Zahl PI aus Math.PI
 */
const pi = Math.PI;

/**
 * Array, das die aktuell vorkommendem Vertices hält
 * * @type {*[]}
 *  */
var vertices = [];

/**
 * Array, das die aktuell vorkommendem Normalen hält
 * * @type {*[]}
 *  */
var normals = [];

/**
 * Array, das die aktuellen VerticesIndizes für die Linien hält
 * @type {*[]}
 */
var verticesIndexLine = [];

/**
 * Array, das die aktuellen VerticesIndizes für die Dreiecke hält
 * * @type {*[]}
 *  */
var verticesIndexTriangle = [];

/**
 * Leert alle Arrays
 */
function clearArrays() {
    vertices = [];
    normals = [];
    verticesIndexLinex = [];
    verticesIndexTriangle = [];
}

/**
 * Hilfsfuktion zum Berechnen der Sinuswerte auf Basis von Grad
 * @param degree zu berechnender Grad
 * @param y_scale die zu verwendende Skalierung der Amplitude
 * @returns {number} Der skalierte Sinuswert
 */
function sinusFromDegree(degree, y_scale) {
    let radians = degree * Math.PI / 180.0;
    return Math.sin(radians) * y_scale;
}

/**
 * Hilfsfuktion zum Berechnen der Cosinuswerte auf Basis von Grad
 * @param degree zu berechnender Grad
 * @param y_scale die zu verwendende Skalierung der Amplitude
 * @returns {number} Der skalierte Sinuswert
 */
function cosinusFromDegree(degree, y_scale) {
    let radians = degree * Math.PI / 180.0;
    return Math.cos(radians) * y_scale;
}

/**
 * Fügt auf Basis der übergebenen Parameter zwei Linien und zwei Dreiecke
 * den entsprechenden Arrays hinzu
 * @param i Zähler Schleife i
 * @param j Zähler Schleife j
 * @param iVertex Nummer des Knoten
 * @param stepV Schrittweite für Schleife j
 */
function addElements(i, j, iVertex, stepV) {
    // Definiert die Linien für das Gitternetz
    if (i > 0 && j > 0) {
        verticesIndexLine.push(iVertex - 1);
        verticesIndexLine.push(iVertex);
    }

    if (i > 0 && j > 0) {
        verticesIndexLine.push(iVertex - (stepV + 1));
        verticesIndexLine.push(iVertex);
    }

    // Definiert zwei Dreiecke, die zsuammen das durch die Linien begrenzte
    // Rechteck bilden
    if (j > 0 && i > 0) {
        verticesIndexTriangle.push(iVertex);
        verticesIndexTriangle.push(iVertex - 1);
        verticesIndexTriangle.push(iVertex - (stepV + 1));

        verticesIndexTriangle.push(iVertex - 1);
        verticesIndexTriangle.push(iVertex - (stepV + 1) - 1);
        verticesIndexTriangle.push(iVertex - (stepV + 1));
    }
}

/**
 * Zylinder (Erzeugung mit parametrisierter Funktion)
 */
function getFigure1VerticesPointsArray() {
    clearArrays();

    // Parameter Winkel/Grad
    let stepU = 32;
    let du = 2 * pi / stepU;

    // Parameter Höhe
    let stepV = 16;
    let dv = 1 / stepV;

    let r = 0.6;
    let scale = 300.0;

    for (let u = 0.0, i = 0; i <= stepU; u += du, i++) { // Winkel / Kreis
        for (let v = 0.0, j = 0; j <= stepV; v += dv, j++) { // Höhe
            let iVertex = i * (stepV + 1) + j; // ==> Anzahl der Knoten

            let x = r * Math.cos(u);
            let y = v - 0.5;
            let z = r * Math.sin(u);

            // Punkte und Farbe definieren
            vertices.push(x * scale); // X Koordinate
            vertices.push(y * scale); // Y Koordinate
            vertices.push(z * scale); // Z Koordinate
            vertices.push(0.0, 1.0, 0.0, 1); // Farbwert

            vertices.push(1.0, 1.0, 1.0); // Normale

            addElements(i, j, iVertex, stepV);
        }
    }
}

/**
 * Kegel (Erzeugung mit parametrisierter Funktion)
 */
function getFigure2VerticesPointsArray() {
    clearArrays();

    // Parameter Winkel/Grad
    let stepU = 32;
    let du = 2 * pi / stepU;

    // Parameter Höhe
    let stepV = 16;
    let dv = 1 / stepV;

    // Parameter Radius
    let dr = 1 / stepV; // Es bietet sich an, hier stepV zu nutzen

    let scale = 300.0;
    let scaleOpeningAngle = 1.0;

    for (let u = 0.0, i = 0; i <= stepU; u += du, i++) { // Winkel / Kreis
        for (let v = 0.0, r = 1.0, j = 0; j <= stepV; v += dv, r -= dr, j++) { // Höhe
            let iVertex = i * (stepV + 1) + j; // ==> Anzahl der Knoten

            let rScale = r * scaleOpeningAngle;

            let x = rScale * Math.cos(u);
            let y = v - 0.5;
            let z = rScale * Math.sin(u);

            // Punkte und Farbe definieren
            vertices.push(x * scale); // X Koordinate
            vertices.push(y * scale); // Y Koordinate
            vertices.push(z * scale); // Z Koordinate
            vertices.push(0.0, 1.0, 0.0, 1); // Farbwert

            // Normalen definieren
            let vertexLength = Math.sqrt(x * y * z);
            if (vertexLength === 0) {
                vertices.push(0.0, 0.0, 0.0); // Normale
            } else {
                vertices.push(x / vertexLength, y / vertexLength, z / vertexLength); // Normale
            }

            addElements(i, j, iVertex, stepV);
        }
    }
}

/**
 * Kugel (Erzeugung mit parametrisierter Funktion)
 */
function getFigure3VerticesPointsArray() {
    clearArrays();

    // Parameter Winkel/Grad
    let stepU = 32;
    let du = 2 * pi / stepU;

    // Parameter Höhe
    let stepV = 32;
    let dv = pi / stepV;

    let r = 0.6;
    let scale = 300.0;

    for (let u = 0.0, i = 0; i <= stepU; u += du, i++) { // Winkel / Kreis
        for (let v = 0.0, j = 0; j <= stepV; v += dv, j++) { // Höhe
            let iVertex = i * (stepV + 1) + j; // ==> Anzahl der Knoten

            let x = r * Math.sin(v) * Math.cos(u);
            let z = r * Math.cos(v);
            let y = r * Math.sin(v) * Math.sin(u);

            // Punkte und Farbe definieren
            vertices.push(x * scale); // X Koordinate
            vertices.push(y * scale); // Y Koordinate
            vertices.push(z * scale); // Z Koordinate
            vertices.push(0.0, 1.0, 0.0, 1); // Farbwert

            // Normalen definieren
            let vertexLength = Math.sqrt(x * y * z);
            if (vertexLength === 0) {
                vertices.push(0.0, 0.0, 0.0); // Normale
            } else {
                vertices.push(x / vertexLength, z / vertexLength, y / vertexLength); // Normale
            }

            addElements(i, j, iVertex, stepV);
        }
    }
}

/**
 * Torus (Erzeugung mit parametrisierter Funktion)
 */
function getFigure4VerticesPointsArray() {
    clearArrays();

    // Parameter Winkel/Grad
    let stepU = 32;
    let du = 2 * pi / stepU;

    // Parameter Höhe
    let stepV = 32;
    let dv = 2 * pi / stepV;

    let rTorsoInnen = 0.5;
    let rRing = 0.3;
    let scale = 300;

    for (let u = 0.0, i = 0; i <= stepU; u += du, i++) { // Winkel / Kreis
        for (let v = 0.0, j = 0; j <= stepV; v += dv, j++) { // Höhe
            let iVertex = i * (stepV + 1) + j; // ==> Anzahl der Knoten

            let x = (rTorsoInnen + Math.cos(u) * rRing) * Math.cos(v);
            let z = rRing * Math.sin(u);
            let y = (rTorsoInnen + Math.cos(u) * rRing) * Math.sin(v);

            // Punkte und Farbe definieren
            vertices.push(x * scale); // X Koordinate
            vertices.push(y * scale); // Y Koordinate
            vertices.push(z * scale); // Z Koordinate
            vertices.push(0.0, 1.0, 0.0, 1); // Farbwert

            vertices.push(1.0, 1.0, 1.0); // Normale

            addElements(i, j, iVertex, stepV);
        }
    }
}