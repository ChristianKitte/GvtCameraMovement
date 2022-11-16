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

        this.radius = 0
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
        var normals = this.normals;

        /**
         * Array, das die aktuellen VerticesIndizes für die Linien hält
         * @type {*[]}
         */
        this.verticesIndexLine = [];
        var verticesIndexLine = this.verticesIndexLine;

        /**
         * Array, das die aktuellen VerticesIndizes für die Dreiecke hält
         * * @type {*[]}
         *  */
        this.verticesIndexTriangle = [];
        var verticesIndexTriangle = this.verticesIndexTriangle;

        subdivide(1.0, 0.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, 0.0, 0.0,
            recursionDeep);
    }

    function addSphereElements(v1x, v1y, v1z,
                               v2x, v2y, v2z,
                               v3x, v3y, v3z) {

        // Punkt 1
        this.vertices.push(v1x * this.scale); // X Koordinate
        this.vertices.push(v1y * this.scale); // Y Koordinate
        this.vertices.push(v1z * this.scale); // Z Koordinate
        this.vertices.push(1.0, 0.0, 0.0, 1); // Farbwert
        this.vertices.push(1.0, 1.0, 1.0); // Normale
        recursiveVertex++;

        // Punkt 2
        this.vertices.push(v2x * this.scale); // X Koordinate
        this.vertices.push(v2y * this.scale); // Y Koordinate
        this.vertices.push(v2z * this.scale); // Z Koordinate
        this.vertices.push(0.0, 1.0, 0.0, 1); // Farbwert
        this.vertices.push(1.0, 1.0, 1.0); // Normale
        recursiveVertex++;

        // Punkt 3
        this.vertices.push(v3x * this.scale); // X Koordinate
        this.vertices.push(v3y * this.scale); // Y Koordinate
        this.vertices.push(v3z * this.scale); // Z Koordinate
        this.vertices.push(0.0, 0.0, 1.0, 1); // Farbwert
        this.vertices.push(1.0, 1.0, 1.0); // Normale
        recursiveVertex++;

        // Linie 1
        this.verticesIndexLine.push(recursiveVertex - 3);
        this.verticesIndexLine.push(recursiveVertex - 2);
        // Linie 2
        this.verticesIndexLine.push(recursiveVertex - 2);
        this.verticesIndexLine.push(recursiveVertex - 1);
        // Linie 3
        this.verticesIndexLine.push(recursiveVertex - 1);
        this.verticesIndexLine.push(recursiveVertex - 3);

        // Dreieck
        this.verticesIndexTriangle.push(recursiveVertex - 3);
        this.verticesIndexTriangle.push(recursiveVertex - 2);
        this.verticesIndexTriangle.push(recursiveVertex - 1);
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

    return {
        createModellVertex: createModellVertex,
    }
}());