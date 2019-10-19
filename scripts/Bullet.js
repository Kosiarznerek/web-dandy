class Bullet {
    /**
     * Creates a Bullet object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     * @param {Vector2} direction Normalized Vector2
     */
    constructor(x, y, direction) {
        this.position = new Vector2(x, y);
        this.gridPosition = {
            row: y / 32,
            coll: x / 32,
        };
        this.direction = direction;
        this.direction.normalize();

        this.hittsEnemy = undefined;
        this.smashed = false;

        this._image = null;
        if (this.direction.x > 0) {
            this._image = IMAGES.bulletRight;
        }
        if (this.direction.x < 0) {
            this._image = IMAGES.bulletLeft;
        }
        if (this.direction.y > 0) {
            this._image = IMAGES.bulletDown;
        }
        if (this.direction.y < 0) {
            this._image = IMAGES.bulletUp;
        }
    }

    /**
     * Draws Bullet object on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this._image, this.position.x, this.position.y);
    }

    /**
     * Updates bullet position by aplying force
     */
    applyForce() {
        if (!this.smashed) {
            let force = new Vector2(this.direction.x, this.direction.y);
            force.multiplyScalar(8);
            this.position.add(force);

            //UPDATING GRID POSITION
            if (Number.isInteger(this.position.x) && Number.isInteger(this.position.y)) {
                this.gridPosition.row = parseInt(this.position.y / 32);
                this.gridPosition.coll = parseInt(this.position.x / 32);
            }
        }
    }

    /**
     * Checks collision with objects on map according to global LEVEL_OBJECTS.map
     */
    checkCollisions() {
        let row = this.gridPosition.row
        let coll = this.gridPosition.coll;
        if (this.direction.x > 0 || this.direction.y > 0) {
            row += this.direction.y;
            coll += this.direction.x;
        }

        if (LEVEL_OBJECTS.map[row][coll] != "XX") {
            //IF IT WAS ENEMY
            switch (LEVEL_OBJECTS.map[row][coll]) {
                case "03":
                case "05":
                case "06":
                case "09":
                case "12":
                    //LOOKING FOR HITTED ENEMY
                    for (let i = 0; i < LEVEL_OBJECTS.enemies.length; i++) {
                        let enemy = LEVEL_OBJECTS.enemies[i];
                        if (enemy.gridPosition.row == row && enemy.gridPosition.coll == coll) {
                            enemy.lifes--;
                            this.hittsEnemy = enemy;
                            break;
                        }
                    }
                    break;
            }
            this.smashed = true;
        }
    }

    /**
     * Function checks if bullet is still on canvas view according to player position and canvas size
     * @returns {boolean}
     */
    isOffCanvas() {
        let playerPosition = LEVEL_OBJECTS.player.position;
        if (Math.abs(this.position.x - playerPosition.x) > (640 / 2) + 32) {
            return true;
        } else if (Math.abs(this.position.y - playerPosition.y) > (306 / 2) + 32) {
            return true;
        } else {
            return false;
        }
    }

}
