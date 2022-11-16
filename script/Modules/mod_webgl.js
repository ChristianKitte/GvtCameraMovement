var WebGlInstance = (function () {
    let webGL = {};

    /**
     * Der aktuell gültige WebGL Kontext
     * @type {*} Ein WebGL Kontext
     */

    //const gl = getContext(0.9, 0.9, 0.9, 1);

    /**
     * Das Aktuell gültige WebGL Programm
     */
    //const program = gl.createProgram();

    webGL.create = function () {
        iniWebGl();
    }

    function iniWebGl() {
        /**
         * Der aktuell gültige WebGL Kontext
         * @type {*} Ein WebGL Kontext
         */
        getContext(webGL, 0.9, 0.9, 0.9, 1);

        /**
         * Das Aktuell gültige WebGL Programm
         */
        webGL.program = webGL.gl.createProgram();

        iniWebGLApp();
        initUniforms();
    }

    function initUniforms() {
        // Projection Matrix.
        webGL.program.pMatrixUniform = webGL.gl.getUniformLocation(webGL.program, "uPMatrix");

        // Model-View-Matrix.
        webGL.program.mvMatrixUniform = webGL.gl.getUniformLocation(webGL.program, "uMVMatrix");
    }

    /**
     * Erzeugt einen WebGL Kontext mit dem als RGB übergebenen Farbwert als Hintergrund
     * und gibt diesen zurück. Zusätzlich wird der Ausgabebereich vergrößert
     *
     * http://www.ibesora.me/creating-a-webgl2-canvas/
     *
     * @param redVal Der Rotwert des Hintergrundes
     * @param greenVal Der Grünwert des Hintergrundes
     * @param blueVal Der Blauwert des Hintergrundes
     * @param alphaVal Der Aplhawert des Hintergrundes
     * @returns {*} Einen WebGL Kontext
     */
    function getContext(redVal, greenVal, blueVal, alphaVal) {
        // Get the WebGL context
        let canvas = document.getElementById('canvas');

        webGL.gl = canvas.getContext('webgl2');
        webGL.gl.viewportWidth = canvas.width;
        webGL.gl.viewportHeight = canvas.height;
        webGL.gl.viewport(0, 0, webGL.gl.canvas.width, webGL.gl.canvas.height);

        webGL.gl.clearColor(redVal, greenVal, blueVal, alphaVal);//RGB der Hintergrundfarbe
    }

    /**
     * Initialisiert und konfiguriert die WebGL Anwendung und definiert die Shader und
     * das Programm. Es wird ein gültiger WebGL Kontext erwartet.
     */
    function iniWebGLApp() {
        var vsShader = webGL.gl.createShader(webGL.gl.VERTEX_SHADER);
        webGL.gl.shaderSource(vsShader, vertexShaderSource);
        webGL.gl.compileShader(vsShader);
        webGL.gl.attachShader(webGL.program, vsShader);

        var fsShader = webGL.gl.createShader(webGL.gl.FRAGMENT_SHADER);
        webGL.gl.shaderSource(fsShader, fragmentShaderSouce);
        webGL.gl.compileShader(fsShader);
        webGL.gl.attachShader(webGL.program, fsShader);

        webGL.gl.linkProgram(webGL.program);

        if (!webGL.gl.getProgramParameter(webGL.program, webGL.gl.LINK_STATUS)) {
            console.log(webGL.gl.getShaderInfoLog(vertexShaderSource));
            console.log(webGL.gl.getShaderInfoLog(fragmentShaderSouce));
        }

        webGL.gl.frontFace(webGL.gl.CW);
        webGL.gl.enable(webGL.gl.CULL_FACE);
        webGL.gl.cullFace(webGL.gl.BACK);

        // Depth(Z)-Buffer.
        webGL.gl.enable(webGL.gl.DEPTH_TEST);
        webGL.gl.depthFunc(webGL.gl.LEQUAL);

        // Polygon offset of rastered Fragments.
        webGL.gl.enable(webGL.gl.POLYGON_OFFSET_FILL);
        webGL.gl.polygonOffset(1, 1);

        webGL.gl.useProgram(webGL.program);
    }

    return {
        webGL: webGL
    }
}());






