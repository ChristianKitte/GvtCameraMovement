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
        if (activeModel === 0) {
            createModel("modCylinder", [0, -2, 0], [0, 0, 0], [1, 1, 1]);
            createModel("modSphere", [-1, 0, 0], [0, 0, 0], [1, 1, 1]);
            createModel("modKegel", [1, 1, -0.5], [0, 0, 0], [1, 1, 1]);
            createModel("modTorus", [1, -1, 0], [0, 0, 0], [1, 1, 1]);
        } else if (activeModel === 1) {
            createModel("modCylinder", [0, 0, 0], [0, 0, 0], [1, 1, 1]);
        } else if (activeModel === 2) {
            createModel("modKegel", [0, 0, 0], [0, 0, 0], [1, 1, 1]);
        } else if (activeModel === 3) {
            createModel("modSphere", [0, 0, 0], [0, 0, 0], [1, 1, 1]);
        } else if (activeModel === 4) {
            createModel("modTorus", [0, 0, 0], [0, 0, 0], [1, 1, 1]);
        } else if (activeModel === 5) {
            //createModel("modRecursiveSphere");
        }
    }

    function createModel(modelName, translate, rotate, scale) {
        let model = {};

        initDataAndBuffers(model, modelName);
        initTransformations(model, translate, rotate, scale);

        models.push(model);
    }

    function updateTransformations(model) {
        // Use shortcut variables.
        var mMatrix = model.mMatrix;
        var mvMatrix = model.mvMatrix;

        // Reset matrices to identity.
        glMatrix.mat4.identity(mMatrix);
        glMatrix.mat4.identity(mvMatrix);

        // Translate.
        glMatrix.mat4.translate(mMatrix, mMatrix, model.translate);

        // Scale
        glMatrix.mat4.scale(mMatrix, mMatrix, model.scale);

        // Combine view and model matrix
        // by matrix multiplication to mvMatrix.
        glMatrix.mat4.multiply(mvMatrix, camera.vMatrix, mMatrix);
    }

    function initTransformations(model, translate, rotate, scale) {
        // Store transformation vectors.
        model.translate = translate;
        model.rotate = rotate;
        model.scale = scale;

        // Model-Matrix und Model-View Matrix zum Model hinzufügen.
        model.mMatrix = glMatrix.mat4.create();
        model.mvMatrix = glMatrix.mat4.create();
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

    function setProjection() {
        // Set projection Matrix.
        switch (camera.projectionType) {
            case("ortho"):
                var v = camera.lrtb;
                glMatrix.mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
                break;
            case("frustum"):
                var v = camera.lrtb;
                glMatrix.mat4.frustum(camera.pMatrix, -v / 2, v / 2, -v / 2, v / 2, 1, 10);
                break;
            case("perspective"):
                glMatrix.mat4.perspective(camera.pMatrix, camera.fovy,
                    camera.aspect, 1, 10);
                break;
        }

        // Set projection uniform.
        WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.pMatrixUniform, false, camera.pMatrix);
    }

    function setCamera() {
        // Calculate x,z position/eye of camera orbiting the center.
        var x = 0, z = 2;
        camera.eye[x] = camera.center[x];
        camera.eye[z] = camera.center[z];
        camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
        camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
    }

    function render() {
        WebGlInstance.webGL.gl.clear(WebGlInstance.webGL.gl.COLOR_BUFFER_BIT | WebGlInstance.webGL.gl.DEPTH_BUFFER_BIT);

        // setzt die Projektionsmatrix der Kamera
        setProjection();

        //setCamera();
        //glMatrix.mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

        for (var i = 0; i < models.length; i++) {
            // Update modelview for model.
            updateTransformations(models[i]);

            // Set uniforms for model.
            WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.mvMatrixUniform, false, models[i].mvMatrix);

            drawModel(models[i]);
        }
    }

    function drawModel(model) {
        WebGlInstance.webGL.gl.enableVertexAttribArray(aColor);

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