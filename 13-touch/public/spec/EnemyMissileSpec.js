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

	it("Misilenemigos.step()", function() {
		SpriteSheet.map =  {enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1 }};
		var me = new EnemyMissile(1,100);
		me.y = 100;
		var dummyBoard = { 
							remove: function(obj) {} , 
							collide: function(){return false;}
						};
		Game.height = 120;
		me.board = dummyBoard;
		spyOn(dummyBoard, "remove");
		prevX = me.x;
		prevY = me.y;
	
		//sin salirse de la pantalla
		dt = 0.00001;
		me.step(dt);
		expect(dummyBoard.remove).not.toHaveBeenCalled();
		expect(me.x).toBe(prevX);
		expect(me.y).toBe(prevY+me.vy*dt);

		//saliendose de la pantalla
		me.step(10000); 
		expect(dummyBoard.remove).toHaveBeenCalledWith(me);

		//con colision
		var dummyObj = { hit: function(){} };
		var dummyBoard2 = { 
							remove: function(obj) {} , 
							collide: function() { return dummyObj; }
						};
		spyOn(dummyObj, "hit");
		spyOn(dummyBoard2, "remove");
		var me2 = new EnemyMissile(1,100);
		me2.board = dummyBoard2;
		me2.y = 100;
		me2.step(0.00001);
		expect(dummyBoard2.remove).toHaveBeenCalledWith(me2);
		expect(dummyObj.hit).toHaveBeenCalledWith(me2.damage);
	});


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
		expect(gb.objects[0].sprite).toBe('explosion');
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
		expect(gb.objects[0]).toBe(missile);
	});
});
