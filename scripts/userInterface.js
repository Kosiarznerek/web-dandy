/**
 * Creates objects whitch allows to control game
 */
class UserInterface {
    constructor() {
        this.playerStats = document.getElementById("playerStats");
        this.topBar01 = document.getElementById("topBar01");
        this.topBar02 = document.getElementById("topBar02");
        this.topBar03 = document.getElementById("topBar03");
        this.bottomBar = document.getElementById("bottomBar");

        this._gameModes = ["ONE PLAYER", "DUNGEON EDITOR"];

        let that = this;
        this.GAME_SETTINGS = {
            CURRENT_LEVEL: 1,
            TOTAL_AMOUNT_OF_LEVELS: 2,
            DIFFICULTY: "EASY", /*TRIVIAL-EASY-HARD-DEADLY*/
            GAME_MODE: that._gameModes[0],
            MENU_ENABLED: true,
            DUNGEON_EDITOR_ENABLED: false,
        };
    };

    initializeGameMenu() {
        this.playerStats.innerHTML = "<h1>Letter 1-2 starts game at that level</h1>";
        this.topBar01.innerHTML = "<h1>L changes degree of difficulty</h1>";
        this.topBar02.innerHTML = "<h1>M changes game mode</h1>";
        this.topBar03.innerHTML = "<h1>B begins game</h1>";
        this.updateBottomBar();
    }

    updateBottomBar() {
        let string = "<h1>Mode: " + this.GAME_SETTINGS.GAME_MODE + " " + this.GAME_SETTINGS.DIFFICULTY + " " + "LEVEL: " + this.GAME_SETTINGS.CURRENT_LEVEL + "</h1>";
        this.bottomBar.innerHTML = string;
    }

    initializePlayerStats() {
        this.playerStats.innerHTML = "";

        let health = document.createElement("h1");
        health.id = "health";
        this.playerStats.appendChild(health);

        let food = document.createElement("h1");
        food.id = "food";
        this.playerStats.appendChild(food);

        let bombs = document.createElement("h1");
        bombs.id = "bombs";
        this.playerStats.appendChild(bombs);

        let keys = document.createElement("h1");
        keys.id = "keys";
        this.playerStats.appendChild(keys);

        let scores = document.createElement("h1");
        scores.id = "scores";
        this.playerStats.appendChild(scores);
    }

    /**
     * Controls game acording to the global KEYPRESS object
     */
    gameMenuControling() {
        if (this.GAME_SETTINGS.MENU_ENABLED) {
            //WHEN DUNGEON EDITOR IS DISABLED
            if (!this.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED) {
                //SELECTING LEVEL
                if (KEYPRESSED["1"]) {
                    this._changeLevel(1);
                }
                if (KEYPRESSED["2"]) {
                    this._changeLevel(2);
                }
                if (KEYPRESSED["M"]) {
                    this._changeGameMode()
                }
                if (KEYPRESSED["B"]) {
                    switch (this.GAME_SETTINGS.GAME_MODE) {
                        case "ONE PLAYER":
                            this._beginGame();
                            break;
                        case "DUNGEON EDITOR":
                            this._enableDungeonEditor();
                            break;
                    }
                }
            }

            //ONLY FOR DUNGEON EDITOR
            else if (this.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED) {
                if (KEYPRESSED["ARROWLEFT"]) {
                    this._changeLevel("down")
                }
                if (KEYPRESSED["ARROWRIGHT"]) {
                    this._changeLevel("up")
                }
                if (KEYPRESSED["Q"]) {
                    this._exitDungeonEditor();
                }
                //EDITING MAP
                if (KEYPRESSED["O"]) {
                    this._editGameMap("XX")
                }
                ;
                if (KEYPRESSED["K"]) {
                    this._editGameMap("01")
                }
                ;
                if (KEYPRESSED["M"]) {
                    this._editGameMap("02")
                }
                ;
                if (KEYPRESSED["I"]) {
                    this._editGameMap("03")
                }
                ;
                if (KEYPRESSED["J"]) {
                    this._editGameMap("05")
                }
                ;
                if (KEYPRESSED["N"]) {
                    this._editGameMap("06")
                }
                ;
                if (KEYPRESSED["U"]) {
                    this._editGameMap("07")
                }
                ;
                if (KEYPRESSED["H"]) {
                    this._editGameMap("08")
                }
                ;
                if (KEYPRESSED["B"]) {
                    this._editGameMap("09")
                }
                ;
                if (KEYPRESSED["Y"]) {
                    this._editGameMap("10")
                }
                ;
                if (KEYPRESSED["G"]) {
                    this._editGameMap("11")
                }
                ;
                if (KEYPRESSED["V"]) {
                    this._editGameMap("12")
                }
                ;
            }
        }
    }

