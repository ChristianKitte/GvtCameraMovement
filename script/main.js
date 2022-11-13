/**
 * Belegt den Ausgabebuffer des aktuellen WebGL Programms mit den aktuellen Daten neu und zeichnet die
 * Ausgabe. Das WebGL Programm muss zuvor bereits initialisiert und konfiguriert worden sein.
 */
function RefreshWaves(modellNr) {
    // Arrays für neue Ausgabe füllen
    switch (modellNr) {
        case 1:
            getFigure1VerticesPointsArray();
            break;
        case 2:
            getFigure2VerticesPointsArray();
            break;
        case 3:
            getFigure3VerticesPointsArray();
            break;
        case 4:
            getFigure4VerticesPointsArray();
            break;
    }

    // Buffer für die Punkte erzeugen und laden
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    // Buffer für die Normalen erzeugen und laden
    //var nbo = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, nbo);

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
    //gl.disableVertexAttribArray(aColor);

    // Wert des deaktivierten Attributs aColor überschreiben (Es kann auch ein Array übergeben werden)
    //gl.vertexAttrib3f(aColor, 0.0, 0.0, 0.0);

    // Zeiger erzeugen und konfigurieren
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 10 * 4, 0);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 10 * 4, 3 * 4);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 10 * 4, 7 * 4);

    // alte Ausgabe löschen
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    // Daten binden
    //gl.bufferData(gl.ARRAY_BUFFER, normalVector, gl.STATIC_DRAW);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, verticesIndexTriangle, gl.STATIC_DRAW);
    ibo.numerOfEmements = verticesIndexTriangle.length;

    // Ausgabe
    gl.drawElements(gl.TRIANGLES, ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);

    if (showLine) {
        // Daten binden / Wechseln
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, verticesIndexLine, gl.STATIC_DRAW);
        ibo.numerOfEmements = verticesIndexLine.length;

        // Ausgabe
        gl.disableVertexAttribArray(aColor);
        gl.drawElements(gl.LINES, ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);
    }
}

/**
 * Startet die WebGL Anwendung und erste Ausgabe der Grafik
 */
iniWebGLApp();