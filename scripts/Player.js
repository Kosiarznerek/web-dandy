class Player {
    /**
     * Creates a Player object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     */
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.gridPosition = {
            row: y / 32,
            coll: x / 32,
        };

        this.lookingDirection = new Vector2(0, -1);

        this.move = {
            left: false,
            right: false,
            up: false,
            down: false,
        };
        this._movesStopwatch = {
            left: new Stopwatch(1),
            right: new Stopwatch(1),
            up: new Stopwatch(1),
            down: new Stopwatch(1),
        }
        this.image = IMAGES.img04;

        this.health = 100;
        this.scores = 0;
        this.backpack = { //Items objects
            food: [],
            bombs: [],
            keys: [],
        };
        this.eating = false;

        this.bullets = [];
        this.shooting = false;
    }

    /**
     * Draws a player on a canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(ctx);
        }
    }

    /**
     * Checking if Player is able to move in direction according to the given direction and map array in global LEVEL_OBJECTS.map
     * @param {Vector2} direction
     * @returns {boolean}
     */
    _isAbleToMove(direction) {
        let row = this.gridPosition.row;
        let coll = this.gridPosition.coll;
        if (direction.x > 0) {
            coll += 1;
        }
        if (direction.x < 0) {
            coll -= 1;
        }
        if (direction.y < 0) {
            row -= 1;
        }
        if (direction.y > 0) {
            row += 1;
        }

        //DUNGEON EDITOR
        if (USER_INTERFACE.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED) {
            if (row == 0 || row == 29) {
                return false;
            }
            if (coll == 0 || coll == 59) {
                return false;
            }
            return true;
        }

        switch (LEVEL_OBJECTS.map[row][coll]) {
            case "01":
            case "09":
            case "14":
                return false;
            case "10":
                return this.openDoor(row, coll);
            case "13":
                USER_INTERFACE.GAME_SETTINGS.CURRENT_LEVEL++;
                let savedScored = this.scores;
                LEVEL_OBJECTS = createLevelObjects(USER_INTERFACE.GAME_SETTINGS.CURRENT_LEVEL);
                LEVEL_OBJECTS.player.scores = savedScored;
                LEVEL_OBJECTS.player.updateStats();
                break;

            default:
                return true;
        }
    }

    /**
     * Updates Player position in the global LEVEL_OBJECTS.map and it's own grid position
     * @param {Vector2} direction Direction that he moved
     */
    _updatePosition(direction) {
        let row = this.gridPosition.row;
        let coll = this.gridPosition.coll;
        if (direction.x > 0) {
            coll += 1;
        }
        if (direction.x < 0) {
            coll -= 1;
        }
        if (direction.y < 0) {
            row -= 1;
        }
        if (direction.y > 0) {
            row += 1;
        }

        LEVEL_OBJECTS.map[this.gridPosition.row][this.gridPosition.coll] = "XX";
        LEVEL_OBJECTS.map[row][coll] = "04";
        this.gridPosition.row = row;
        this.gridPosition.coll = coll;
    }

    /**
     * Changing Player position according to the boolean move values
     */
    applyMovements() {
        //RESTARTING STOPWATCHES ACCORIND TO THEIR CURRENT TIME
        for (let direction in this._movesStopwatch) {
            let stopwatch = this._movesStopwatch[direction];
            if (stopwatch.currentTime >= 35) {
                stopwatch.reset();
            }
        }

        let direction = new Vector2();
        if (this.move.left && this._movesStopwatch.left.currentTime == 0) {
            direction.x = -32;
        }
        if (this.move.right && this._movesStopwatch.right.currentTime == 0) {
            direction.x = 32;
        }
        if (this.move.up && this._movesStopwatch.up.currentTime == 0) {
            direction.y = -32;
        }
        if (this.move.down && this._movesStopwatch.down.currentTime == 0) {
            direction.y = 32;
        }

        //SMOOTH MOVEMNT TO DESTINATION ONLY IS PLAYER IS ABLE TO
        if (this._isAbleToMove(direction)) {
            this._updatePosition(direction);
            let that = this;
            let counter = 0;
            let inter = setInterval(function () {
                let steps = 8;
                let v = new Vector2();
                v.copy(direction);
                v.divideScalar(steps);

                that.position.add(v);
                counter++;
                if (counter == steps) {
                    clearInterval(inter);
                }
            }, 10);

            //UPDATING STOWATCHES
            if (direction.x < 0) {
                this._movesStopwatch.left.start();
            }
            if (direction.x > 0) {
                this._movesStopwatch.right.start();
            }
            if (direction.y < 0) {
                this._movesStopwatch.up.start();
            }
            if (direction.y > 0) {
                this._movesStopwatch.down.start();
            }

            //UPDATING LOOKING DIRECTION
            if (direction.x > 0) {
                this.lookingDirection.positionSet(1, 0);
            }
            if (direction.x < 0) {
                this.lookingDirection.positionSet(-1, 0);
            }
            if (direction.y > 0) {
                this.lookingDirection.positionSet(0, 1);
            }
            if (direction.y < 0) {
                this.lookingDirection.positionSet(0, -1);
            }
        }
    }

    /**
     * Updates / shows player's current statistics in the HTML DOM Element with id 'playerStats'
     */
    updateStats() {
        if (this.health <= 0) {
            LEVEL_OBJECTS = createLevelObjects(USER_INTERFACE.GAME_SETTINGS.CURRENT_LEVEL);
            LEVEL_OBJECTS.player.health = 100;
            setTimeout(function () {
                LEVEL_OBJECTS.player.updateStats();
            }, 100)
        }

        let health = padNumber(this.health, 2) + "%";
        document.getElementById("health").innerHTML = "Health:" + health

        let food = this.backpack.food.length;
        document.getElementById("food").innerHTML = "Food:" + food;

        let bombs = this.backpack.bombs.length;
        document.getElementById("bombs").innerHTML = "Bombs:" + bombs;

        let keys = this.backpack.keys.length;
        document.getElementById("keys").innerHTML = "Keys:" + keys;

        let scores = padNumber(this.scores, 6);
        document.getElementById("scores").innerHTML = "Scores:" + scores;
    }

    /**
     * Creating bullets when shooting, update buttets position, and removing them when it's smashed or off canvas
     */
    updateShooting() {
        let that = this;

        /**
         * Functions checks if player is't next to wall in a direction he want to shoot
         * @returns {boolean}
         */
        function notToClose() {
            let row = that.gridPosition.row + that.lookingDirection.y;
            let coll = that.gridPosition.coll + that.lookingDirection.x;
            if (LEVEL_OBJECTS.map[row][coll] == "XX") {
                return true
            } else return false;
        }

        //ADDING BULLETS TO ARRAY
        if (this.shooting && this.bullets.length == 0 && notToClose()) {
            let startingPosition = new Vector2(this.position.x, this.position.y);
            startingPosition.x += this.lookingDirection.x * 32;
            startingPosition.y += this.lookingDirection.y * 32;
            let direction = new Vector2();
            direction.copy(this.lookingDirection)
            let bullet = new Bullet(startingPosition.x, startingPosition.y, direction);
            this.bullets.push(bullet);
        }

        //UPDATING BULLETS
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].applyForce();
            this.bullets[i].checkCollisions();
            if (this.bullets[i].hittsEnemy) {
                this.scores += 400;
                this.updateStats();
            }
            if (this.bullets[i].smashed || this.bullets[i].isOffCanvas()) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Checks if player position (grid) is the same as item on a global map and when it is player grabs it
     */
    collectItems() {
        let row = this.gridPosition.row;
        let coll = this.gridPosition.coll;
        let grabbedItem = undefined; //not found yet
        let itemIndex = undefined;

        if (LEVEL_OBJECTS.map[row][coll] != "XX") {
            //LOOKING FOR AN ITEM WITH THE SAME POSITION
            for (let i = 0; i < LEVEL_OBJECTS.items.length; i++) {
                let item = LEVEL_OBJECTS.items[i];
                if (item.gridPosition.row == row && item.gridPosition.coll == coll && !item.grabbed) {
                    grabbedItem = item;
                    itemIndex = i;
                    break;
                }
            }
        }

        if (grabbedItem) {
            this.grabItem(grabbedItem)
        }
    }

    /**
     * Adding item to Player's backpack, updating stats and make it's boolean variable grabbed = true
     * @param {Item} item Item to grab
     * @param {Number} index Index of item in a global LEVEL_OBJECTS.items
     */
    grabItem(item, index) {
        //UPDATING STATS
        switch (item.className) {
            case "02":
                this.scores += 200;
                break;
            case "07":
                this.backpack.bombs.push(item);
                break;
            case "08":
                this.backpack.food.push(item);
                break;
            case "11":
                this.backpack.keys.push(item);
                break;
            case "13":
                console.info("NEXT LEVEL");
                break;
        }
        this.updateStats();

        //SELECTING GRABBED ITEM
        item.grabbed = true;

        //CHANGING ON THE MAP
        LEVEL_OBJECTS.map[this.gridPosition.row][this.gridPosition.coll] = "XX";
    }

    /**
     * Player eats food which gives him health
     */
    eatFood() {
        if (this.backpack.food.length != 0 && !this.eating) {
            this.eating = true;
            this.backpack.food.splice(0, 1);
            this.health += 20;
            if (this.health > 100) {
                this.health = 100;
            }
            this.updateStats();
            let that = this;
            setTimeout(function () {
                that.eating = false;
            }, 1000)
        }
    }

    /**
     * Opens the door where player want to move
     * @param {Number} row  Row's number according to the global LEVEL_OBJECTS.map
     * @param {Number} coll Collumn's number according to the global LEVEL_OBJECTS.map
     * @returns {boolean} True when player was able to open the door
     */
    openDoor(row, coll) {
        if (LEVEL_OBJECTS.map[row][coll] == "10" && this.backpack.keys.length != 0) {
            LEVEL_OBJECTS.map[row][coll] = "XX";
            this.backpack.keys.splice(0, 1);
            this.updateStats();

            for (let i = 0; i < LEVEL_OBJECTS.doors.length; i++) {
                let door = LEVEL_OBJECTS.doors[i];
                if (door.gridPosition.row == row && door.gridPosition.coll == coll) {
                    LEVEL_OBJECTS.doors.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Couses that bomb gonna explode
     */
    useBomb() {
        if (this.backpack.bombs.length != 0) {
            this.backpack.bombs.splice(0, 1);
            this.updateStats();

            //LOOKING FOR KILLED ENEMIES
            for (let i = 0; i < LEVEL_OBJECTS.enemies.length; i++) {
                let enemy = LEVEL_OBJECTS.enemies[i];
                if (this.position.distanceTo(enemy.position) < 500) {
                    enemy.lifes = 0;
                    enemy.updateLifes();
                }
            }
        }
    }
}
