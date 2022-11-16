var app = (function () {
    let models = [];

    let camera = {
        // Initial position of the camera.
        eye: [0, 1, 4],
        // Point to look at.
        center: [0, 0, 0],
        // Roll and pitch of the camera.
        up: [0, 1, 0],
        // Opening angle given in radian.
        // radian = degree*2*PI/360.
        fovy: 60.0 * Math.PI / 180,
        // Camera near plane dimensions:
        // value for left right top bottom in projection.
        lrtb: 2.0,
        // View matrix.
        vMatrix: glMatrix.mat4.create(),
        // Projection matrix.
        pMatrix: glMatrix.mat4.create(),
        // Projection types: ortho, perspective, frustum.
        projectionType: "ortho",
        // Angle to Z-Axis for camera when orbiting the center
        // given in radian.
        zAngle: 0,
        // Distance in XZ-Plane from center when orbiting.
        distance: 14,
    };

    function start() {
        init();
    }

    function init() {
        models = [];

        WebGlInstance.webGL.create();
        camera.aspect = WebGlInstance.webGL.gl.viewportWidth / WebGlInstance.webGL.gl.viewportHeight;

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
            //createModel("modRecursiveSphere");
        }
    }

    function createModel(modelName) {
        let model = {};
        initDataAndBuffers(model, modelName);

        // Model-View Matrix vorbereiten
        // model.mvMatrix = glMatrix.mat4.create();

        initTransformations(model, [0, 0, 0], [0, 0, 0], [1, 1, 1]);

        models.push(model);
    }

    function initTransformations(model, translate, rotate, scale) {
        // Store transformation vectors.
        model.translate = translate;
        model.rotate = rotate;
        model.scale = scale;

        // Create and initialize Model-Matrix.
        model.mMatrix = glMatrix.mat4.create();

        // Create and initialize Model-View-Matrix.
        model.mvMatrix = glMatrix.mat4.create();
    }

    function updateTransformations(model) {

        // Use shortcut variables.
        var mMatrix = model.mMatrix;
        var mvMatrix = model.mvMatrix;

        glMatrix.mat4.copy(mvMatrix, camera.vMatrix);
    }

    function initDataAndBuffers(model, modelName) {
        this[modelName]['createModellVertex'].apply(model);

        // Buffer für die Punkte erzeugen und laden
        model.vbo = WebGlInstance.webGL.gl.createBuffer();
        WebGlInstance.webGL.gl.bindBuffer(WebGlInstance.webGL.gl.ARRAY_BUFFER, model.vbo);
        WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ARRAY_BUFFER, new Float32Array(model.vertices), WebGlInstance.webGL.gl.STATIC_DRAW);

        // Buffer für die Indizes erzeugen und laden
        model.ibo = WebGlInstance.webGL.gl.createBuffer();
        WebGlInstance.webGL.gl.bindBuffer(WebGlInstance.webGL.gl.ELEMENT_ARRAY_BUFFER, model.ibo);
        WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexTriangle), WebGlInstance.webGL.gl.STATIC_DRAW);
        model.ibo.numerOfEmements = model.verticesIndexTriangle.length;

        // posAttrib erzeugen und verwenden
        aPosition = WebGlInstance.webGL.gl.getAttribLocation(WebGlInstance.webGL.program, 'aPosition');
        WebGlInstance.webGL.gl.enableVertexAttribArray(aPosition);

        aNormal = WebGlInstance.webGL.gl.getAttribLocation(WebGlInstance.webGL.program, 'aNormal');
        WebGlInstance.webGL.gl.enableVertexAttribArray(aNormal);

        aColor = WebGlInstance.webGL.gl.getAttribLocation(WebGlInstance.webGL.program, 'aColor');
        WebGlInstance.webGL.gl.enableVertexAttribArray(aColor);

        // Zeiger erzeugen und konfigurieren
        WebGlInstance.webGL.gl.vertexAttribPointer(aPosition, 3, WebGlInstance.webGL.gl.FLOAT, false, 10 * 4, 0);
        WebGlInstance.webGL.gl.vertexAttribPointer(aColor, 4, WebGlInstance.webGL.gl.FLOAT, false, 10 * 4, 3 * 4);
        WebGlInstance.webGL.gl.vertexAttribPointer(aNormal, 3, WebGlInstance.webGL.gl.FLOAT, false, 10 * 4, 7 * 4);
    }

    function render() {
        WebGlInstance.webGL.gl.clear(WebGlInstance.webGL.gl.COLOR_BUFFER_BIT | WebGlInstance.webGL.gl.DEPTH_BUFFER_BIT);

        setProjection();

        glMatrix.mat4.identity(camera.vMatrix);
        glMatrix.mat4.rotate(camera.vMatrix, camera.vMatrix, Math.PI * 1 / 4, [1, 0, 0]);

        for (var i = 0; i < models.length; i++) {
            // Update modelview for model.
            updateTransformations(models[i]);
            glMatrix.mat4.copy(models[i].mvMatrix, camera.vMatrix);
            // Set uniforms for model.
            WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.mvMatrixUniform, false, models[i].mvMatrix);

            drawModel(models[i]);
        }
    }

    function setProjection() {
        // Set projection Matrix.
        switch (camera.projectionType) {
            case("ortho"):
                var v = camera.lrtb;
                glMatrix.mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
                break;
        }

        // Set projection uniform.
        WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.pMatrixUniform, false, camera.pMatrix);
    }

    function drawModel(model) {
        // Knotendaten verfügbar machen und binden
        WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ARRAY_BUFFER, new Float32Array(model.vertices), WebGlInstance.webGL.gl.STATIC_DRAW);
        // Indexarray für die Linien binden und ausgeben
        WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexTriangle), WebGlInstance.webGL.gl.STATIC_DRAW);

        model.ibo.numerOfEmements = model.verticesIndexTriangle.length;

        WebGlInstance.webGL.gl.drawElements(WebGlInstance.webGL.gl.TRIANGLES, model.ibo.numerOfEmements, WebGlInstance.webGL.gl.UNSIGNED_SHORT, 0);
        if (showLine) {
            // Indexarary für die Linien binden (eigentlich wechseln)
            WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexLine), WebGlInstance.webGL.gl.STATIC_DRAW);

            model.ibo.numerOfEmements = model.verticesIndexLine.length;

            // Ausgabe
            WebGlInstance.webGL.gl.disableVertexAttribArray(aColor);
            WebGlInstance.webGL.gl.drawElements(WebGlInstance.webGL.gl.LINES, model.ibo.numerOfEmements, WebGlInstance.webGL.gl.UNSIGNED_SHORT, 0);
        }
    }

    return {
        start: start
    }

}());