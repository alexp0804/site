
var canvas_length = 600;
var vertices = [];
var points = [];
var locked = false;

class Vertex
{
    constructor(x, y)
    {
        this.r = createVector(x, y);
    }
}

function next_point(p)
{
    v = vertices[Math.floor(Math.random() * vertcies.length)];

    return createVector((p.x + v.x)/2, (p.y + v.y)/2);
}

function setup()
{
    var canvas = createCanvas(canvas_length, canvas_length);
    vertices.push(new Vertex(10, 10));
    vertices.push(new Vertex(100, 10));


    stroke(255);
    strokeWeight(4);
}

function draw()
{
    background(0);
    
    if (mouseIsPressed)
    {
        for (let i = 0; i < vertices.length; i++)
        {
            let d = dist(mouseX, mouseY, vertices[i].r.x, vertices[i].r.y);
            if (dist(mouseX, mouseY, vertices[i].r.x, vertices[i].r.y) < 15)
            {

                vertices[i].r.x = mouseX;
                vertices[i].r.y = mouseY;
            }
        }
    }


    strokeWeight(8);
    vertices.forEach(v => point(v.r));
    
    strokeWeight(1);
    points.forEach(p => point(p));

}
