class Wall {
    /**
     * Creates a wall object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     */
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.gridPosition = {
            row: y / 32,
            coll: x / 32,
        };
        this.image = IMAGES.img01;
    }

    /**
     * Draws object on the canvas
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}