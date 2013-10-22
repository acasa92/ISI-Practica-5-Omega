/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo

*/

describe("PlayerMissile", function() {

	var canvas, ctx;

	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
	});

	it("PlayerMissile", function() {
		SpriteSheet.map = {missile: {h:10, w:2} };
		var pm = new PlayerMissile(1,2);
		expect(pm.w).toBe(SpriteSheet.map['missile'].w);
		expect(pm.h).toBe(SpriteSheet.map['missile'].h);
		expect(pm.x).toBe(1 - SpriteSheet.map['missile'].w/2);
		expect(pm.y).toBe(2 - SpriteSheet.map['missile'].h);
		//No compruebo el valor exacto de pm.vy suponiendo 
		//que se puede querer modificar la velocidad
		expect(pm.vy<0).toBe(true);
	});

	it("PlayerMissile.step()", function() {
		var pm = new PlayerMissile(1,1000);
		var dummyBoard = { remove: function(obj) {} , collide: function(){}};
		pm.board = dummyBoard;
		spyOn(dummyBoard, "remove");
	
		//sin salirse de la pantalla
		var ytemp = pm.y;
		var dt = 1;
		while( dt > (-pm.h-pm.y)/pm.vy ) { dt /= 10; }; //independiente de pm.vy
		pm.step(dt);
		expect(pm.y).toBe(ytemp + pm.vy*dt);
		expect(dummyBoard.remove).not.toHaveBeenCalled();

		//saliendose de la pantalla
		pm.step(1+(-pm.h-pm.y)/pm.vy); //independiente de pm.vy
		expect(dummyBoard.remove).toHaveBeenCalledWith(pm);
	});
	
	it("PlayerMissile.draw()", function() {
		var pm = new PlayerMissile(1,2);
		SpriteSheet = { draw: function(ctx, name, x, y) {} };
		octx = {};
		spyOn(SpriteSheet, "draw");
		pm.draw(octx);
		expect(SpriteSheet.draw).toHaveBeenCalledWith(octx,'missile', pm.x, pm.y, 0);
	});

});
