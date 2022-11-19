var modRecursiveSphere = (function () {
    /**
     * Kugel (rekursive Erzeugung)
     */
    function createModellVertex() {
        this.recursiveVertex = 0
        let recursiveVertex = this.recursiveVertex;

        this.recursionDeep = currentRecursionDeep;
        let recursionDeep = this.recursionDeep;

        this.scale = 100
        let scale = this.scale;

        /**
         * Array, das die aktuell vorkommendem Vertices hält
         * * @type {*[]}
         *  */
        this.vertices = [];
        var vertices = this.vertices;

        /**
         * Array, das die aktuell vorkommendem Normalen hält
         * * @type {*[]}
         *  */
        this.normals = [];
        let normals = this.normals;

        /**
         * Array, das die aktuellen VerticesIndizes für die Linien hält
         * @type {*[]}
         */
        this.verticesIndexLine = [];
        let verticesIndexLine = this.verticesIndexLine;

        /**
         * Array, das die aktuellen VerticesIndizes für die Dreiecke hält
         * * @type {*[]}
         *  */
        this.verticesIndexTriangle = [];
        let verticesIndexTriangle = this.verticesIndexTriangle;

        /**
         * Ein Zähler für die Knoten.
         * @type {number}
         */
        let iVertex = 0;

        startRecusiveSphere();

        // Definiert die anfänglichen Punkte eines Oktraeders als Seed. Für
        // jede Dreiecksfläche wird hierbei die rekursive Erzeugungsfunktion
        // aufgerufen.
        function startRecusiveSphere() {
            let v0 = [-1.0, 0.0, 0.0];    // 0
            let v1 = [0.0, -1.0, 0.0];    // 1
            let v2 = [1.0, 0.0, 0.0];     // 2
            let v3 = [0.0, 1.0, 0.0];     // 3
            let v4 = [0.0, 0.0, 1.0];     // 4
            let v5 = [0.0, 0.0, -1.0];    // 5

            // obere Dreiecke
            createRecusiveSphere(v4, v3, v0, recursionDeep);
            createRecusiveSphere(v4, v2, v3, recursionDeep);
            createRecusiveSphere(v4, v1, v2, recursionDeep);
            createRecusiveSphere(v4, v0, v1, recursionDeep);

            // untere Dreiecke
            createRecusiveSphere(v3, v5, v0, recursionDeep);
            createRecusiveSphere(v2, v5, v3, recursionDeep);
            createRecusiveSphere(v1, v5, v2, recursionDeep);
            createRecusiveSphere(v0, v5, v1, recursionDeep);
        }

        // Ausgehend vom übergebenem Dreiecken werden recursiv jeweils vier neue Dreiecke
        // bis zur Rekusionstiefe 0 erzeugt
        function createRecusiveSphere(v1, v2, v3, curRecursionDeep) {

            let v1norm = getNormalicedPoint(v1);
            let v2norm = getNormalicedPoint(v2);
            let v3norm = getNormalicedPoint(v3);

            if (curRecursionDeep === 0) { // Ausgabe eines finalen Dreiecks
                iv1 = createPoint(v1[0], v1[1], v1[2],);
                iv2 = createPoint(v2[0], v2[1], v2[2],);
                iv3 = createPoint(v3[0], v3[1], v3[2],);

                createLine(iv1, iv2);
                createLine(iv2, iv3);
                createLine(iv3, iv1);

                createSeedTriangle(iv1, iv2, iv3);
            } else { // Start eines weiteren Rekursionsschrittes

                let v12norm = getNormalicedPoint(getDividerPoint(v1norm, v2norm));
                let v23norm = getNormalicedPoint(getDividerPoint(v2norm, v3norm));
                let v31norm = getNormalicedPoint(getDividerPoint(v3norm, v1norm));

                // 1-12-31
                createRecusiveSphere(v1norm, v12norm, v31norm, curRecursionDeep - 1);
                // 12-2-23
                createRecusiveSphere(v12norm, v2norm, v23norm, curRecursionDeep - 1);
                // 23-3-31
                createRecusiveSphere(v23norm, v3norm, v31norm, curRecursionDeep - 1);
                // 12-23-31
                createRecusiveSphere(v12norm, v23norm, v31norm, curRecursionDeep - 1);
            }
        }

        // Gibt auf Basis zweier Punkte (Ortsvektoren) den dazwischenliegenden, normierten
        // Punkt (Ortsvektor) zurück
        function getDividerPoint(v1, v2) {
            let v12 = glMatrix.vec3.create();

            glMatrix.vec3.add(v12, v1, v2);
            glMatrix.vec3.scale(v12, v12, 0.5);

            return getNormalicedPoint(v12);
        }

        // Normalisiert den übergebenen Punkt / Ortsvektor
        function getNormalicedPoint(v1) {
            let vNorm = glMatrix.vec3.create();

            glMatrix.vec3.normalize(vNorm, v1);

            return vNorm;
        }

        // Erzeugt auf Basis der Indizes dreier Punkte ein Dreieck
        function createSeedTriangle(iVertex1, iVertex2, iVertex3) {
            verticesIndexTriangle.push(iVertex1);
            verticesIndexTriangle.push(iVertex2);
            verticesIndexTriangle.push(iVertex3);
        }

        // Erzeugt auf Basis der Indizes zweier Punkte eine Linien
        function createLine(iVertex1, iVertex2) {
            verticesIndexLine.push(iVertex1);
            verticesIndexLine.push(iVertex2);
        }

        // Erzeugt auf Basis der Koordinatem einen konkreten Punkt mit
        // Farbe und Normale
        function createPoint(x, y, z) {
            iVertex++;

            // Punkte und Farbe definieren
            vertices.push(x * scale); // X Koordinate
            vertices.push(y * scale); // Y Koordinate
            vertices.push(z * scale); // Z Koordinate

            let modVal = iVertex % 3;

            if (modVal === 0) {
                vertices.push(1.0, 0.0, 0.0, 1); // Farbwert
            } else if (modVal === 1) {
                vertices.push(0.0, 1.0, 0.0, 1); // Farbwert
            } else if (modVal === 2) {
                vertices.push(0.0, 0.0, 1.0, 1); // Farbwert
            }

            vertices.push(1.0, 1.0, 1.0); // Normale

            return iVertex - 1;
        }
    }

    return {
        createModellVertex: createModellVertex,
    }
}());