describe("Enemyes", function() {

	var canvas, ctx;
	var SpriteSheetOrig, GameOrig;

	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
		SpriteSheetOrig = SpriteSheet;
		GameOrig = Game;

	});

	afterEach(function() {
		SpriteSheet = SpriteSheetOrig;
		Game = GameOrig;
	});

	it("Suma al matar enemigo", function() {
		Game = {width: 320, height: 480};
		SpriteSheet = { 
			map : {enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
					 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }}
		};
		var enemies = {
  		  basic: { x: 100, y: 101, sprite: 'enemy_purple', A: 0, F: 0  , E: 100 , health: 10}
		};
		var gp = new GamePoints();
		var enemy = new Enemy(enemies.basic);
		enemy.board = {add: function(){}, remove: function(){ return true;}, };
		expect(Game.points).toBe(0);
		enemy.hit(10);
		expect(Game.points).toBe(100);
	});

	it("Se reinicia el contador al perder", function() {
		Game = {setBoard: function(){}};
		var gp = new GamePoints();
		Game.points = 1000;
		loseGame();
		expect(Game.points).toBe(0);
	});

	it("Misil contra enemigo", function() {
		Game = {width: 320, height: 480};
		SpriteSheet = { 
			map : {enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
					 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
					missile: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 } }
		};
		var enemies = {
  		  basic: { x: 100, y: 99, sprite: 'enemy_purple', A: 0, F: 0  , E: 100 , health: 10}
		};
		var gb = new GameBoard();
		var gp = new GamePoints();
		var missile = new PlayerMissile(100,100);
		missile.x = 100;
		missile.y = 100;
		var enemy = new Enemy(enemies.basic);
		gb.add(missile);
		gb.add(enemy);
		expect(Game.points).toBe(0);
		gb.step(0.0000001);
		expect(Game.points).toBe(100);
	});

	it("Fireball contra enemigo", function() {
		Game = {width: 320, height: 480};
		SpriteSheet = { 
			map : {enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
					 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
					fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 } }
		};
		var enemies = {
  		  basic: { x: 100, y: 99, sprite: 'enemy_purple', A: 0, F: 0  , E: 100 , health: 10}
		};
		var gb = new GameBoard();
		var gp = new GamePoints();
		var fireball = new PlayerFireball(100,100);
		fireball.x = 100;
		fireball.y = 100;
		var enemy = new Enemy(enemies.basic);
		gb.add(fireball);
		gb.add(enemy);
		expect(Game.points).toBe(0);
		gb.step(0.000001);
		expect(Game.points).toBe(100);
	});
});
