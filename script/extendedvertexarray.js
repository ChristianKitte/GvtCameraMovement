/**
 * Array, das die unterschiedlichen Vertices für die Ausgabe hält
 * @type {Float32Array} Ein neues Float32 Array
 */
var vertices = new Float32Array([]);

/**
 * Array, das die Normalen hält
 * @type {Float32Array} Ein neues Float32 Array
 */
var normalVector = new Float32Array([]);

/**
 * Array, das die aktuellen VerticesIndizes für die Linien Ausgabe hält
 * @type {Uint16Array}
 */
var verticesIndexLine = new Uint16Array([]);

/**
 * Array, das die aktuellen VerticesIndizes für die Linien Ausgabe hält
 * @type {Uint16Array}
 */
var normalVectorIndexLine = new Uint16Array([]);

/**
 * Array, das die aktuellen VerticesIndizes für die Dreiecks Ausgabe hält
 * @type {Uint16Array}
 */
var verticesIndexTriangle = new Uint16Array([]);

/**
 * Hilfsfunktion, um im Array vertices dynamisch einen neuen Wert
 * hinzuzufügen
 *
 * https://stackoverflow.com/questions/24410418/push-on-float32array
 * https://javascript.plainenglish.io/advanced-array-methods-in-javascript-d33e4b12de25
 *
 */
function pushVertices() {
    vertices = new Float32Array([...vertices, ...arguments]);
}

/**
 * Hilfsfunktion, um im Array Normalenvektoren dynamisch einen neuen Wert
 * hinzuzufügen
 *
 * https://stackoverflow.com/questions/24410418/push-on-float32array
 * https://javascript.plainenglish.io/advanced-array-methods-in-javascript-d33e4b12de25
 *
 */
function pushNormalVector() {
    normalVector = new Float32Array([...normalVector, ...arguments]);
}

/**
 * Hilfsfunktion, um im Array verticesIndexLine dynamisch einen neuen Wert
 * hinzuzufügen
 *
 */
function pushIndexLine() {
    verticesIndexLine = new Uint16Array([...verticesIndexLine, ...arguments]);
}

/**
 * Hilfsfunktion, um im Array verticesIndexTriangle dynamisch einen neuen Wert
 * hinzuzufügen
 *
 */
function pushIndexTriangle() {
    verticesIndexTriangle = new Uint16Array([...verticesIndexTriangle, ...arguments]);
}


