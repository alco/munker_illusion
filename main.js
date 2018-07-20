let CANVAS_WIDTH;
let CANVAS_HEIGHT;

const BG_COLOR = "rgb(59, 105, 245)";
const FG_COLOR = "rgb(253, 250, 85)";
const CIRCLE_COLOR = "rgb(200, 105, 45)";

const STRIPE_HEIGHT = 10;
const NUM_CIRCLES = 5;
const CIRCLE_RADIUS = 80;

let ctx, t0;
const circles = [];

let paused = false;

function pauseResume() {
    const button = document.getElementById("button");
    paused = !paused;
    if (paused) {
        button.textContent = "Resume";
    } else {
        button.textContent = "Pause";
        window.requestAnimationFrame(animationFrame);
    }
}

function initCanvas() {
    const canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH = window.innerWidth;
    canvas.height = CANVAS_HEIGHT = window.innerHeight - 40;
    ctx = canvas.getContext("2d");

    for (let i = 0; i < NUM_CIRCLES; i++) {
        circles.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            angle: Math.random() * 2 * Math.PI,
            xDirection: 1,
            yDirection: 1,
            speed: .1 + Math.random() * .5
        });
    }

    t0 = performance.now();
    window.requestAnimationFrame(animationFrame);
}

function animationFrame(timestamp) {
    if (t0) {
        const dt = timestamp - t0;
        animationStep(dt);
        redrawScene();
    }
    t0 = timestamp;

    if (paused) {
        t0 = null;
    } else {
        window.requestAnimationFrame(animationFrame);
    }
}

function animationStep(dt) {
    for (let circle of circles) {
        circle.x += circle.xDirection * circle.speed * Math.cos(circle.angle) * dt;
        circle.y += circle.yDirection * circle.speed * Math.sin(circle.angle) * dt;

        if (circle.x < 0 || circle.x > CANVAS_WIDTH) {
            circle.xDirection = -circle.xDirection;
        }
        if (circle.y < 0 || circle.y > CANVAS_HEIGHT) {
            circle.yDirection = -circle.yDirection;
        }
    }
}

function redrawScene() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    addStripes(ctx, 0);
    ctx.fillStyle = FG_COLOR;
    ctx.fill();

    clip(
        ctx,
        (ctx) => addStripes(ctx, 0),
        (ctx) => drawCircles(ctx, circles, 0, Math.floor(NUM_CIRCLES / 2))
    );

    clip(
        ctx,
        (ctx) => addStripes(ctx, STRIPE_HEIGHT),
        (ctx) => drawCircles(ctx, circles, Math.floor(NUM_CIRCLES / 2) + 1, NUM_CIRCLES - 1)
    );
}

function addStripes(ctx, yOffset) {
    ctx.beginPath();
    for (let y = yOffset; y < CANVAS_HEIGHT; y += STRIPE_HEIGHT * 2) {
        ctx.rect(0, y, CANVAS_WIDTH, STRIPE_HEIGHT);
    }
}

function drawCircles(ctx, circles, i, j) {
    ctx.fillStyle = CIRCLE_COLOR;
    for (; i <= j; i++) {
        const circle = circles[i];
        ctx.beginPath();
        ctx.ellipse(circle.x, circle.y, CIRCLE_RADIUS, CIRCLE_RADIUS, 0, 0, Math.PI * 2, true);
        ctx.fill();
    }
}

function clip(ctx, setupFn, bodyFn) {
    ctx.save();
    setupFn(ctx);
    ctx.clip();
    bodyFn(ctx);
    ctx.restore();
}