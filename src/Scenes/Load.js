class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        //this.load.setPath("./assets/");

        // Load characters spritesheet
        //this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        //this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        //this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON
    }

    create() {
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}