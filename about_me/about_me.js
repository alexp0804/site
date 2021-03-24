
var boid_radius = 10;
var draw_distance = 200;
var num_boids = 100;

var boids = [];

class Boid
{
    constructor(x, y)
    {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-5, 5), random(-5, 5));
        // this.angle = random(0, 2*PI);
    }

    draw_boid()
    {
        fill(255);
        circle(this.pos.x, this.pos.y, boid_radius*2)
        // fill(128);
        // line(x, y, (boid_radius*2) * cos(this.angle) + x, (boid_radius*2) * sin(this.angle) + y);
    }

    loop_around()
    {
        let x = this.pos.x;
        let y = this.pos.y;

        if (x > windowWidth)
        {
            this.pos.x = 0;
        }
        if (x < 0)
        {
            this.pos.x = windowHeight;
        }
        if (y > windowWidth)
        {
            this.pos.y = 0;
        }
        if (y < 0)
        {
            this.pos.y = windowHeight;
        }
    }
}

// function get_nearby(boid)
// {
//     let nearby = [];
//     for (let i = 0; i < num_boids; i++)
//     {
//         if (dist(boid.pos, boids[i].pos) < draw_distance && boids[i] != boid)
//         {
//             nearby.push(boids[i]);
//         }
//     }
//     return nearby;
// }

function rule_1(boid)
{
    new_v = createVector(0, 0);

    for (let i = 0; i < boids.length; i++)
    {
        if (boids[i] != boid)
        {

            new_v.add(boids[i].pos);
        }
    }

    new_v.div(boids.length);



    // return [(new_v[0] - boid.x) / 100, (new_v[1] - boid.y) / 100];
    return new_v.sub(boid.x, boid.y).div(10000);
}

function rule_2(boid)
{
    let c = createVector(0, 0);

    for (let i = 0; i < boids.length; i++)
    {
        // boid[i] position - parameter boid position
        d = boids[i].pos.sub(boid.pos);

        if (abs(d) < 25)
        {
            c.sub(d);
        }
    }

    return c;
}

function rule_3(boid)
{
    let v = createVector(0, 0);

    for (let i = 0; i < boids.length; i++)
    {
        if (boid != boids[i])
        {
             v = v.add(boids[i].vel);
        }
    }

    v.div(boids.length-1 * 800);
    return v.div((boids.length-1) * 9000);
}

function setup()
{
    var canvas = createCanvas(windowWidth, windowHeight);
    // var canvas = createCanvas(600, 600);

    for (let i = 0; i < num_boids; i++)
    {
        boids.push(new Boid(50 + random(500), 50 + random(500)));
    }

    angleMode(RADIANS);

    // frameRate(18);

}

function windowResized()
{
    resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
    background(color('gainsboro'));
    for (let i = 0; i < num_boids; i++)
    {
        boids[i].draw_boid();
    }

    for (let i = 0; i < num_boids; i++)
    {
        let v1 = rule_1(boids[i]);
        // let v2 = rule_2(boids[i]);
        let v3 = rule_3(boids[i]);
        // console.log(v3);

        boids[i].vel = boids[i].vel.add(v1);
        // boids[i].vel.add(v2);
        boids[i].vel = boids[i].vel.add(v3);

        boids[i].pos = boids[i].pos.add(boids[i].vel);
        boids[i].loop_around();
    } 
}