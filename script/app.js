var app = (function () {
    let models = [];

    function start() {
        init();
    }

    function init() {
        models = [];
        model.fillstyle = fillstyle;

        initModels();
        render();
    }

    function initModels() {
        if (activeModel === 1) {
            createModel("modCylinder");
        } else if (activeModel === 2) {
            createModel("modKegel");
        } else if (activeModel === 3) {
            createModel("modSphere");
        } else if (activeModel === 4) {
            createModel("modTorus");
        } else if (activeModel === 5) {
            createModel("modRecursiveSphere");
        }
    }

    function createModel(modelName) {
        let model = {};
        initDataAndBuffers(model, modelName);

        // Model-View Matrix vorbereiten
        //model.mvMatrix = mat4.create();

        models.push(model);
    }

    function initDataAndBuffers(model, modelName) {
        this[modelName]['createModellVertex'].apply(model);

        // Buffer für die Punkte erzeugen und laden
        model.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, model.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);

        // Buffer für die Indizes erzeugen und laden
        model.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexTriangle), gl.STATIC_DRAW);
        model.ibo.numerOfEmements = model.verticesIndexTriangle.length;

        // posAttrib erzeugen und verwenden
        aPosition = gl.getAttribLocation(program, 'aPosition');
        gl.enableVertexAttribArray(aPosition);

        aNormal = gl.getAttribLocation(program, 'aNormal');
        gl.enableVertexAttribArray(aNormal);

        aColor = gl.getAttribLocation(program, 'aColor');
        gl.enableVertexAttribArray(aColor);

        // Zeiger erzeugen und konfigurieren
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 10 * 4, 0);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 10 * 4, 3 * 4);
        gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 10 * 4, 7 * 4);
    }

    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        for (var i = 0; i < models.length; i++) {
            drawModel(models[i]);
        }
    }

    function drawModel(model) {
        // Knotendaten verfügbar machen und binden
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
        // Indexarray für die Linien binden und ausgeben
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexTriangle), gl.STATIC_DRAW);

        model.ibo.numerOfEmements = model.verticesIndexTriangle.length;
        gl.drawElements(gl.TRIANGLES, model.ibo.numerOfEmements, gl.UNSIGNED_SHORT, 0);
    }

    return {
        start: start
    }

}());