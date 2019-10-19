class Door {
    /**
     * Creates Door object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     */
    constructor(x, y) {
        this.position = new Vector2(x, y);
        this.gridPosition = {
            row: y / 32,
            coll: x / 32,
        };
        this._image = IMAGES.img10;
    }

    /**
     * Draws Door object on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this._image, this.position.x, this.position.y);
    }
}