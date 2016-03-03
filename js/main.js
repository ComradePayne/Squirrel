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
    var spawn;
    var exit;
    
    //Squirrel, the Player
    var squirrel;
    
    //Music
    var music;
    //SFX
    var cheep;
    
    //Controls
    var cursors;
    

    function create() {
        
        //Physics!
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
     
        
        //Initialize the game map. 
        map = game.add.tilemap('map');
        map.addTilesetImage('SquirrelTileset', 'tileset');
        
        //Layers! Non objective.
        grassLayer = map.createLayer('Grass');
        snowyGrassLayer = map.createLayer('SnowyGrass');
        
        
        //Collision!
//        map.setCollisionBetween(1,4000,true,'treeLayer');
//        map.setCollisionBetween(1,4000,true,'snowyTreeLayer');
//        
        //resizes the game world to match the layer dimensions
        grassLayer.resizeWorld();
        snowyGrassLayer.resizeWorld();

        //Create the objects from the objects layers.
        createTrees();
        createSnowyTrees();
        createAcorns();
        
        //Squirrel Setup
        //create player
        var result = findObjectsByType('spawn', map, 'Player Spawn');
 
        //we know there is just one result
        squirrel = game.add.sprite(result[0].x, result[0].y, 'squirrel');
        game.physics.arcade.enable(squirrel);
 
        //the camera will follow the player in the world
        game.camera.follow(squirrel);
 
        //move player with cursor keys
        cursors = game.input.keyboard.createCursorKeys();
        
        
        
    }
    
    function update() {
        
    }
    
     function createTrees() {
    //create items
    trees = game.add.group();
    trees.enableBody = true;
    var tree;    
    var result = findObjectsByType('tree', map, 'Trees');
    result.forEach(function(element){
      createFromTiledObject(element, trees);
    }, this);
  }
    
    function createSnowyTrees() {
    //create items
    snowyTrees = game.add.group();
    snowyTrees.enableBody = true;
    var snowytree;    
    var result = findObjectsByType('snowyTree', map, 'SnowyTrees');
    result.forEach(function(element){
      createFromTiledObject(element, snowyTrees);
    }, this);
  }
    
    function createAcorns() {
    //create items
    acorns = game.add.group();
    acorns.enableBody = true;
    var acorn;    
    var result = findObjectsByType('acorn', map, 'Acorn');
    result.forEach(function(element){
      createFromTiledObject(element, acorns);
    }, this);
  }
    
    
    
    
    //From https://gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
    function findObjectsByType(type, map, layer){
        var results = new Array();
        map.objects[layer].forEach(function(element){
            
            
            if(element.properties.type === type){
                
                element.y -= map.tileHeight;
                results.push(element);
            }
        });
        
        return results;
        
        
    }
    
    //create a sprite from an object
  function createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
 
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  }
    
};
