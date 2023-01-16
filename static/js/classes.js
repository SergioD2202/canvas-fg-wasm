//classes of the game

//Coordinates of the canvas
class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//Basic Sprite
class Sprite {
    constructor({position, imageSrc, scale = 1, frames = 1, offset = new Coordinates(0,0), canvas, context}) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.frames = frames;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
        this.canvas = canvas;
        this.context = context;
    }
    draw() {
        this.context.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.frames) * this.scale, 
            this.image.height * this.scale
        );
    }

    update() {
        this.draw();
        this.animateFrames();
    }

    animateFrames() {
        this.framesElapsed++;

        if(this.framesElapsed % this.framesHold === 0) {
            if(this.framesCurrent < this.frames - 1) {
                this.framesCurrent++
            }
    
            else {
                this.framesCurrent = 0;
            }
        }
    }
}

//Player class
class Player extends Sprite {
    constructor({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        frames = 1, 
        offset = new Coordinates(0,0),
        sprites,
        attackBox = {offset: {}, width: undefined, height: undefined},
        context,
        canvas,
        gravity
    }) {
        super({
            imageSrc,
            scale,
            frames,
            position,
            offset,
            context,
            canvas
        });
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKeyPressed;
        this.maxJumps = 1;
        this.jumps = this.maxJumps;
        this.color = color;
        this.attackBox = {
            position: new Coordinates(this.position.x, this.position.y),
            width: attackBox.width,
            height: attackBox.height,
            offset: attackBox.offset,
        }
        this.isAttacking = false;
        this.health = 1;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;
        this.gravity = gravity

        for(const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();

        if(!this.dead) this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        /* c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height); */

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.x + this.velocity.x <= 0) {
            this.position.x = 0;
        }

        if(this.position.x + this.width + this.velocity.x >= this.canvas.width) {
            this.position.x = this.canvas.width - this.width;
        }

        if(this.position.y + this.velocity.y <= 0) {
            this.position.y = 0
        }

        if(this.position.y + this.height + this.velocity.y >= this.canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = this.canvas.height - this.height - 96;
        }

        else this.velocity.y += this.gravity;
    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    jump() {
        if(this.jumps > 0) {
            this.velocity.y = -20;
            this.jumps--;
        }
    }

    landing() {
        if(this.position.y + this.height + this.velocity.y >= this.canvas.height - 96) {
            this.jumps = this.maxJumps;
        }
    }

    overrideAnimation(property) {
        return this.image === this.sprites[property].image
        && this.framesCurrent < this.sprites[property].frames - 1
    }

    switchSprite(sprite) {

        // override dying
        if(this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.frames -1) this.dead = true
            return;
        }

        // override attack
        if(this.overrideAnimation('attack1')) return;

        // override getting hit
        if(this.overrideAnimation('takeHit')) return;

        switch(sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.frames = this.sprites.idle.frames;
                    this.framesCurrent = 0;
                }
                break;

            case 'run':
                if(this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.frames = this.sprites.run.frames;
                    this.framesCurrent = 0;
                }
                break;

            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frames = this.sprites.jump.frames;
                    this.framesCurrent = 0;
                }
                break;

            case 'fall':
                if(this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.frames = this.sprites.fall.frames;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.frames = this.sprites.attack1.frames;
                    this.framesCurrent = 0;
                }
                break;

            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.frames = this.sprites.takeHit.frames;
                    this.framesCurrent = 0;
                }
                break;

            case 'death':
                if(this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.frames = this.sprites.death.frames;
                    this.framesCurrent = 0;
                }
                break;
        }
    }

    takeHit(damage) {
        this.health -= damage;

        if(this.health <= 0) {
            this.switchSprite('death')
        }
        else {
            this.switchSprite('takeHit');
        }
    }
}

export { Coordinates, Sprite, Player }