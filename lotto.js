var Lotto = Lotto || {};
var data;

Lotto = (function () {
	var domEle = {
		placer : '#placer',
		tile : '.tile',
		pad : '.pad',
		startBtn : '#start'
	};
	
	var randomArr = [],
		done = false,
		win = undefined;
	
	var coverWall = function() {
		var elem = $(domEle.placer);
		var h = elem.height(),
			w = elem.width();
			
		var tileNum = (h / 30) * ( w / 30);
		
		elem.prepend('<div class="coverWall"></div>');
		
		$('.coverWall').css({
			width : w +'px',
			height : h + 'px'
		});
		for (var i = 1; i <= tileNum; i++) {
			$('.coverWall').append('<div class="tile"><div>');
		}
	
		
	}

	var randomDisplay = function() {
	
		function countOccurrences(arr,value){
			var len = arr.length;
			var occur = 0;
			
			for (var prop in arr){
				if(arr[prop].image === value){
					occur++;
				}
			}
			
			return occur;
		}
		
		for (var i = 1; i <= 9; i++) {
			var listDiv = $('<div class="pic"></div>');
			var random = Math.floor(Math.random() * data.length),
				randomObj = data[random];
				
				if (countOccurrences(randomArr, randomObj.image) == 3) {
					win = randomObj.attribute;
					
					if (random == 0) {
						random = random + 1;
					} else {
						random = random - 1;
					}
					randomObj = data[random];
				} else {
					randomArr.push(randomObj);
				}
				listDiv.appendTo(domEle.placer).append(randomObj.image);
		}
		
	}
	var done = function() {
		$('.tile').fadeOut();
		done = true;
		if ( win == undefined ) {
			alert('Good luck next time');
		} else {
			alert('you won ' + win);
		}
		startAgain();
	};
	var reset = function() {
		$('#placer').children().remove();
		randomArr = [],
		done = false,
		win = undefined;
		console.log(randomArr);
		console.log(done);
		console.log(win);
	};
	var startAgain = function() {
		$('#start').on('click',function() {
			reset();
			coverWall();
			randomDisplay();
			startScratch();
		});
	};
	var startScratch = function() {
		var n = 0;
		var dd = $('.tile').length * 0.1;
		$('.tile').on('mouseenter', function() {
			return;
		}).on('mouseleave',function(evt) {
			var opacity = $(this).css('opacity');
			if (n >= dd) {
				if (done == true) {
					return;
				}
				done();
				evt.preventDefault();
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
			$(this).css('opacity', opacity);			
			
		});
		
	};
	return {
        init: function () {
           randomDisplay();
		   coverWall();
		   startScratch();
        }
    };

})();

$(function() {
	Lotto.init();
});