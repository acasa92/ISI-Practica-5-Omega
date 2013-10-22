/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("GameBoard", function() {

	var gb;
	var canvas, ctx;

	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();

		gb = new GameBoard();
	});

	it("Gameboard.add()", function() {
		var obj1 = {};
		var obj2 = gb.add(obj1);
		expect(obj1).toBe(obj2);
		expect(obj2).toBe(gb.objects[0]);
		expect(gb.objects[0].board).toBe(gb);
		expect(gb.objects.length).toBe(1);

		var obj3 = {};
		gb.add(obj3);
		expect(obj3).toBe(gb.objects[1]);
		expect(gb.objects[1].board).toBe(gb);
		expect(gb.objects.length).toBe(2);
	});

	it("Gameboard remove functions", function() {
		//resetRemoved()
		gb.removed = [{}, {}];
		gb.resetRemoved();
		expect(gb.removed.length).toBe(0);

		//remove()
		var objs = [{}, {}, {}, {}];
		for (var i = 0; i<objs.length; i++) {
			gb.remove(objs[i]);
			expect(gb.removed.length).toBe(i+1);
			expect(objs[i]).toBe(gb.removed[i]);
		}

		//finalizeRemoved()
		for (var i = 0; i<objs.length; i++) {
			gb.add(objs[i]);
		}
		gb.resetRemoved();
		gb.remove(objs[0]);
		gb.remove(objs[2]);
		gb.finalizeRemoved();
		expect(gb.objects.length).toBe(objs.length-2);
		expect(gb.objects.indexOf(objs[0])).toBe(-1);
		expect(gb.objects.indexOf(objs[1])).toBe(0);
		expect(gb.objects.indexOf(objs[2])).toBe(-1);
		
		gb.removed = objs;
		gb.finalizeRemoved();
		expect(gb.objects.length).toBe(0);
		
	});

	it("Gameboard.iterate()", function() {
		gb.objects = [{f1: function(){}, f2: function(){}}, 
					{f1:function(){}, f2:function(){}}];
		spyOn(gb.objects[0], "f1");
		spyOn(gb.objects[0], "f2");
		spyOn(gb.objects[1], "f1");
		spyOn(gb.objects[1], "f2");

		gb.iterate("f1", "a", "b");
		expect(gb.objects[0].f1).toHaveBeenCalledWith("a", "b");
		expect(gb.objects[0].f2).not.toHaveBeenCalled();
		expect(gb.objects[1].f1).toHaveBeenCalledWith("a", "b");
		expect(gb.objects[1].f2).not.toHaveBeenCalled();

	});

	it("Gameboard.detect()", function() {
		gb.objects = [{p1: "a"}, {p1: "b"}, {p1: "b"}];
		var f = function() {
			return this.p1 == "b";		
		};

		expect(gb.detect(f)).toBe(gb.objects[1]);
		
	});

	it("Gameboard.step()", function() {
		gb.iterate = function(){};
		spyOn(gb, "iterate");
		spyOn(gb, "resetRemoved");
		spyOn(gb, "finalizeRemoved");
		gb.step(5);
		expect(gb.iterate).toHaveBeenCalledWith("step", 5);
		expect(gb.resetRemoved).toHaveBeenCalledWith();
		expect(gb.finalizeRemoved).toHaveBeenCalledWith();
	});

	it("Gameboard.draw()", function() {
		gb.iterate = function(){};
		spyOn(gb, "iterate");
		gb.draw("ctx");
		expect(gb.iterate).toHaveBeenCalledWith("draw", "ctx");
	});

	it("Gameboard.overlap()", function(){
		var obj1 = {x: 0, y:0, h:3, w:3};
		expect(gb.overlap(obj1, obj1)).toBe(true);
		expect(gb.overlap(obj1, {x:1, y:1, h:3, w:3})).toBe(true);
		expect(gb.overlap(obj1, {x:10, y:20, h:3, w:3})).toBe(false);
		expect(gb.overlap(obj1, {x:-1, y:-1, h:2, w:3})).toBe(true);
		expect(gb.overlap(obj1, {x: 1, y:-2, h:20, w:20})).toBe(true);

	});

	it("Gameboard.collide()", function() {
		gb.objects = [{type: "1", x:20, y:20, h:1, w:1}, 
						{type: "2", x:20, y:20, h:3, w:3},
						{type: "2", x:1, y:1, h:3, w:3},
						{type: "2", x:2, y:2, h:3, w:3}];
		var obj = {x:0, y:0, h:3, w:3};
		expect(gb.collide(obj,"1")).toBe(false);
		expect(gb.collide(obj,"2")).toBe(gb.objects[2]);
	});
});
