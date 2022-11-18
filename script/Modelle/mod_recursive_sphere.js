var modRecursiveSphere = (function () {
    let recursiveVertex = 0;

    /**
     * Kugel (Erzeugung mit parametrisierter Funktion)
     */
    function createModellVertex() {
        this.recursiveVertex = 0
        let recursiveVertex = this.recursiveVertex;

        this.recursionDeep = 4;
        let recursionDeep = this.recursionDeep;

        this.radius = 1
        let radius = this.scale;

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

        let iVertex = 0;

        createSeedVertices();
        createSeedLines();
        createSeedTriangles();

        if (recursionDeep >= 0) {
            createRecrusiveSphere(recursionDeep);
        }

        // Ausgehend von den Dreiecken des Seed rekursiv Dreiecke bis Rekusionstiefe = 0 erzeugen;
        function createRecrusiveSphere(vertex1, vertex2, vertex3, rekursionDeep) {

        }

        // Definiert die Seed Dreiecke CCW
        function createSeedTriangles() {
            createSeedTriangle(0, 3, 4);
            createSeedTriangle(3, 2, 4);
            createSeedTriangle(2, 1, 4);
            createSeedTriangle(1, 0, 4);

            createSeedTriangle(0, 5, 3);
            createSeedTriangle(3, 5, 2);
            createSeedTriangle(2, 5, 1);
            createSeedTriangle(1, 5, 0);
        }

        // Erzeugt Seed Dreieck
        function createSeedTriangle(iVertex1, iVertex2, iVertex3) {
            verticesIndexTriangle.push(iVertex3);
            verticesIndexTriangle.push(iVertex2);
            verticesIndexTriangle.push(iVertex1);
        }

        // Definiert die Seed Linien
        function createSeedLines() {
            createSeedLine(0, 1);
            createSeedLine(1, 2);
            createSeedLine(2, 3);
            createSeedLine(3, 0);
        }

        // Erzeugt Seed Linien XZ Ebene und Y Achse
        function createSeedLine(iVertex1, iVertex2) {
            verticesIndexLine.push(iVertex1);
            verticesIndexLine.push(iVertex2);

            verticesIndexLine.push(iVertex1);
            verticesIndexLine.push(4);

            verticesIndexLine.push(iVertex1);
            verticesIndexLine.push(5);
        }

        // Definiert die Seed Punkte
        function createSeedVertices() {
            createPoint(-1.0, 0.0, 0.0);    // 0
            createPoint(0.0, -1.0, 0.0);    // 1
            createPoint(1.0, 0.0, 0.0);     // 2
            createPoint(0.0, 1.0, 0.0);     // 3
            createPoint(0.0, 0.0, 1.0);     // 4
            createPoint(0.0, 0.0, -1.0);    // 5
        }

        // Erzeugt einen konkreten Punkt mit Farbe und Normale
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

            return iVertex;
        }
    }

    return {
        createModellVertex: createModellVertex,
    }
}());