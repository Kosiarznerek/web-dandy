class Enemy {
    /**
     * Creates an Enemy object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     * @param {String} className Enemy class
     */
    constructor(x, y, className) {
        this.position = new Vector2(x, y);
        this.gridPosition = {
            row: y / 32,
            coll: x / 32,
        };

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

        this.className = className;
        this.FOV = 220; // how far enemy is able to see target

        this.static = null;
        this.lifes = null;
        this.dead = false;

        this._image = null;
        switch (this.className) {
            case "03":
                this._image = IMAGES.img03;
                this.lifes = 2;
                this.static = false;
                break;
            case "05":
                this._image = IMAGES.img05;
                this.lifes = 1;
                this.static = false;
                break;
            case "06":
                this._image = IMAGES.img06;
                this.lifes = 3;
                this.static = false;
                break;
            case "09":
                this._image = IMAGES.img09;
                this.lifes = 4;
                this.static = true;
                break;
            case "12":
                this.static = true;
                this.lifes = Infinity;
                this._image = IMAGES.img12;
                break;
            default:
                console.error("ENEMY CLASS NAME UNRECOGNIZED: " + this.className);
                break;
        }
    }

    /**
     * Drawing Enemy object on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.dead) {
            ctx.drawImage(this._image, this.position.x, this.position.y);
        }
    }

    /**
     * Selects enemy's image according to it's lifes amount and when it's 0 sets the dead variable to true
     */
    updateLifes() {
        switch (this.lifes) {
            case 1:
                this._image = IMAGES.img05;
                this.className = "05";
                this.static = false;
                break;
            case 2:
                this._image = IMAGES.img03;
                this.className = "03";
                this.static = false;
                break;
            case 3:
                this._image = IMAGES.img06;
                this.className = "06";
                this.static = false;
                break;
            case 4:
                this._image = IMAGES.img09;
                this.className = "09";
                this.static = true;
                break;
            case 0:
                LEVEL_OBJECTS.map[this.gridPosition.row][this.gridPosition.coll] = "XX";
                this.dead = true;
                break;
        }
    }

    /**
     * Causes that enemy follow by target by changing boolean variables in move object
     * @param {Vector2} targetPosition
     */
    followTarget(targetPosition) {
        for (let dir in this.move) {
            this.move[dir] = false;
        }

        if (targetPosition.distanceTo(this.position) <= this.FOV && !this.dead && !this.static) {
            let direction = new Vector2();
            direction.copy(targetPosition);
            direction.substract(this.position);

            //X
            if (Math.abs(direction.x) > Math.abs(direction.y) && this._isAbleToMove(new Vector2(direction.x, 0))) {
                direction.positionSet(direction.x, 0);
            }
            //Y
            else if (Math.abs(direction.x) <= Math.abs(direction.y) && this._isAbleToMove(new Vector2(0, direction.y))) {
                direction.positionSet(0, direction.y);
            }

            if (direction.x > 0) {
                this.move.right = true;
            }
            if (direction.x < 0) {
                this.move.left = true;
            }
            if (direction.y > 0) {
                this.move.down = true;
            }
            if (direction.y < 0) {
                this.move.up = true;
            }
        }

    }

    /**
     * Checking if Enemy is able to move in direction according to the given direction and map array in global LEVEL_OBJECTS.map
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
        switch (LEVEL_OBJECTS.map[row][coll]) {
            case "01":
            case "02":
            case "03":
            case "05":
            case "06":
            case "09":
            case "10":
            case "13":
            case "14":
            case "08":
                return false;

            default:
                return true;
        }
    }

    /**
     * Updates Enemy position in the global LEVEL_OBJECTS.map and it's own grid position
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
        LEVEL_OBJECTS.map[row][coll] = this.className;
        this.gridPosition.row = row;
        this.gridPosition.coll = coll;
    }

    /**
     * Changing Enemy position according to the boolean move values
     */
    applyMovements() {
        //RESTARTING STOPWATCHES ACCORIND TO THEIR CURRENT TIME
        for (let direction in this._movesStopwatch) {
            let stopwatch = this._movesStopwatch[direction];
            if (stopwatch.currentTime >= 100) {
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
        if (this._isAbleToMove(direction) && !this.dead) {
            this._updatePosition(direction);
            let that = this;
            let counter = 0;
            let inter = setInterval(function () {
                let steps = 14;
                let v = new Vector2();
                v.copy(direction);
                v.divideScalar(steps);

                that.position.add(v);
                counter++;
                if (counter == steps) {
                    clearInterval(inter);
                }
            }, 15);

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
        }
    }

    /**
     * Checks if Enemy hit Player
     */
    collisionWithPlayer() {
        let player = LEVEL_OBJECTS.player;

        if (player.gridPosition.row == this.gridPosition.row && player.gridPosition.coll == this.gridPosition.coll && !this.dead) {
            player.health -= 10;
            player.updateStats();
            this.lifes -= 1;
            this.updateLifes();
        }
    }
}
