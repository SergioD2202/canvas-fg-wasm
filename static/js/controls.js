export const keys = {
    a: {
        pressed:false
    },
    d:{
        pressed:false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }

}

const moveKeydown = (event, player, enemy) => {

    //player controls

    if(!player.dead) {
        switch(event.key) {
            case 'd':
                keys.d.pressed = true;
                player.lastKeyPressed = 'd';
                break;
    
            case 'a':
                keys.a.pressed = true;
                player.lastKeyPressed = 'a';
                break;
    
            case 'w':
                player.jump();
                break;
    
            case ' ':
                player.attack();
                break;
    
            
        }
    }

    //enemy controls

    if(!enemy.dead) {
        switch(event.key) {

            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKeyPressed = 'ArrowRight';
                break;
        
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKeyPressed = 'ArrowLeft';
                break;
        
            case 'ArrowUp':
                enemy.jump()
                break;
        
            case 'ArrowDown':
                enemy.attack();
                break;
        }
    }
}

const moveKeyup = (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
}

export { moveKeydown, moveKeyup }