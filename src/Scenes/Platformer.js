class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 500;
        this.DRAG = 900;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.respawnPoint = { x: 0, y: 250 }; // Where the player will respawn
        this.physics.world.drawDebug = !this.physics.world.drawDebug;
    }

    create() {
        this.map = this.add.tilemap("respawnLevel", 18, 18, 45, 25);
        this.tileset = this.map.addTilesetImage("tilemap_packed", "tilemap_tiles");
        this.groundLayer = this.map.createLayer("groundLayer", this.tileset, 0, 0);

        // TODO Checkpoints
        // Create a checkPoint ground to lump together all objects named checkpoint
        // Then using spawnPoints we reference all the objects in the layer, create them, and place inside checkPoints
        // The numbed after tilemap_sheet should match the ID of the object you want to be created
        // setAllowGravity to be false to prevent object from falling
        // setImmoveable to be false to prevent any accidental movement of the checkPoint

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(this.respawnPoint.x, this.respawnPoint.y, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true,
        });

        // Enable collision handling
        //collide(object1, [object2], [collideCallback], [processCallback], [callbackContext])
        //https://newdocs.phaser.io/docs/3.55.2/focus/Phaser.Physics.Arcade.ArcadePhysics-collide
        // Collision detection between the player and the ground layer which calls the function dangerCollision to deal with respawns
        // null is provided because we don't have another function to check and this is added at the end to know we are working in this
        // current scene
        this.physics.add.collider(my.sprite.player, this.groundLayer, this.dangerCollision, null, this);
        // TODO Player/ Check Point Overlap

        // setup camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player.body, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2.0);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
    }

    // Checks for which tile is tagged with danger to trigger respawn
    dangerCollision(player, tile) {
        if (tile.properties && tile.properties.danger) {
            this.playerRespawn();
        }
    }

    // Respawns the player to a set location
    playerRespawn() {
        console.log("respawn check");
        my.sprite.player.body.x = this.respawnPoint.x;
        my.sprite.player.body.y = this.respawnPoint.y;
    }

    // TODO Update respawnPoint
    // Updates the location where a player respawns


    update() {
        if (cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if (cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(+this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG)
            my.sprite.player.anims.play('idle');
        }

        // player jump
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if (my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
    }
}