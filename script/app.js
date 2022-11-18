var app = (function () {
    let models = [];

    let camera = {
        // Initial position of the camera.
        eye: [0, 1, 4],
        // Point to look at.
        center: [0.1, -.5, -2],
        // Roll and pitch of the camera.
        up: [0, 1, 0],
        // Opening angle given in radian.
        // radian = degree*2*PI/360.
        fovy: 60.0 * Math.PI / 180,
        // Camera near plane dimensions:
        // value for left right top bottom in projection.
        lrtb: 3.0,
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

    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        if (keyName === 'Control') {
            // do not alert when only Control key is pressed.
            return;
        }

        switch (keyName) {
            case "ArrowUp": // ==> nach oben über die Szene
                camera.zAngle += Math.PI / 36;
                render();
                break;
            case "ArrowDown": // ==> nach unten über die Szene
                camera.zAngle -= Math.PI / 36;
                render();
                break;
            case "ArrowLeft": // ==> links um die Szene

                render();
                break;
            case "ArrowRight": // ==> Rechts um die Szene

                render();
                break;

            case "o": // +y
                camera.projectionType = "ortho";
                projektionsText.innerText = "Projektionstyp: Orthogonal";
                render();
                break;
            case "p": // +y
                camera.projectionType = "perspective";
                projektionsText.innerText = "Projektionstyp: Perspektivisch";
                render();
                break;
            case "f": // +y
                camera.projectionType = "frustum";
                projektionsText.innerText = "Frustum: ";
                render();
                break;

            case "w": // +y
                camera.center[1] = camera.center[1] - 0.5;
                render();
                break;
            case "s": // -y
                camera.center[1] = camera.center[1] + 0.5;
                render();
                break;
            case "a": // -x
                camera.center[0] = camera.center[0] + 0.5;
                render();
                break;
            case "d": // x
                camera.center[0] = camera.center[0] - 0.5;
                render();
                break;
            case "Z":
                switch (camera.projectionType) {
                    case("ortho"):
                        camera.lrtb += 0.1;
                        render();
                        break;
                    case("frustum"):
                        camera.lrtb += 0.1;
                        render();
                        break;
                    case("perspective"):
                        camera.fovy += 5 * Math.PI / 180;
                        render();
                        break;
                }
                break;
            case "z":
                switch (camera.projectionType) {
                    case("ortho"):
                        camera.lrtb -= 0.1;
                        render();
                        break;
                    case("frustum"):
                        camera.lrtb -= 0.1;
                        render();
                        break;
                    case("perspective"):
                        camera.fovy -= 5 * Math.PI / 180;
                        render();
                        break;
                }
                break;
            case "n": // n ==> Radius kleiner
                camera.distance++;
                render();
                break;
            case "N": // shift-n ==> Radius größer
                camera.distance--;
                render();
                break;
        }


    }, false);

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
            createModel("modRecursiveSphere", [0, 0, 0], [0.0, 0.0, 0], [1, 1, 1]);
        }
    }

    function createModel(modelName, translate, rotate, scale) {
        let model = {};

        initDataAndBuffers(model, modelName);
        initTransformations(model, translate, rotate, scale);

        models.push(model);
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

    // Dem Modell Eigenschaften für Translate, Rotate und Scale Vector
    // sowie für Model, View Scale Matrix hinzufügen
    function initTransformations(model, translate, rotate, scale) {
        model.translate = translate;
        model.rotate = rotate;
        model.scale = scale;

        model.modelMatrix = glMatrix.mat4.create();
        model.viewMatrix = glMatrix.mat4.create();
        model.scaleMatrix = glMatrix.mat4.create();
    }

    // Konfiguriert und setzt die Matrizen für Model, View und Projektion und gibt die hinterlegten
    // Modelle aus
    function render() {
        // Löschen der alten Ausgabe
        WebGlInstance.webGL.gl.clear(WebGlInstance.webGL.gl.COLOR_BUFFER_BIT | WebGlInstance.webGL.gl.DEPTH_BUFFER_BIT);

        // konfiguriert und setzt die globale Projektionsmatrix der Kamera (Projection Matrix)
        setCameraProjectionMatrix();

        // konfiguriert und setzt die globale Viewmatrix der Kamera (View Matrix)
        setCameraViewMatrix();

        // Alle Modelle durchlaufen, Eigenschaften für Rotation, Scale und Translation für das
        // jeweils aktuelle Modell aktualisieren und das Modell ausgeben
        for (var i = 0; i < models.length; i++) {
            // Erstellt und setzt die Model Matrix für das aktuelle Modell nach den aktuell eingestellten Werten
            setModelTransformationForModel(models[i]);
            // Ausgabe des Modells
            drawModel(models[i]);
        }
    }

    // Legt und setzt die Projektion Matrix nach dem gewählten Projektionstyp fest
    function setCameraProjectionMatrix() {
        let v = camera.lrtb;

        // Erstellt die Projektionsmatrix auf Basis des in projectionType eingestellten Wertes
        switch (camera.projectionType) {
            case("ortho"):
                glMatrix.mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 100);
                break;
            case("frustum"):
                glMatrix.mat4.frustum(camera.pMatrix, -v / 2, v / 2, -v / 2, v / 2, 1, 100);
                break;
            case("perspective"):
                glMatrix.mat4.perspective(camera.pMatrix, camera.fovy, camera.aspect, 1, 100);
                break;
        }

        WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.projectionMatrix, false, camera.pMatrix);
    }

    // Legt und setzt die View Matrix fest
    function setCameraViewMatrix() {
        // Calculate x,z position/eye of camera orbiting the center.
        var x = -10, z = -100;

        camera.eye[x] = camera.center[x];
        camera.eye[z] = camera.center[z];
        camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
        camera.eye[z] += camera.distance * Math.cos(camera.zAngle);

        glMatrix.mat4.identity(camera.vMatrix);
        glMatrix.mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

        WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.viewMatrix, false, camera.vMatrix);
    }

    // Erstellt und setzt die Model Matrix für das übergebene Modell
    function setModelTransformationForModel(model) {
        let mMatrix = model.modelMatrix;

        glMatrix.mat4.identity(mMatrix);
        // Scale
        glMatrix.mat4.scale(mMatrix, mMatrix, model.scale);
        // Rotate
        glMatrix.mat4.rotate(mMatrix, mMatrix, 0.002, model.rotate);
        // Translate.
        glMatrix.mat4.translate(mMatrix, mMatrix, model.translate);

        WebGlInstance.webGL.gl.uniformMatrix4fv(WebGlInstance.webGL.program.modelMatrix, false, mMatrix);
    }

    // Gibt das übergebene Modell aus
    function drawModel(model) {
        WebGlInstance.webGL.gl.enableVertexAttribArray(aColor);

        // Knotendaten verfügbar machen und binden
        WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ARRAY_BUFFER, new Float32Array(model.vertices), WebGlInstance.webGL.gl.STATIC_DRAW);
        // Indexarray für die Linien binden und ausgeben
        WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexTriangle), WebGlInstance.webGL.gl.STATIC_DRAW);

        model.ibo.numerOfEmements = model.verticesIndexTriangle.length;

        WebGlInstance.webGL.gl.drawElements(WebGlInstance.webGL.gl.TRIANGLES, model.ibo.numerOfEmements, WebGlInstance.webGL.gl.UNSIGNED_SHORT, 0);
        if (showLine) {
            WebGlInstance.webGL.gl.bufferData(WebGlInstance.webGL.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.verticesIndexLine), WebGlInstance.webGL.gl.STATIC_DRAW);

            model.ibo.numerOfEmements = model.verticesIndexLine.length;

            // Ausgabe
            WebGlInstance.webGL.gl.disableVertexAttribArray(aColor);
            WebGlInstance.webGL.gl.drawElements(WebGlInstance.webGL.gl.LINES, model.ibo.numerOfEmements, WebGlInstance.webGL.gl.UNSIGNED_SHORT, 0);
        }
    }

    // API
    return {
        start: start
    }
}());