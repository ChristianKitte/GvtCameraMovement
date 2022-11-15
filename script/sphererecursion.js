let recursiveVertex = 0;

let vbox;
let ibox;
let aPositionx;
let aNormalx;
let aColorx;

function start() {
    vertices = [];
    normals = [];
    verticesIndexLinex = [];
    verticesIndexTriangle = [];

    // Buffer für die Punkte erzeugen und laden
    vbox = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbox);

    // Buffer für die Indizes erzeugen und laden
    ibox = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibox);

    // posAttrib erzeugen und verwenden
    aPositionx = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPositionx);

    aNormalx = gl.getAttribLocation(program, 'aNormal');
    gl.enableVertexAttribArray(aNormalx);

    aColorx = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(aColorx);

    // Zeiger erzeugen und konfigurieren
    gl.vertexAttribPointer(aPositionx, 3, gl.FLOAT, false, 10 * 4, 0);
    gl.vertexAttribPointer(aColorx, 4, gl.FLOAT, false, 10 * 4, 3 * 4);
    gl.vertexAttribPointer(aNormalx, 3, gl.FLOAT, false, 10 * 4, 7 * 4);

    // alte Ausgabe löschen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
}

function drawGraficX() {
    // Knotendaten verfügbar machen und binden
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Indexarray für die Linien binden und ausgeben
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(verticesIndexTriangle), gl.STATIC_DRAW);
    ibox.numerOfEmements = verticesIndexTriangle.length;
    gl.drawElements(gl.TRIANGLES, ibox.numerOfEmements, gl.UNSIGNED_SHORT, 0);

    if (showLine) {
        // Indexarary für doe Linien binden (eigentlich wechseln)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(verticesIndexLine), gl.STATIC_DRAW);
        ibox.numerOfEmements = verticesIndexLine.length;

        // Ausgabe
        gl.disableVertexAttribArray(aColorx);
        gl.drawElements(gl.LINES, ibox.numerOfEmements, gl.UNSIGNED_SHORT, 0);
    }
}

function buildRecursionSphere(recursionDeep) {
    start();

    recursiveVertex = 0;

    subdivide(1.0, 0.0, 0.0,
        0.0, -1.0, 0.0,
        0.0, 0.0, 0.0,
        recursionDeep);
}

function addSphereElements(v1x, v1y, v1z,
                           v2x, v2y, v2z,
                           v3x, v3y, v3z) {

    let scale = 100;

    // Punkt 1
    vertices.push(v1x * scale); // X Koordinate
    vertices.push(v1y * scale); // Y Koordinate
    vertices.push(v1z * scale); // Z Koordinate
    vertices.push(1.0, 0.0, 0.0, 1); // Farbwert
    vertices.push(1.0, 1.0, 1.0); // Normale
    recursiveVertex++;

    // Punkt 2
    vertices.push(v2x * scale); // X Koordinate
    vertices.push(v2y * scale); // Y Koordinate
    vertices.push(v2z * scale); // Z Koordinate
    vertices.push(0.0, 1.0, 0.0, 1); // Farbwert
    vertices.push(1.0, 1.0, 1.0); // Normale
    recursiveVertex++;

    // Punkt 3
    vertices.push(v3x * scale); // X Koordinate
    vertices.push(v3y * scale); // Y Koordinate
    vertices.push(v3z * scale); // Z Koordinate
    vertices.push(0.0, 0.0, 1.0, 1); // Farbwert
    vertices.push(1.0, 1.0, 1.0); // Normale
    recursiveVertex++;

    // Linie 1
    verticesIndexLine.push(recursiveVertex - 3);
    verticesIndexLine.push(recursiveVertex - 2);
    // Linie 2
    verticesIndexLine.push(recursiveVertex - 2);
    verticesIndexLine.push(recursiveVertex - 1);
    // Linie 3
    verticesIndexLine.push(recursiveVertex - 1);
    verticesIndexLine.push(recursiveVertex - 3);

    // Dreieck
    verticesIndexTriangle.push(recursiveVertex - 3);
    verticesIndexTriangle.push(recursiveVertex - 2);
    verticesIndexTriangle.push(recursiveVertex - 1);

    drawGraficX();
}

function subdivide(v1x, v1y, v1z,
                   v2x, v2y, v2z,
                   v3x, v3y, v3z,
                   level) {

    if (level === 0) {
        // Reached desired tessellation level, emit triangle.
        addSphereElements(v1x, v1y, v1z,
            v2x, v2y, v2z,
            v3x, v3y, v3z);
    } else {
        // Calculate middle of first edge...
        v12x = 0.5 * (v1x + v2x);
        v12y = 0.5 * (v1y + v2y);
        v12z = 0.5 * (v1z + v2z);

        // ... and renormalize it to get a point on the sphere.
        let s = 1.0 / Math.sqrt(v12x * v12x + v12y * v12y + v12z * v12z);
        v12x *= s;
        v12y *= s;
        v12z *= s;

        // Same thing for the second
        v13x = 0.5 * (v1x + v3x);
        v13y = 0.5 * (v1y + v3y);
        v13z = 0.5 * (v1z + v3z);

        s = 1.0 / Math.sqrt(v13x * v13x + v13y * v13y + v13z * v13z);
        v13x *= s;
        v13y *= s;
        v13z *= s;

        // Same thing for the third.
        v23x = 0.5 * (v2x + v3x);
        v23y = 0.5 * (v2y + v3y);
        v23z = 0.5 * (v2z + v3z);

        s = 1.0 / Math.sqrt(v23x * v23x + v23y * v23y + v23z * v23z);
        v23x *= s;
        v23y *= s;
        v23z *= s;

        // Make the recursive calls.
        subdivide(
            v1x, v1y, v1z,
            v12x, v12y, v12z,
            v13x, v13y, v13z,
            level - 1);
        subdivide(
            v12x, v12y, v12z,
            v2x, v2y, v2z,
            v23x, v23y, v23z,
            level - 1);
        subdivide(
            v13x, v13y, v13z,
            v23x, v23y, v23z,
            v3x, v3y, v3z,
            level - 1);
        subdivide(
            v12x, v12y, v12z,
            v23x, v23y, v23z,
            v13x, v13y, v13z,
            level - 1);
    }
}