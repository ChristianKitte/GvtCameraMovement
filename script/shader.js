/**
 * Der Code des Vertex Shader der über jeden Punkt ausgeführt wird
 * @type {string}
 */
const vertexShaderSource = `#version 300 es  
    uniform mat4 uPMatrix;
    uniform mat4 uMVMatrix;
  
    in vec3 aPosition;
    in vec4 aColor;
    in vec3 aNormal;
    
    out vec4 vColor;
    out float vBrightness;
    out vec3 vNormal;
    
    vec3 lightDirection = normalize(vec3(3.0, 3.0, 1.0));
    vec3 normal;
    
    void main()
    {
        // Kreuzprodukt ist 0 <> Orthongonalität <> stehen senkrecht aufeinander
        // Auf 0 setzen, wenn das Kreuzprodukt negativ ist
        //normal=normalize(aNormal);
        
        vBrightness = max(dot(lightDirection, aNormal),0.0);
        //vBrightness = 0.5;
        vColor = aColor;
        
        
        //vColor = vec4(normal.z, normal.z, normal.z, 1);
        
        gl_Position=vec4(aPosition, 365);
        gl_PointSize=1.0;       
    }
`;

/**
 * Der Code des Fragment Shader, der über jeden Pixel des Fragments ausgeführt wird.
 * @type {string} Der Code
 */
const fragmentShaderSouce = `#version 300 es
    
    precision mediump float;

    in vec4 vColor;
    in vec3 vNormal;
    in float vBrightness;
    
    out vec4 fragColor;

    void main()
    {       
        // Ambient Lightning
        //fragColor= (vColor * 0.2) + (vColor * vBrightness * 0.6);
        
        // nur Helligkeit ohne Umgebungslicht
        //fragColor= (vColor * 0.2) + (vColor * vBrightness * 0.8);
        
        // vBrightness is vec3 ==> Alpha muss neu gesetzt werden
        //fragColor.a = 1.0;
        
        fragColor=vColor;
        //fragColor.a=1.0;
    }
`;