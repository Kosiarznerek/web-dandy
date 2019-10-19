//GLOBAL VARIABLES
let LEVEL_OBJECTS = null;
//let CURRENT_LEVEL = 1; //TO REPLACE
//let TOTAL_AMOUNT_OF_LEVELS = 2; //TO REPLACE
let KEYPRESSED = {};
let USER_INTERFACE = undefined;

//ONLOAD
window.onload = function () {
    //USER INTERFACE
    USER_INTERFACE = new UserInterface();

    //CREATING CANVAS
    let canvas = document.createElement("canvas");
    let width = 640, height = 306;
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    document.getElementById("gameCanvas").appendChild(canvas);

    //PRELOADING ALL GRAPHICS
    PreloadGraphics(IMAGES, function () {
        ObjectDeepFreeze(IMAGES);
        LEVEL_OBJECTS = createLevelObjects(USER_INTERFACE.GAME_SETTINGS.CURRENT_LEVEL);
        USER_INTERFACE.initializeGameMenu();
        setInterval(function () {
            animate(ctx, width, height)
        }, 1000 / 60);
    })

    //KEYEVENTS
    document.body.onkeydown = function (e) {
        let key = e.key.toUpperCase();
        if (key == " ") {
            key = "SPACE";
        }
        ;
        KEYPRESSED[key] = true;

        USER_INTERFACE.gameMenuControling();
    }
    document.body.onkeyup = function (e) {
        let key = e.key.toUpperCase();
        if (key == " ") {
            key = "SPACE";
        }
        ;
        KEYPRESSED[key] = false;
    }
}

//ANIMATION
/**
 * Animation loop 60 frames per seconds
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} CANVAS_WIDTH Canvas width
 * @param {Number} CANVAS_HEIGHT Canvas height
 */
function animate(ctx, CANVAS_WIDTH, CANVAS_HEIGHT) {
    //BACKGROUND
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //TRANSLATING TO THE PLAYER POSITION
    ctx.save();
    let x = LEVEL_OBJECTS.player.position.x;
    let y = LEVEL_OBJECTS.player.position.y;
    if (x <= 320) {
        x = 320;
    }
    if (x >= 1600) {
        x = 1600;
    }
    if (y <= 160) {
        y = 160;
    }
    if (y >= 800) {
        y = 800;
    }
    ctx.translate(-x, -y);
    ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    //WALLS
    for (let i = 0; i < LEVEL_OBJECTS.walls.length; i++) {
        let wall = LEVEL_OBJECTS.walls[i];
        wall.draw(ctx);
    }

    //ITEMS
    for (let i = 0; i < LEVEL_OBJECTS.items.length; i++) {
        let item = LEVEL_OBJECTS.items[i];
        if (!item.grabbed) {
            item.draw(ctx);
        }
    }

    //ENEMIES
    for (let i = 0; i < LEVEL_OBJECTS.enemies.length; i++) {
        let enemy = LEVEL_OBJECTS.enemies[i];
        enemy.draw(ctx);
        if (!USER_INTERFACE.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED) {
            enemy.updateLifes();
            enemy.collisionWithPlayer();
            enemy.followTarget(LEVEL_OBJECTS.player.position);
            enemy.applyMovements();
        }
    }

    //DOORS
    for (let i = 0; i < LEVEL_OBJECTS.doors.length; i++) {
        let door = LEVEL_OBJECTS.doors[i];
        door.draw(ctx);
    }

    //PLAYER
    if (!USER_INTERFACE.GAME_SETTINGS.MENU_ENABLED || USER_INTERFACE.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED) {
        //PLAYER MOVEMENTS
        if (KEYPRESSED["W"]) {
            LEVEL_OBJECTS.player.move.up = true;
        } else {
            LEVEL_OBJECTS.player.move.up = false;
        }
        if (KEYPRESSED["S"]) {
            LEVEL_OBJECTS.player.move.down = true;
        } else {
            LEVEL_OBJECTS.player.move.down = false;
        }
        if (KEYPRESSED["A"]) {
            LEVEL_OBJECTS.player.move.left = true;
        } else {
            LEVEL_OBJECTS.player.move.left = false;
        }
        if (KEYPRESSED["D"]) {
            LEVEL_OBJECTS.player.move.right = true;
        } else {
            LEVEL_OBJECTS.player.move.right = false;
        }
        LEVEL_OBJECTS.player.applyMovements();

        if (
            (KEYPRESSED["W"] || KEYPRESSED["A"] || KEYPRESSED["S"] || KEYPRESSED["D"]) &&
            USER_INTERFACE.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED
        ) {
            USER_INTERFACE.dungeonEditorUpdatePlayerPosition();
        }

        if (!USER_INTERFACE.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED) {
            //PLAYER SHOOTING
            if (KEYPRESSED["SPACE"]) {
                LEVEL_OBJECTS.player.shooting = true;
            } else {
                LEVEL_OBJECTS.player.shooting = false;
            }
            LEVEL_OBJECTS.player.updateShooting();

            //PLAYER EATS FOOD
            if (KEYPRESSED["F"]) {
                LEVEL_OBJECTS.player.eatFood();
            }

            //USING BOMB
            if (KEYPRESSED["B"]) {
                LEVEL_OBJECTS.player.useBomb();
            }

            //PLAYER COLLECTING ITEMS
            LEVEL_OBJECTS.player.collectItems();
        }
    }

    //PLAYER DRAWING
    LEVEL_OBJECTS.player.draw(ctx);

    //RESTORING TRANSLATING
    ctx.restore();
}
