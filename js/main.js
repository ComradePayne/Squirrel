window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        //Load tilemap
        game.load.tilemap('map', 'assets/sprites/squirrelMap.json', null, Phaser.Tilemap.TILED_JSON);

        
        
        //Loading images/sprites.
        game.load.image( 'tileset', 'assets/sprites/squirrelTileset.png' );
        game.load.spritesheet( 'squirrel', 'assets/sprites/squirrel32x32.png', 32,32 );
       
        game.load.image('treeSprite', 'assets/sprites/tree32x32.png');
        game.load.image('snowyTreeSprite', 'assets/sprites/snowytree32x32.png');
        game.load.image('acornSprite', 'assets/sprites/acorn32x32.png');
        
            //The spawn and exits as well!
        game.load.image('spawnSprite', 'assets/sprites/spawn32x32.png');
        game.load.image('exitSprite', 'assets/sprites/exit32x32.png');

        
        //Music loading
        
        game.load.audio('music', 'assets/music/Folk-Round.mp3');
        //SFX loading
        game.load.audio('cheep', 'assets/SFX/angrySquirrel.wav');

    }
    //Map and tileset
    var map;
    var tileset;
    
    //Layer/object variables
    var grassLayer;
    var snowyGrassLayer;
    
    var trees;
    var snowyTrees;
    var acorns;
    
    //Spawn will have only one member of the group.
    var spawn;
    var exit;
    
    //Squirrel, the Player
    var squirrel;
    var squirrelFacing;
    //Speed of the squirrel.
    var PLAYERSPEED = 100;

    //Background Music
    var music;
    //Squirrel cheep; plays when the squirrel collects an acorn.
    var cheep;
    
    //Controls
    var cursors;
    

    function create() {
        
        //PHYSICS!
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
     
        
        //Initialize the game map. 
        map = game.add.tilemap('map');
        map.addTilesetImage('SquirrelTileset', 'tileset');
        
         //Collision physics setup. Basically, only the 
        // tree objects and the acorn objects will be collidable.
        map.setCollision([1,4,5]);
        
        //Layers! Non objective.
        grassLayer = map.createLayer('Grass');
        snowyGrassLayer = map.createLayer('SnowyGrass');
        
        //resizes the game world to match the layer dimensions
        grassLayer.resizeWorld();
        snowyGrassLayer.resizeWorld();

        //Create the objects from the objects layers.
        createTrees();
        createSnowyTrees();
        createAcorns();
        
        //Squirrel Setup
        //create player
        createPlayer();
        
        //ANIMATIONS! Just one, actually.
        squirrel.animations.add('run', [0,1,2,3,4,5,6,7,8], 10, true);
        
        squirrel.anchor.x = 0.5;
        squirrel.anchor.y = 0.5;
    
 
        //we know there is just one result
        
        game.physics.arcade.enable(squirrel);
 
        //the camera will follow the player in the world
        game.camera.follow(squirrel);
 
        //move player with cursor keys
        cursors = game.input.keyboard.createCursorKeys();
        
        
       
        
        
        //Start the music!
        
        music = game.add.audio('music');
        music.play();
        
        
        
        
        
    }
    
    function update() {
        
        //Collision checking - with trees and snowyTrees!
        game.physics.arcade.collide(squirrel, trees);
        game.physics.arcade.collide(squirrel, snowyTrees);

        //Player controls - move when cursor keys pressed and such.
        playerControl();
        
        
    }
    
     function createTrees() {
    //create items
    trees = game.add.group();
    trees.enableBody = true;
    map.createFromObjects('Trees',5,'treeSprite', trees);
    
  }
    
    function createSnowyTrees() {
    //create items
    snowyTrees = game.add.group();
    snowyTrees.enableBody = true;
    map.createFromObjects('SnowyTrees', 4, 'snowyTreeSprite', snowyTrees);
        
    
    
  }
    
    function createAcorns() {
    //create items
    acorns = game.add.group();
    acorns.enableBody = true;
    map.createFromObjects('Acorn',1,'acornSprite', acorns);

    
  }
    
    function createPlayer(){
        //Set up the spawn point.
        spawn = game.add.group();
        map.createFromObjects('Player Spawn',6,'spawnSprite', spawn);
        //Put the squirrel at the spawn point.
        squirrel = game.add.sprite(64, 32, 'squirrel');
        
        squirrel.enableBody = true;
        
        
    }
    
    
    function playerControl(){
        squirrel.body.velocity.x = 0;
        squirrel.body.velocity.y = 0;
        
        
        //Left
        if(cursors.left.isDown){
            squirrel.body.velocity.x = (-1)*PLAYERSPEED;
            squirrel.rotation = (3.14)/2;
            squirrel.animations.play('run');
            
        }
            
            //Right
            
        else if(cursors.right.isDown){
            
            squirrel.body.velocity.x = PLAYERSPEED;
            squirrel.rotation = (3*3.14)/2;
            squirrel.animations.play('run');
            
        }
            //Up
        
        else if(cursors.up.isDown){
            squirrel.body.velocity.y = (-1)*PLAYERSPEED;
            squirrel.rotation = (3.14);
            squirrel.animations.play('run');
            
            
        }
            
            //Down
        else if(cursors.down.isDown){
            squirrel.body.velocity.y = PLAYERSPEED;
            squirrel.rotation = 0;
            squirrel.animations.play('run');
             
        }
        
        //Idle
        else{
            
            squirrel.animations.stop();
            squirrel.frame = 0;
            
        }
        
        
    }
    
    
    
   
    
  
    
};
