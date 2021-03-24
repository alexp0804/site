
var boids = [];
var num_boids = 10;
var view_distance = 300;
var velocity_limit = 50;

class Boid
{
    constructor()
    {
        this.r = createVector(random(windowWidth), random(windowHeight));
        this.v = createVector(0, 0);
        // this.v = createVector(random(-100, 100), random(-10, 100));
    }

    show()
    {
        fill(255);
        circle(this.r.x, this.r.y, 4);
    }
}

function get_neighbors(b) 
{
    let nearby = [];

    for (let i = 0; i < num_boids; i++)
    {
        if (boids[i] != b && b.r.dist(boids[i].r) < view_distance)
        {
            nearby.push(boids[i]);
        }
    }

    return nearby;
}

// Boids stear to average position of all boids.
function rule_1(b)
{
    let c = createVector(0, 0);
    let n = get_neighbors(b);
    
    if (n.length == 0)
    {
        return c;
    }

    // Average position of all boids.
    n.forEach(boid => c.add(boid.r));
    c.sub(b.r).div(n.length-1);

    // Subtract b.pos from c to point our boid to the center.
    c.sub(b.pos);

    // Divide by 100 to slowly bring the boid to the center.
    // c.div(100);
    c.normalize()

    return c;
}

// Boids keep a small distance away from other boids.
function rule_2(b)
{
    let n = get_neighbors(b);
    let c = createVector(0, 0);

    if (n.length == 0)
    {
        return c;
    }

    for (let i = 0; i < n.length; i++)
    {
        let d = p5.Vector.sub(boids[i].r, b.r);

        if (d.mag() < 100)
        {
            c.sub(d);
        }
    }

    return c.div(50);
}

// Boids match velocities with neighboring boids.
function rule_3(b)
{
    let v = createVector(0, 0);
    let n = get_neighbors(b);

    if (n.length == 0)
    {
        return;
    }

    // Average: sum(n) / length(n) once again.
    n.forEach(boid => v.add(boid.v));
    v.div(n.length);

    return v.sub(b.v).div(100);
}

function limit_velocity(v)
{
    if (v.mag() > velocity_limit)
    {
        v = v.normalize().mult(velocity_limit);
    }
}

function bound(b)
{
    let v = createVector(0, 0);

    let x = 25;

    if (b.r.x < x)
    {
        v.x = x;
    }
    else if (b.r.x > windowWidth-x)
    {
        v.x = -x;
    }

    if (b.r.y < x)
    {
        v.y = x;
    }
    else if (b.r.y > windowHeight-x)
    {
        v.y = -x;
    }

    return v;
}

function tend_to_place(b)
{
    let v = createVector(mouseX, mouseY);

    return (v.sub(b.r)).div(50);
}

// For each boid, add velocity (v) to position (r)
function move()
{
    let vel = createVector(0, 0);
    let b;

    for (let i = 0; i < num_boids; i++)
    {
        b = boids[i];
        vel.set(0, 0);
        
        vel.add(rule_1(b));
        vel.add(rule_2(b));
        vel.add(rule_3(b));
        
        vel.add(bound(b));
        vel.add(tend_to_place(b));


        b.v = vel;
        limit_velocity(b.v);

        b.r.add(b.v);
    }
}

function setup()
{
    var canvas = createCanvas(windowWidth, windowHeight);

    for (let i = 0; i < num_boids; i++)
    {
        boids.push(new Boid());
    }
}

function draw()
{
    background(0);
    move();
    boids.forEach(b => b.show());
}