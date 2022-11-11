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
    }

    // Buffer für die Punkte erzeugen und laden
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // posAttrib erzeugen und verwenden
    var aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(program, 'aColor');
    gl.enableVertexAttribArray(aColor);

    // Zeiger erzeugen und konfigurieren
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 7 * 4, 0);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 7 * 4, 3 * 4);

    // alte Ausgabe löschen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    // Ausgabe
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, verticesIndexTriangle, gl.STATIC_DRAW);
    ibo.numerOfEmements = verticesIndexTriangle.length;

    gl.drawElements(gl.TRIANGLES, ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);

    if (showLine) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, verticesIndexLine, gl.STATIC_DRAW);
        ibo.numerOfEmements = verticesIndexLine.length;
        gl.disableVertexAttribArray(aColor);
        gl.drawElements(gl.LINES, ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);
    }



}

/**
 * Startet die WebGL Anwendung und erste Ausgabe der Grafik
 */
iniWebGLApp();
