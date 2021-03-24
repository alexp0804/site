
var canvas_size = 600;
var boid_size = 6;
var num_boids = 100;
var vel_limit = 5;

boids = [];

class Boid
{
    constructor()
    {
        this.vel = createVector(0, 0);
        this.pos = createVector(random(windowWidth), random(windowHeight));
    }
    
    draw_boid()
    {
        let x = this.pos.x;
        let y = this.pos.y;

        fill(255);
        circle(x, y, boid_size);
    }
}

function draw_boids()
{
    for (let i = 0; i < num_boids; i++)
    {
        boids[i].draw_boid();
    }
}

function move_boids()
{
    let v = createVector(0, 0);

    for (let i = 0; i < num_boids; i++)
    {
        v.set(0, 0);
        
        let b = boids[i];
        
        v.add(rule_1(b));
        v.add(rule_2(b));
        // v.add(rule_3(b));
        
        b.vel.add(v);
        
        limit_velocity(b);

        b.pos.add(b.vel);

        bound(b);
    }
}

// If the velocity vectors magnitude is greater than the limit, scale it down to the limit.
function limit_velocity(b)
{
    // Normalize vector then scale by limit.
    if (b.vel.mag() > vel_limit)
    {
        b.vel.normalize().mult(vel_limit);
    }
}

function rule_1(b)
{
    let v = createVector(0, 0);

    for (let i = 0; i < num_boids; i++)
    {
        v.add(boids[i].pos);
    }

    v.div(num_boids - 1);

    return v.sub(b.pos).div(50);
}

function rule_2(b)
{
    let c = createVector(0, 0);
    
    for (let i = 0; i < num_boids; i++)
    {
        if (b != boids[i])
        {
            if (abs(dist(b.pos.x, b.pos.y, boids[i].pos.x, boids[i].pos.y)) < 100)
            {
                let to_sub = boids[i].pos.sub(b.pos);
                c.sub(to_sub);
            }
        }
    }

    return c;
}

function rule_3(b)
{
    return createVector(0, 0);
}

function bound(b)
{
    let pos = b.pos;

    if (b.pos.x < 0)
    {
        b.pos.x = windowWidth - 2;
    }
    else if (b.pos.x > windowWidth)
    {
        b.pos.x = 2;
    }

    if (b.pos.y < 0)
    {
        b.pos.y = windowHeight - 2;
    }
    else if (b.pos.y > windowHeight)
    {
        b.pos.y = 2;
    }
}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
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

    draw_boids();
    move_boids();
}