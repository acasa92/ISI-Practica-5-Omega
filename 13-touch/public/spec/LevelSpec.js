/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
             Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
   Ejemplo:
           [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/

describe("LevelSpec", function() {
	var canvas, ctx;

	var dummyLevel = [
	  //  Comienzo, Fin,   Frecuencia,  Tipo,       Override
		[ 0,        4000,  500,         'step'                 ],
		[ 6000,     13000, 800,         'ltr'                  ],
		[ 10000,    16000, 400,         'circle'               ],
		[ 17800,    20000, 500,         'straight', { x: 50  } ],
		[ 18200,    20000, 500,         'straight', { x: 90  } ],
		[ 18200,    20000, 500,         'straight', { x: 10  } ],
		[ 22000,    25000, 400,         'wiggle',   { x: 150 } ],
		[ 22000,    25000, 400,         'wiggle',   { x: 100 } ]
	];

	var callback = function() {};
	var SpriteSheetOrig, GameOrig, level1Orig, level2Orig;

	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
		SpriteSheetOrig = SpriteSheet;
		GameOrig = Game;
		level1Orig = level1;
		level2Orig = level2;
	});

	afterEach(function() {
		SpriteSheet = SpriteSheetOrig;
		Game = GameOrig;
		level1 = level1Orig;
		level2 = level2Orig;
	});


	it("level constructor", function() {
		var lv = new Level(dummyLevel, callback);
		expect(lv.t).toBe(0);
		expect(lv.callback).toBe(callback);
		expect(lv.levelData.length).toBe(dummyLevel.length);
	});

	it("level.step()", function() {

		SpriteSheet.map = {
				ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
				missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
				enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
				enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
				enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
				enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
				explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
				fireball: { sx: 0, sy: 64, w: 64, h: 64, frames: 1 }
		};

		var lv = new Level(dummyLevel, callback);
		var gb = new GameBoard();
		gb.add(lv);
		var dt = 1;
		spyOn(lv.board, "add");
		spyOn(lv, "callback");

		//t = 0, solo un enemigo (ver dummyLevel)
		lv.step(dt);
		expect(lv.board.add.callCount).toBe(1);
		expect(lv.t).toBe(dt*1000);
		expect(lv.levelData.length).toBe(dummyLevel.length);
		expect(lv.callback).not.toHaveBeenCalled();

		//t = 3500, 0 enemigos, desaparece uno
		lv.board.add.reset();
		lv.t = 3500;
		lv.step(dt);
		expect(lv.board.add.callCount).toBe(0);
		expect(lv.t).toBe(3500 + dt*1000);
		expect(lv.levelData.length).toBe(dummyLevel.length-1);
		expect(lv.callback).not.toHaveBeenCalled();

		//t = 11000, 2 enemigos
		lv.board.add.reset();
		lv.t = 11000;
		lv.step(dt);
		expect(lv.board.add.callCount).toBe(2);
		expect(lv.t).toBe(11000 + dt*1000);
		expect(lv.levelData.length).toBe(dummyLevel.length-1);
		expect(lv.callback).not.toHaveBeenCalled();
		
		//fin del nivel, pasado el tiempo del ultimo y con 0 en cnt
		lv.t = 26000;
		lv.board.cnt[OBJECT_ENEMY] = 0;
		lv.step(dt);
		expect(lv.callback).toHaveBeenCalled();

	});

	it("tras morir informa de que hemos perdido", function() {

		Game.canvas = document.getElementById("game");
		Game.width = Game.canvas.width;
		Game.height= Game.canvas.height;
		SpriteSheet.load(sprites,startGame);
		spyOn(window, "playGame").andCallThrough();
		spyOn(window, "loseGame");
		Game.loop(); //Empieza el bucle
		expect(window.playGame).not.toHaveBeenCalled(); //todavia no empieza a jugar
		Game.keys['fire'] = false;
		waits(100);

		runs(function(){
			Game.keys['fire'] = true;//pulsamos tecla para empezar
			waits(100);
		});

		runs(function(){
			expect(window.playGame).toHaveBeenCalled();//empieza el nivel 1
			Game.keys['fire'] = false;//se suelta la tecla fire para solo
									//tener que pulsarla en el siguiente nivel
			waits(13000);
		});

		
		
		runs(function() {
			expect(window.loseGame).toHaveBeenCalled();//la nave ha colisionado
		});
		
		
	});

	it("tras el nivel 1 aparece el 2", function() {
		level1 = [[ 0,        1000,  500,         'step'],];
		level2 = [[ 0,        500,  500,         'step'],];

		Game.keys['right'] = true;
		Game.canvas = document.getElementById("game");
		Game.width = Game.canvas.width;
		Game.height= Game.canvas.height;
		SpriteSheet.load(sprites,startGame);
		spyOn(window, "playGame").andCallThrough();
		spyOn(window, "winGame").andCallThrough();
		spyOn(window, "nextGame").andCallThrough();
		spyOn(window, "playNextGame").andCallThrough();
		Game.loop(); //Empieza el bucle
		expect(window.playGame).not.toHaveBeenCalled(); //todavia no empieza a jugar
		Game.keys['fire'] = false;
		waits(100);

		runs(function(){
			expect(window.nextGame).not.toHaveBeenCalled();
			Game.keys['fire'] = true;//pulsamos tecla para empezar
			waits(100);
		});
		

		runs(function(){
			expect(window.playGame).toHaveBeenCalled();//empieza el nivel 1
			Game.keys['fire'] = false;//se suelta la tecla fire para solo
									//tener que pulsarla en el siguiente nivel
			waits(level1[level1.length-1][1]+13000);
		});
		
		
		runs(function() {
			expect(window.nextGame).toHaveBeenCalled();//se acaba el primer nivel
			waits(100);
		});
		

		runs(function(){
			expect(window.winGame).not.toHaveBeenCalled();
			expect(window.playNextGame).not.toHaveBeenCalled(); //todavia no empieza a jugar
			Game.keys['fire'] = true;//pulsamos para empezar el segundo nivel
			waits(100);
		});

		runs(function(){
			expect(window.playNextGame).toHaveBeenCalled();//empieza el siguiente nivel
			Game.keys['fire'] = false;
			waits(level2[level2.length-1][1]+13000);
		});

		
		runs(function() {
			expect(window.winGame).toHaveBeenCalled();//se acaba el juego/ganamos
		});
	});
	
});
