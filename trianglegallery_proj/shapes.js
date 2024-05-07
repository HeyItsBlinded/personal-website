class Circle {
    constructor() {
        this.type = 'circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 10;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var d = size / 200.0 // delta

        let angleStep = 360 / this.segments;
        for (var angle = 0; angle < 360; angle = angle + angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1 * Math.PI / 180) * d, Math.sin(angle1 * Math.PI / 180) * d];
            let vec2 = [Math.cos(angle2 * Math.PI / 180) * d, Math.sin(angle2 * Math.PI / 180) * d];
            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

            drawTriangle( [xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]] );
        }
    }
}

class Point {
    constructor(){
        this.type = 'point';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // quit using the bufer to send attribute
        gl.disableVertexAttribArray(a_Position);
        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, size);

        // Draw
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}

class Triangle {
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        // this.vertices = [ // NEW! - solved with chatGPT
        //   0.0, 0.0,
        //   0.5, 0.0,
        //   0.25, 0.5
        // ];
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        // var vertices = this.vertices; // NEW! - solved with chatGPT

        // pass the pos of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // pass the color of a point to u_FragColor varialbe
        gl.uniform1f(u_Size, size);

        // draw
        // var n = vertices.length / 2;  // NEW!
        // drawTriangle(vertices); // NEW!
        var d = this.size / 200.0; // delta
        drawTriangle( [xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d] ); // NEW! - solved with chatGPT - OG: [xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]
    }
}

// CustomTriange - same as Triangle, but takes in custom vertices
class CustomTriangle {
    constructor(vertices, color) { // NEW! - got rid of size input
        this.type = 'triangle';
        this.vertices = vertices; // Custom vertices
        this.color = color || [1.0, 1.0, 1.0, 1.0];
        // this.size = size || 5.0;
    }

    render() {
        var rgba = this.color;
        // var size = this.size;
        var vertices = this.vertices;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        // gl.uniform1f(u_Size, size); // NEW! - commented out

        var n = vertices.length / 2;
        drawCustomTriangle(vertices);
    }
}

function drawTriangle(vertices) {
    var n = vertices.length / 2; // NEW! - solved with chatGPT - var n = 3

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawCustomTriangle(vertices) {
    var n = vertices.length / 2;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}