/**
 * Zur vereinfachten Nutzung und als kleine Optimierung
 * @type {number} Die Zahl PI aus Math.PI
 */
const pi = Math.PI;

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
    // Define index for one Line
    if (i > 0 && j > 0) { // Radien
        pushIndexLine(iVertex - 1);
        pushIndexLine(iVertex);
    }
    if (i > 0 && j > 0) { // Ring
        pushIndexLine(iVertex - (stepV + 1));
        pushIndexLine(iVertex);
    }

    // Define index for two triangles.
    if (j > 0 && i > 0) {
        pushIndexTriangle(iVertex);
        pushIndexTriangle(iVertex - 1);
        pushIndexTriangle(iVertex - (stepV + 1));
        //
        pushIndexTriangle(iVertex - 1);
        pushIndexTriangle(iVertex - (stepV + 1) - 1);
        pushIndexTriangle(iVertex - (stepV + 1));
    }
}

/**
 * Zylinder
 */
function getFigure1VerticesPointsArray() {
    vertices = new Float32Array([]);
    verticesIndexLine = new Uint16Array([]);
    verticesIndexTriangle = new Uint16Array([]);

    // Parameter Winkel/Grad
    let stepU = 32
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
            pushVertices(x * scale); // X Koordinate
            pushVertices(y * scale); // Y Koordinate
            pushVertices(z * scale); // Z Koordinate
            pushVertices(0.0, 1.0, 0.0, 1); // Farbwert
            pushVertices(1.0, 1.0, 1.0); // Normale
            addElements(i, j, iVertex, stepV);
        }
    }
}

/**
 * Kegel
 */
function getFigure2VerticesPointsArray() {
    vertices = new Float32Array([]);
    normalVector = new Float32Array([]);
    verticesIndexLine = new Uint16Array([]);
    verticesIndexTriangle = new Uint16Array([]);

    // Parameter Winkel/Grad
    let stepU = 32
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

            let vertexLength = Math.sqrt(x * y * z);
            pushNormalVector(x / vertexLength, y / vertexLength, z / vertexLength);

            // Punkte und Farbe definieren
            pushVertices(x * scale); // X Koordinate
            pushVertices(y * scale); // Y Koordinate
            pushVertices(z * scale); // Z Koordinate
            pushVertices(0.0, 1.0, 0.0, 1); // Farbwert

            if (vertexLength === 0) {
                pushVertices(0.0, 0.0, 0.0); // Normale
            } else {
                pushVertices(x / vertexLength, y / vertexLength, z / vertexLength); // Normale
            }

            addElements(i, j, iVertex, stepV);
        }
    }
}

/**
 * Kugel (Erzeugung mit parametrisierter Funktion
 */
function getFigure3VerticesPointsArray() {
    vertices = new Float32Array([]);
    verticesIndexLine = new Uint16Array([]);
    verticesIndexTriangle = new Uint16Array([]);

    // Parameter Winkel/Grad
    let stepU = 32
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

            let vertexLength = Math.sqrt(x * y * z);
            pushNormalVector(x / vertexLength, y / vertexLength, z / vertexLength);

            // Punkte und Farbe definieren
            pushVertices(x * scale); // X Koordinate
            pushVertices(y * scale); // Y Koordinate
            pushVertices(z * scale); // Z Koordinate
            pushVertices(0.0, 1.0, 0.0, 1); // Farbwert

            if (vertexLength === 0) {
                pushVertices(0.0, 0.0, 0.0); // Normale
            } else {
                pushVertices(x / vertexLength, z / vertexLength, y / vertexLength); // Normale
            }

            addElements(i, j, iVertex, stepV);
        }
    }
}

/**
 * Torus
 */
function getFigure4VerticesPointsArray() {
    vertices = new Float32Array([]);
    verticesIndexLine = new Uint16Array([]);
    verticesIndexTriangle = new Uint16Array([]);

    // Parameter Winkel/Grad
    let stepU = 32
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
            pushVertices(x * scale); // X Koordinate
            pushVertices(y * scale); // Y Koordinate
            pushVertices(z * scale); // Z Koordinate
            pushVertices(0.0, 1.0, 0.0, 1); // Farbwert
            pushVertices(1.0, 1.0, 1.0); // Normale
            addElements(i, j, iVertex, stepV);
        }
    }
}