    /**
     * Edits game map at the currently selected level and at the players current grid position
     * @param {String} itemID
     */
    _editGameMap(itemID) {
        let levelToEdit = this.GAME_SETTINGS.CURRENT_LEVEL;
        let mapToEdit = undefined;
        switch (levelToEdit) {
            case 1:
                mapToEdit = LEVEL01;
                break;
            case 2:
                mapToEdit = LEVEL02;
                break;
        }

        let pPos = LEVEL_OBJECTS.player.gridPosition;
        let currentItem = mapToEdit[pPos.row][pPos.coll];

        if (currentItem != "14" && currentItem != "13" && mapToEdit[pPos.row + 1][pPos.coll] != "14") {
            mapToEdit[pPos.row][pPos.coll] = itemID;
            LEVEL_OBJECTS = createLevelObjects(this.GAME_SETTINGS.CURRENT_LEVEL, false);
        }
    }

    /**
     * Closes dungeon editor
     */
    _exitDungeonEditor() {
        this.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED = false;
        LEVEL_OBJECTS = createLevelObjects(this.GAME_SETTINGS.CURRENT_LEVEL);
        this.initializeGameMenu();
    }

    /**
     * Changing game levels
     * @param {Number|String} level Level that you want to set or string UP or DOWN
     */
    _changeLevel(level) {
        if (typeof level == "number" && Number.isInteger(level)) {
            this.GAME_SETTINGS.CURRENT_LEVEL = level;
            LEVEL_OBJECTS = createLevelObjects(this.GAME_SETTINGS.CURRENT_LEVEL);
            this.updateBottomBar();
        } else if (typeof level == "string") {
            let currentLevel = this.GAME_SETTINGS.CURRENT_LEVEL;
            let newCurrent = currentLevel;
            switch (level.toUpperCase()) {
                case "UP":
                    newCurrent++;
                    break;
                case "DOWN":
                    newCurrent--;
                    break;
                default:
                    console.error("UNRECOGNIZED LEVEL IN USER INTERFACE " + level);
                    break;
            }
            //validation
            if (newCurrent < 1) {
                newCurrent = this.GAME_SETTINGS.TOTAL_AMOUNT_OF_LEVELS
            }
            ;
            if (newCurrent > this.GAME_SETTINGS.TOTAL_AMOUNT_OF_LEVELS) {
                newCurrent = 1;
            }
            ;
            this._changeLevel(newCurrent);
        }
    }

    /**
     * Changes game mode to the next one in the gameModes array
     */
    _changeGameMode() {
        let currentGameMode = this.GAME_SETTINGS.GAME_MODE;
        let currentIndex = this._gameModes.indexOf(currentGameMode);
        let nextIndex = currentIndex + 1;
        if (nextIndex > this._gameModes.length - 1) {
            nextIndex = 0;
        }
        this.GAME_SETTINGS.GAME_MODE = this._gameModes[nextIndex];
        this.updateBottomBar();
    }

    /**
     * Begins the game
     */
    _beginGame() {
        this.GAME_SETTINGS.MENU_ENABLED = false;
        this.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED = false;

        this.playerStats.innerHTML = "";
        this.topBar01.innerHTML = "";
        this.topBar02.innerHTML = "";
        this.topBar03.innerHTML = "";
        this.initializePlayerStats();
        LEVEL_OBJECTS.player.updateStats();
    }

    /**
     * Enables Dungeon Editor and allows user to change game map
     */
    _enableDungeonEditor() {
        this.GAME_SETTINGS.DUNGEON_EDITOR_ENABLED = true;
        this.playerStats.innerHTML = "<h1>Type: \"OKMIJNUHBYG\" to draw item.</h1>";
        this.topBar01.innerHTML = "<h1>ARROW_LEFT level down ARROW_RIGHT level up</h1>";
        this.topBar03.innerHTML = "<h1>\"Q\" exit editor</h1>";
        this.dungeonEditorUpdatePlayerPosition();
    }

    /**
     * Every time player moves we gonna update his position
     */
    dungeonEditorUpdatePlayerPosition() {
        let pPos = LEVEL_OBJECTS.player.gridPosition;
        this.topBar02.innerHTML = "<h1> (" + pPos.row + "," + pPos.coll + ") </h1>";
    }
}
