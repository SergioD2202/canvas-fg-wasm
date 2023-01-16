
import * as utils from "./js/utils.js";
import { Coordinates, Player, Sprite } from "./js/classes.js";
import { moveKeydown, moveKeyup, keys } from "./js/controls.js";
import * as wasm from 'canvas_fg_wasm';
//basic declaration of the canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const audio = new Audio("./music/shovelknight.mp3");
audio.loop = true;

const start = () => {utils.playAudio(audio)}

window.addEventListener('click', () => start());

c.fillRect(0, 0, canvas.width, canvas.height);

//controls declaration

window.addEventListener('keydown', (event) => moveKeydown(event, player, enemy));
window.addEventListener('keyup', (event) => moveKeyup(event));

//Timer
let timer = 60;
document.querySelector('#timer').innerHTML = timer;

//background

const background = new Sprite({
    position: new Coordinates(0,0),
    imageSrc: '../fg-assets/background.png',
    context: c,
    canvas: canvas
})

const shop = new Sprite({
    position: new Coordinates(600,128),
    imageSrc: '../fg-assets/shop.png',
    scale: 2.75,
    frames: 6,
    context: c,
    canvas: canvas
})


//player and enemy
const player = new Player({
    position: new Coordinates(0,0),
    velocity: new Coordinates(0,0),
    color: 'red',
    offsetAttack: new Coordinates(0,0),
    imageSrc: '../fg-assets/samuraiMack/Idle.png',
    frames: 8,
    scale: 2.5,
    offset: new Coordinates(215,157),
    sprites: {
        idle: {
            imageSrc: '../fg-assets/samuraiMack/Idle.png',
            frames: 8,
        },
        run: {
            imageSrc: '../fg-assets/samuraiMack/Run.png',
            frames: 8,
        },
        jump: {
            imageSrc: '../fg-assets/samuraiMack/Jump.png',
            frames: 2,
        },
        fall: {
            imageSrc: '../fg-assets/samuraiMack/Fall.png',
            frames: 2,
        },
        attack1: {
            imageSrc: '../fg-assets/samuraiMack/Attack1.png',
            frames: 6,
        },
        takeHit: {
            imageSrc: '../fg-assets/samuraiMack/Take hit - white silhouette.png',
            frames: 4,
        },
        death: {
            imageSrc: '../fg-assets/samuraiMack/Death.png',
            frames: 6,
        },

    },
    attackBox: {
        offset: new Coordinates(100,50),
        width:160,
        height:50,
    },
    context: c,
    canvas: canvas,
    gravity: gravity
});

const enemy = new Player({
    position: new Coordinates(400,100),
    velocity: new Coordinates(0,0),
    color: 'blue',
    offsetAttack: new Coordinates(-50, 0),
    imageSrc: '../fg-assets/kenji/Idle.png',
    frames: 4,
    scale: 2.5,
    offset: new Coordinates(215,167),
    sprites: {
        idle: {
            imageSrc: '../fg-assets/kenji/Idle.png',
            frames: 4,
        },
        run: {
            imageSrc: '../fg-assets/kenji/Run.png',
            frames: 8,
        },
        jump: {
            imageSrc: '../fg-assets/kenji/Jump.png',
            frames: 2,
        },
        fall: {
            imageSrc: '../fg-assets/kenji/Fall.png',
            frames: 2,
        },
        attack1: {
            imageSrc: '../fg-assets/kenji/Attack1.png',
            frames: 4,
        },
        takeHit: {
            imageSrc: '../fg-assets/kenji/Take hit.png',
            frames: 3,
        },
        death: {
            imageSrc: '../fg-assets/kenji/Death.png',
            frames: 7,
        },
    },
    attackBox: {
        offset: new Coordinates(-170,50),
        width:170,
        height:50,
    },
    context: c,
    canvas: canvas,
    gravity: gravity
})

document.querySelector('#enemyHealth').value = enemy.health;
document.querySelector('#playerHealth').value = player.health;

//Animations
function decreaseTimer() {
    if(timer > 0) {
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }

    if(timer === 0) {
        determineWinner({player, enemy});
        clearInterval(timerInterval);
    }
}

const timerInterval = setInterval(decreaseTimer, 1000);

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0, canvas.width, canvas.height);

    background.update();
    shop.update();
    c.fillStyle = 'rgba(255,255,255,0.15)';
    c.fillRect(0,0,canvas.width, canvas.height);

    player.update();
    enemy.update();

    if(timer <= 0) {
        clearInterval(timerInterval);
    }

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player movement
    
    if(keys.a.pressed && player.lastKeyPressed === 'a') {
        player.switchSprite('run');
        player.velocity.x = -3;
    } else if (keys.d.pressed && player.lastKeyPressed === 'd') {
        player.switchSprite('run');
        player.velocity.x = 3;
    } else {
        player.switchSprite('idle');
    }

    //player jump
    if(player.velocity.y < 0) {
        player.switchSprite('jump');
    }

    //player fall

    if(player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    player.landing();

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKeyPressed === 'ArrowLeft') {
        enemy.switchSprite('run');
        enemy.velocity.x = -3;
    } else if (keys.ArrowRight.pressed && enemy.lastKeyPressed === 'ArrowRight') {
        enemy.switchSprite('run');
        enemy.velocity.x = 3;
    } else {
        enemy.switchSprite('idle');
    }

    //enemy jump
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }

    //enemy fall

    if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    enemy.landing();

    //detect for collision

    if(utils.rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
        enemy.takeHit(0.202);
        gsap.to('#enemyHealth', {
            value: enemy.health
        });
    }

    if(player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if(utils.rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
        player.takeHit(0.101);
        gsap.to('#playerHealth', {
            value: player.health
        });
    }

    if(enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    //Game Over

    if(player.health <= 0 || enemy.health <= 0) {
        utils.determineWinner({player, enemy, audio});
        clearInterval(timerInterval);
    }
} 

animate()



