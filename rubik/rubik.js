
var canvasSize = 800;
var cuboidSize = 50;
var cubeSize = cuboidSize * 3;
var halfCuboid = cuboidSize / 2;
var easyCam;
var cube = [];

class Cuboid
{
    constructor()
    {
        // Normal vector on the yello face of the cuboid
        // Default orientation is facing in the positive y direction.
        this.y = createVector(0, 1, 0);

        // Normal vector on the green face of the cuboid
        // Default orientation is in the positive z direction.
        this.g = createVector(0, 0, 1);

        // Normal vector for the red face of the cuboid
        // Default orientation is the positive x direction.
        this.r = createVector(1, 0, 0);
   }
}

function drawAxes()
{
    stroke(color('red'));   line(0,0,0, cubeSize,0,0); // X
    stroke(color('green')); line(0,0,0, 0,cubeSize,0); // Y
    stroke(color('blue'));  line(0,0,0, 0,0,cubeSize); // Z
}

function renderNormals()
{
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            for (let k = 0; k < 3; k++)
            {
                // (x,y,z) is the center of the cuboid
                let x = i * cuboidSize, y = j * cuboidSize, z = k * cuboidSize;
                
                // The normal vectors of each face  
                let yellow  = cube[i][j][k].y;
                let green   = cube[i][j][k].g;
                let red     = cube[i][j][k].r;
 
                // (x,y,z)_0 is the xyz location of the intersection with the 
                // respective face with the normal vector
                let x0 = x + yellow.x * halfCuboid;
                let y0 = y + yellow.y * halfCuboid;
                let z0 = z + yellow.z * halfCuboid;
                // The multiplicative scalar 18 is arbitrary, changes how long the vectors are when rendering.
                stroke(color('yellow')); 
                strokeWeight(1);
                line(x0, y0, z0, x0 += yellow.x * 18, y0 += yellow.y * 18, z0 += yellow.z * 18);
                // Point at the end of the vector for visual effect
                strokeWeight(4);
                point(x0, y0, z0);

                // Same as before but with green normal vector. 
                x0 = x + green.x * halfCuboid;
                y0 = y + green.y * halfCuboid;
                z0 = z + green.z * halfCuboid;

                stroke(color('green')); 
                strokeWeight(1);
                line(x0, y0, z0, x0 += green.x * 18, y0 += green.y * 18, z0 += green.z * 18);
                strokeWeight(4);
                point(x0, y0, z0);
                
                // Same as before but with red normal vector. 
                x0 = x + red.x * halfCuboid;
                y0 = y + red.y * halfCuboid;
                z0 = z + red.z * halfCuboid;

                stroke(color('red')); 
                strokeWeight(1);
                line(x0, y0, z0, x0 += red.x * 18, y0 += red.y * 18, z0 += red.z * 18);
                strokeWeight(4);
                point(x0, y0, z0);
            }
        }
    }
}

function drawFace(norm, size, offsetAmt, col, axis)
{
    push();
    let offset = p5.Vector.mult(norm, offsetAmt);
    translate(offset);

    switch (axis) 
    {
        case "X":
            rotateX(PI/2);
            break;
        case "Y":
            rotateY(PI/2);
            break;
        case "Z":
            rotateZ(PI/2);
            break;
    }

    fill(color(col));
    box(size, size, 0);
    pop();
}

function renderFaces()
{
    stroke(0);
    strokeWeight(1);
    
    // Size is the length of one side of the cuboid
    var size = cuboidSize;
    // Offset is the distance from the center of the cuboid to one of it's faces,
    // when the intersection is perpendicular
    var offsetAmt = size/2;

    var x, y, z, c;

    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            for (let k = 0; k < 3; k++)
            {
                // (x, y, z) is the center of the cuboid, c
                x = i * cuboidSize, y = j * cuboidSize, z = k * cuboidSize;
                c = cube[i][j][k];
                 
                // Transform to cuboid center
                push();
                translate(x, y, z);
                
                // Draw all faces
                drawFace(c.y, size,  offsetAmt, 'yellow', 'X');
                drawFace(c.y, size, -offsetAmt, 'white',  'X'); 
                drawFace(c.g, size,  offsetAmt, 'green',  'Z'); 
                drawFace(c.g, size, -offsetAmt, 'blue',   'Z'); 
                drawFace(c.r, size,  offsetAmt, 'red',    'Y');
                drawFace(c.r, size, -offsetAmt, 'orange', 'Y');

                pop();
            }
        }
    }
}


function setup()
{
    var canvas = createCanvas(canvasSize, canvasSize, WEBGL);
    canvas.parent("displayCanvas");
    easyCam = createEasyCam();

    // Right click menu disabled
    document.oncontextmenu = function() { return false; }

    for (let i = 0; i < 3; i++)
    {
        cube.push([]);
        for (let j = 0; j < 3; j++)
        {
            cube[i].push([]);
            for (let k = 0; k < 3; k++)
            {
                cube[i][j].push(new Cuboid());
            }
        }
    }
}

function draw()
{
    translate(-cubeSize/3, -cubeSize/3, -cubeSize/3);
    background(0);
    // drawAxes();
    // renderNormals();
    renderFaces();
    
}

