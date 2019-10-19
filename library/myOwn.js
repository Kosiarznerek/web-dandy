/**Freezes recursively each property of object and makes it constant.
 * @param {Object} obj Object to freeze
 * @returns {void}
 */
function ObjectDeepFreeze(obj) {
    var propNames = Object.getOwnPropertyNames(obj);
    propNames.forEach(function (name) {
        var prop = obj[name];
        if (typeof prop == 'object' && prop !== null)
            ObjectDeepFreeze(prop);
    });
    return Object.freeze(obj);
}

/**Function preload all graphics and replace paths to the image objects
 * @param {Object} obj Object with image's source paths
 * @param {function} callBack Function which will be called when all images will be preloaded
 * @returns {void}
 */
function PreloadGraphics(obj, callBack) {
    let totalAmountOfImages = Object.keys(obj).length;
    let imagesLoaded = 0;
    for (let imageSrc in obj) {
        (function (imageSrc) {
            let image = new Image();
            image.onload = function () {
                obj[imageSrc] = image;
                imagesLoaded++;
                if (imagesLoaded == totalAmountOfImages) {
                    if (callBack) {
                        try {
                            callBack()
                        } catch (e) {
                            console.error(e)
                        }
                        ;
                    }
                }
            }
            image.src = obj[imageSrc];
        }(imageSrc))
    }
}

//STOPWATCH
class Stopwatch {
    /**
     * Creates a Stopwatch object
     * @param {Number} [steps=1000] Time in miliseconds which must pass to increase the currentTime variable by 1
     */
    constructor(steps) {
        this.currentTime = 0;
        this._interval = undefined;
        this._steps = steps || 1000;
    }

    /**
     * Starts the Stopwatch
     */
    start() {
        if (this.currentTime == 0) {
            let that = this;
            this._interval = setInterval(function () {
                that.currentTime += 1;
            }, this._steps)
        } else {
            console.error("Reset the timer first, than you can start it")
        }
    }

    /**
     * Stops the Stopwatch
     */
    stop() {
        clearInterval(this._interval);
    }

    /**
     * Resets the Stopwatch
     */
    reset() {
        clearInterval(this._interval);
        this.currentTime = 0;
    }
}

class Vector2 {
    /**
     * Creates a 2D Vector object
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     */
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * Calculating length of Vector
     */
    get length() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Sets Vector's position
     * @param {Number} x Position 'x' in the coordinate system
     * @param {Number} y Position 'y' in the coordinate system
     */
    positionSet(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Copies values from given Vector
     * @param {Vector2} vect
     */
    copy(vect) {
        this.x = vect.x;
        this.y = vect.y;
    }

    /**
     * Adds to Vector another Vector
     * @param {Vector2} vect
     */
    add(vect) {
        this.x += vect.x;
        this.y += vect.y;
    }

    /**
     * Substracts two Vectors
     * @param {Vector2} vect Subtrahend
     */
    substract(vect) {
        this.x -= vect.x;
        this.y -= vect.y;
    }

    /**
     * Sets the length of Vector to 1 by dividing it's compotents by the length of Vector
     */
    normalize() {
        let vLength = Math.hypot(this.x, this.y)
        this.x = this.x / vLength;
        this.y = this.y / vLength;
    }

    /**
     * Mulpitlies each component of Vector by given value
     * @param {Number} value
     */
    multiplyScalar(value) {
        if (value == 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x *= value;
            this.y *= value;
        }
    }

    /**
     * Divides each component of Vector by given value
     * @param {Number} value
     */
    divideScalar(value) {
        this.x /= value;
        this.y /= value;
    }

    /**
     * Calculates distance beetween two Vectors
     * @param {Vector2} vect
     * @returns {Number}
     */
    distanceTo(vect) {
        return Math.hypot(this.x - vect.x, this.y - vect.y);
    }
}

/**
 * Set's length of given number by adding needed amount of symbols at the begining
 * @param {Number} n Number to convert
 * @param {Number} width Length of number
 * @param {String} [z] Symbol to pad with. Default is '0'
 * @returns {String} Number
 */
function padNumber(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
