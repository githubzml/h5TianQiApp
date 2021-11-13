var id = 'zxw';

function setRem() {
	//以iphone6为标准屏设置html元素的字体大小
	var iphone6Width = 375;

	//获取页面宽度
	var inW = innerWidth;

	var fz = inW / iphone6Width * 100 + 'px';


	//创建style
	var style = document.createElement('style');

	style.setAttribute('id', id);

	style.innerHTML = 'html{font-size: ' + fz + ' ;}';

	document.getElementsByTagName('head')[0].appendChild(style);
}

setRem();

//保存所有定时器序号
var timers = [];

window.onresize = function() {

	var timer = setTimeout(function() {

		for (var i = 1; i < timers.length; i++) {

			clearTimeout(timers[i]);

		}

		var s = document.getElementById('zxw');
		if (s) {
			s.remove();
		}

		setRem();


		timers = [];

	}, 500)

	timers.push(timer);


}