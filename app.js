
var data;
var Lotto = Lotto || {};

Lotto = (function () {
	var domEle = {
		placer : '#placer',
		tile : '.tile',
		pad : '.pad',
		wall : '.coverWall',
		startBtn : '#start',
		msg : '#message',
		instant : '#instant'
	},	
	randomArr = [],
	done = false,
	win = undefined,
	n = 0,
	reset = function() {
		$(domEle.placer).children().remove();
		$(domEle.msg).empty();
		randomArr = [],
		done = false,
		win = undefined,
		n = 0;
	},
	message = function(text) {
		return $(domEle.msg).append(text).show();
	},
	clearTiles = function() {
		$(domEle.tile).fadeOut('slow');
		done = true;
		if ( win == undefined ) {
			message('Good luck next time');
		} else {
			selectedTiles(win)
			message('You just won ' + win + '!');
		}
		$(domEle.startBtn).show();
	},
	selectedTiles = function(target) {
		return $('[data-win="'+ target + '"]').addClass('selected');
	},
	startScratch = function() {
		var eventType;

		if ($(window).width() <= 600) {
			eventType = 'vclick'
		} else {
			eventType = 'mouseenter'
		}

		var limited = $(domEle.tile).length * 0.6;
		
		function transition(elem) {
			var opacity = $(elem).css('opacity');
			
			if (n >= limited) {
				if (done == true) {
					return;
				}
				clearTiles();
				return;
			}
			switch (opacity) {
				case  '1':
				opacity  = '0.5';
				break;
				case  '0.5':
				opacity  = '0';
				n++
				break;
				case  '0':
				break;
			}
			return $(elem).css('opacity', opacity);
		}
		
		$(domEle.tile).on("click tap", function(evt) {
			$(domEle.instant).fadeOut('slow');
			evt.preventDefault();
			return;
		}).on('mouseleave',function() {
			transition(this);
		});
		
	};
	displayWalls = function() {
		var elem = $(domEle.placer),
			h = elem.height(),
			w = elem.width(),
			tileNum = (h / 30) * ( w / 30),
			innerHtml = '';
		
		elem.prepend('<div class="coverWall"></div>');
		
		$(domEle.wall).css({
			width : w +'px',
			height : h + 'px'
		});
		
		for (var i = 1; i <= tileNum; i++) {
			innerHtml += '<div class="tile"></div>';
		}
		
		$(domEle.wall).append(innerHtml);
	},
	randomDisplay = function() {
		function countOccurrences(arr,value){
			var occur = 0;	
			for (var prop in arr){
				if (arr.hasOwnProperty(prop)) {
					if (arr[prop].image === value){
						occur++;
					}
				}
			}
			return occur;
		}
		for (var i = 1; i <= 9; i++) {
			var listDiv = $('<div class="pic"></div>'),
				random = Math.floor(Math.random() * data.length),
				randomObj = data[random];
				
				if (countOccurrences(randomArr, randomObj.image) == 2) {
					win = randomObj.attribute;
				}
				if (countOccurrences(randomArr, randomObj.image) == 3) {
					if (random == 0) {
						random = random + 1;
					} else {
						random = random - 1;
					}
					randomObj = data[random];
				} else {
					randomArr.push(randomObj);
				}
				console.log(win);
				listDiv.appendTo(domEle.placer).append('<img src="' + randomObj.image + '">').attr('data-win',randomObj.attribute);
		}
		console.log(randomArr)
	}
	return {
		init: function() {
			randomDisplay();
			displayWalls();
			startScratch();
		},
		restart : function() {
			reset();
			this.init();
		}
	}
})();

$(function() {
	Lotto.init();
	$('#start').on('click', function() {
		Lotto.restart();
	});
});