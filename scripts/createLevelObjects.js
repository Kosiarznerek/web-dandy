/**
 * Creates level objects for passed level argument
 * @param {Number} level Level number
 * @param {boolean} createPlayer Defines if player object must be one more time assign to LEVEL_OBJECT.player or we can use exiting object
 * @returns {Object} Current level data
 */
function createLevelObjects(level, createPlayer = true) {
    if (level > USER_INTERFACE.GAME_SETTINGS.TOTAL_AMOUNT_OF_LEVELS) {
        level = 1;
        CURRENT_LEVEL = 1;
    }
    let levelData = undefined;
    switch (level) {
        case 1:
            levelData = JSON.parse(JSON.stringify(LEVEL01));
            break;
        case 2:
            levelData = JSON.parse(JSON.stringify(LEVEL02));
            break;
    }
    //CREATING LEVELS OBCJECTS
    let currentLevelObjects = {
        walls: [],
        doors: [],
        enemies: [],
        items: [],
        map: levelData,
        player: null,
    }

    for (let row = 0; row < levelData.length; row++) {
        for (let coll = 0; coll < levelData[row].length; coll++) {//10 - doors
            switch (levelData[row][coll]) {
                case "01":
                    let wall = new Wall(coll * 32, row * 32);
                    currentLevelObjects.walls.push(wall);
                    break;
                case "14":
                    if (createPlayer) {
                        let player = new Player(coll * 32, (row - 1) * 32);
                        currentLevelObjects.player = player;
                    } else {
                        currentLevelObjects.player = LEVEL_OBJECTS.player;
                    }

                case "02":
                case "07":
                case "08":
                case "11":
                case "13":
                case "14":
                    let itemClass = levelData[row][coll];
                    let item = new Item(coll * 32, row * 32, itemClass);
                    currentLevelObjects.items.push(item);
                    break;
                case "03":
                case "05":
                case "06":
                case "09":
                case "12":
                    let enemyClass = levelData[row][coll];
                    let enemy = new Enemy(coll * 32, row * 32, enemyClass);
                    currentLevelObjects.enemies.push(enemy);
                    break;
                case "10":
                    let door = new Door(coll * 32, row * 32);
                    currentLevelObjects.doors.push(door);
                    break;
            }
        }
    }

    return currentLevelObjects;
}
