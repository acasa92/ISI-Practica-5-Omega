describe("EnemyMissileSpec", function() {

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
	it("Misilenemigo", function() {
		SpriteSheet.map =  {enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1 }};
		var me = new EnemyMissile(1,2);
		expect(me.w).toBe(SpriteSheet.map['enemy_missile'].w);
		expect(me.h).toBe(SpriteSheet.map['enemy_missile'].h);
		expect(me.x).toBe(1 - SpriteSheet.map['enemy_missile'].w/2);
		expect(me.y).toBe(2);

		//No compruebo el valor exacto de pm.vy suponiendo 
		//que se puede querer modificar la velocidad
		expect(me.vy>0).toBe(true);
	});

	/*it("Misilenemigos.step()", function() {
		SpriteSheet.map =  {enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1 }};
		var me = new EnemyMissile(1,20000);
		var dummyBoard = { remove: function(obj) {} , collide: function(){}};
		me.board = dummyBoard;
		spyOn(dummyBoard, "remove");
	
		//sin salirse de la pantalla
		
		
		me.step(0.01);

		expect(dummyBoard.remove).not.toHaveBeenCalled();

		//saliendose de la pantalla
		me.step(175757554777); 
		expect(dummyBoard.remove).toHaveBeenCalledWith(me);
	});*/
	it("Misil contra nave", function() {

		SpriteSheet = { 
			map : {ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
					 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
					enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1 } }
		};
		
		var gb = new GameBoard();
	
		var missile = new EnemyMissile(100,100);
		missile.x = 100;
		missile.y = 100;
		var ship = new PlayerShip();
		gb.add(missile);
		gb.add(ship);
		expect(gb.objects.length).toBe(2);
		gb.step(0.0000001);
		expect(gb.objects.length).toBe(1);
	});
	it("bola fuego contra misilenemigo", function() {

		SpriteSheet = { 
			map : {fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 },
					 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
					enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1 } }
		};
		
		var gb = new GameBoard();
	
		var missile = new EnemyMissile(100,100);
		missile.x = 100;
		missile.y = 100;
		var fireb = new PlayerFireball(1,2,1);
		fireb.x=100;
		fireb.y=100;
		gb.add(missile);
		gb.add(fireb);
		expect(gb.objects.length).toBe(2);
		gb.step(0.0000001);
		expect(gb.objects.length).toBe(1);
	});
});
