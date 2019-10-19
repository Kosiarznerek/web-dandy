class Item {
    /**
     * Creates an Item object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     * @param {String} className Class name of item
     */
    constructor(x, y, className) {
        this.position = new Vector2(x, y);
        this.gridPosition = {
            row: y / 32,
            coll: x / 32,
        }
        this.className = className;
        this.grabbed = false;
        this._image = null;
        switch (this.className) {
            case "02":
                this._image = IMAGES.img02;
                break;
            case "07":
                this._image = IMAGES.img07;
                break;
            case "08":
                this._image = IMAGES.img08;
                break;
            case "11":
                this._image = IMAGES.img11;
                break;
            case "13":
                this._image = IMAGES.img13;
                break;
            case "14":
                this._image = IMAGES.img14;
                break;
            default:
                console.error("ITEM CLASS NAME UNRECOGNIZED " + this.className);
                break;
        }
    }

    /**
     * Draws item on canvas context
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        ctx.drawImage(this._image, this.position.x, this.position.y);
    }
}
