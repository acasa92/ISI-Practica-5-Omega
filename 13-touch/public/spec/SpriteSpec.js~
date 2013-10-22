describe("SpriteSpec", function() {

	var canvas, ctx;

	beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();
	});

	it("Sprite.setup()", function() {
		var sp = new Sprite();
		sp.merge = function(props){};
		SpriteSheet = {map: {'dummySprite': {w:1, h:2} } };
		spyOn(sp, "merge");
		sp.setup('dummySprite', 'props');
		expect(sp.sprite).toBe("dummySprite");
		expect(sp.merge).toHaveBeenCalledWith("props");
		expect(sp.frame).toBe(0);
		expect(sp.w).toBe(SpriteSheet.map['dummySprite'].w);
		expect(sp.h).toBe(SpriteSheet.map['dummySprite'].h);
	});

	it("Sprite.merge()", function() {
		var sp = new Sprite();
		sp.merge({a: '1', b: '2', c: '3'});
		expect(sp['a']).toBe('1');
		expect(sp['b']).toBe('2');
		expect(sp['c']).toBe('3');
	});

	it("Sprite.draw()", function() {
		var sp = new Sprite();
		SpriteSheet.draw = function() {};
		spyOn(SpriteSheet, "draw");
		ctx1 = "ctx";
		sp.sprite = "tipo";
		sp.x = 1;
		sp.y = 5;
		sp.frame = 3;
		sp.draw(ctx1);
		expect(SpriteSheet.draw).toHaveBeenCalledWith(ctx1, 
						sp.sprite, sp.x, sp.y, sp.frame);
		
	});
});
