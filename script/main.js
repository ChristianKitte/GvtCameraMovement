function drawGrafic() {
    // Buffer für die Punkte erzeugen und laden
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // Buffer für die Indizes erzeugen und laden
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // posAttrib erzeugen und verwenden
    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);

    var aNormal = gl.getAttribLocation(program, 'aNormal');
    gl.enableVertexAttribArray(aNormal);

    var aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(aColor);

    // Zeiger erzeugen und konfigurieren
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 10 * 4, 0);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 10 * 4, 3 * 4);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 10 * 4, 7 * 4);

    // alte Ausgabe löschen
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    // Knotendaten verfügbar machen und binden
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Indexarray für die Linien binden und ausgeben
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(verticesIndexTriangle), gl.STATIC_DRAW);
    ibo.numerOfEmements = verticesIndexTriangle.length;
    gl.drawElements(gl.TRIANGLES, ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);

    if (showLine) {
        // Indexarary für doe Linien binden (eigentlich wechseln)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(verticesIndexLine), gl.STATIC_DRAW);
        ibo.numerOfEmements = verticesIndexLine.length;

        // Ausgabe
        gl.disableVertexAttribArray(aColor);
        gl.drawElements(gl.LINES, ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);
    }
}

/**
 * Belegt den Ausgabebuffer des aktuellen WebGL Programms mit den aktuellen Daten neu und zeichnet die
 * Ausgabe. Das WebGL Programm muss zuvor bereits initialisiert und konfiguriert worden sein.
 */
function RefreshWaves(modellNr) {
    // Arrays für neue Ausgabe füllen
    switch (modellNr) {
        case 1:
            getFigure1VerticesPointsArray();
            drawGrafic();
            break;
        case 2:
            getFigure2VerticesPointsArray();
            drawGrafic();
            break;
        case 3:
            getFigure3VerticesPointsArray();
            drawGrafic();
            break;
        case 4:
            getFigure4VerticesPointsArray();
            drawGrafic();
            break;
        case 5:
            buildRecursionSphere(recursionDeep);
            //drawGrafic();
            break;
    }
}



/**
 * Startet die WebGL Anwendung und erste Ausgabe der Grafik
 */
iniWebGLApp();
