$(function () {

	//获取本地存储缓存的城市历史记录
	var cities = localStorage.getItem('cities');
	
	cities = cities ? JSON.parse(cities) : [];

	console.log('cities ==> ', cities);



	//显示加载提示
	$('#tip').show();


	//对象收编变量
	var weather = {

		//星期几
		dayArray: ['日', '一', '二', '三', '四', '五', '六'],

		//是否已经获取空气质量与生活指数数据
		isGet: false,

		//标记是否由删除城市或者新增城市
		isYes: false,

		//配置天气图标
		iconConfig: {

			'100': {
				title: '晴',
				icon: './images/100.png'
			},

			'101': {
				title: '多云',
				icon: './images/101.png'
			},

			'104': {
				title: '阴',
				icon: './images/104.png'
			},

			'300': {
				title: '阵雨',
				icon: './images/300.png'
			},

			'302': {
				title: '雷阵雨',
				icon: './images/302.png'
			},

			'305': {
				title: '小雨',
				icon: './images/305.png'
			},

			'306': {
				title: '中雨',
				icon: './images/306.png'
			},

			'307': {
				title: '大雨',
				icon: './images/307.png'
			},

			'509': {
				title: '浓雾',
				icon: './images/509.png'
			},

			'999': {
				title: '未知',
				icon: './images/999.png'
			}

		},

		//配置空气质量数据与生活指数数据
		air_life_data: {

			//空气质量数据
			air_now_city: [
				{
					title: '空气质量指数',
					key: 'aqi'
				},
				{
					title: '主要污染物',
					key: 'main'
				},
				{
					title: '空气质量',
					key: 'qlty'
				},
				{
					title: '可吸入颗粒物',
					key: 'pm10'
				},
				{
					title: '可吸入颗粒物',
					key: 'pm25'
				},
				{
					title: '二氧化氮',
					key: 'no2'
				},
				{
					title: '二氧化硫',
					key: 'so2'
				},
				{
					title: '一氧化碳',
					key: 'co'
				},
				{
					title: '臭氧',
					key: 'o3'
				}
			],

			//生活指数数据
			lifestyle: [
				{
					title: '舒适度指数',
					key: 'comf'
				},
				{
					title: '洗车指数',
					key: 'cw'
				},
				{
					title: '穿衣指数',
					key: 'drsg'
				},
				{
					title: '感冒指数',
					key: 'flu'
				},
				{
					title: '运动指数',
					key: 'sport'
				},
				{
					title: '旅游指数',
					key: 'trav'
				},
				{
					title: '紫外线指数',
					key: 'uv'
				},
				{
					title: '空气污染扩散条件指数',
					key: 'air'
				},
				{
					title: '空调开启指数',
					key: 'ac'
				},
				{
					title: '过敏指数',
					key: 'ag'
				},
				{
					title: '太阳镜指数',
					key: 'gl'
				},
				{
					title: '化妆指数',
					key: 'mu'
				},
				{
					title: '晾晒指数',
					key: 'airc'
				},
				{
					title: '交通指数',
					key: 'ptfc'
				},
				{
					title: '钓鱼指数',
					key: 'fsh'
				},
				{
					title: '防晒指数',
					key: 'spi'
				}
			]

		},

		//请求参数
		params: {
			baseUrl: 'https://api.heweather.net/s6/weather',
			key: '868d91d4c8d544f8ac827d218113369e'
		},

		//获取定位城市实况天气数据
		getCurrentWeather: function (city) {

			var self = this;

			//city: 城市名称
			//发起ajax请求
			$.ajax({
				//请求类型
				type: 'GET',

				//请求地址
				url: self.params.baseUrl + '/now',

				//请求参数
				data: {
					//位置
					location: city,

					//开发者密钥
					key: self.params.key
				},

				success: function (result) {

					// console.log('status result ==> ', result);

					//获取日期
					var date = result.HeWeather6[0].update.loc;

					//日期
					var d = date.split(' ')[0];

					// console.log('d ==> ', d);

					$('#date').text(d);

					//星期几
					var day = new Date(date).getDay();
					// console.log('day ==> ', day);

					$('#day').text('星期' + weather.dayArray[day]);

					//温度
					var tmp = result.HeWeather6[0].now.tmp;
					// console.log('tmp ==> ', tmp);

					$('#tmp').text(tmp + '℃');

					//天气情况
					var cond_txt = result.HeWeather6[0].now.cond_txt;

					$('#box-text').text(cond_txt);

					//风向
					var wind_dir = result.HeWeather6[0].now.wind_dir;
					$('#wind-dir').text(wind_dir);

					//风速
					var wind_spd = result.HeWeather6[0].now.wind_spd;
					$('#wind-speed').text('风速：' + wind_spd + 'km / h');

					//风力
					var wind_sc = result.HeWeather6[0].now.wind_sc;
					$('#wind-level').text('风力：' + wind_sc + '级');

					//配置图标
					$('#box-icon').css({
						'background-image': 'url("' + self.iconConfig[result.HeWeather6[0].now.cond_code].icon + '")'
					})

					//获取24小时天气数据
					self.getHoursWeather(city);


				}
			})

		},

		//获取24小时天气数据
		getHoursWeather: function (city) {

			var self = this;

			//city: 城市

			//发起ajax请求
			$.ajax({

				type: 'GET',

				url: self.params.baseUrl + '/hourly',

				data: {
					location: city,
					key: self.params.key
				},

				success: function (result) {

					//获取24小时天气
					var hourlyData = result.HeWeather6[0].hourly;

					for (var i = 0; i < hourlyData.length; i++) {

						//获取时间
						var time = hourlyData[i].time.split(' ')[1];

						//创建一个li
						var $li = $(`<li>
									<div>${time}</div>
									<div class="hours-icon" style="background-image: url('${self.iconConfig[hourlyData[i].cond_code].icon}');"></div>
									<div>${hourlyData[i].tmp}℃</div>
									<div>${hourlyData[i].wind_dir}</div>
								</li>`);

						//将创建的li添加到ul
						$('#hours').append($li);

					}

					//获取未来9天天气数据
					self.getFutureWeather(city);

				}

			})
		},


		//获取未来9天天气数据
		getFutureWeather: function (city) {

			var self = this;

			//发起ajax请求
			$.ajax({
				type: 'GET',
				url: this.params.baseUrl + '/forecast',
				data: {
					location: city,
					key: this.params.key
				},
				success: function (result) {

					//保存未来9天天气数据
					var futureWeather = result.HeWeather6[0].daily_forecast.slice(1);

					// console.log('futureWeather ==> ', futureWeather);

					for (var i = 0; i < futureWeather.length; i++) {

						//获取日期 12/03
						var date = futureWeather[i].date.split('-').slice(1).join(' / ');
						// console.log('date ==> ', date);

						var $div = $(`<div class="future-item">
								<span class="future-date">${date}</span>
								<span class="future-icon">
									<i class="f-icon" style="background-image: url('${self.iconConfig[futureWeather[i].cond_code_d].icon}');"></i>
								</span>
								<span class="future-tem">${futureWeather[i].tmp_min}℃~${futureWeather[i].tmp_max}℃</span>
								<span class="future-wind">${futureWeather[i].wind_dir}</span>
							</div>`);


						//将$div添加到futire-weather元素
						$('#futire-weather').append($div);

					}

					//关闭加载提示
					$('#tip').hide();

				}
			})
		}

	};


	//获取用户位置
	$.ajax({

		//请求类型
		type: 'GET',

		//请求地址
		url: 'https://apis.map.qq.com/ws/location/v1/ip',

		//设置响应数据类型
		dataType: 'jsonp',

		//请求参数
		data: {
			//开发者密钥
			key: 'CE6BZ-KX3CI-UA2GD-5XT77-6LM65-4MB7I',

			//返回格式
			output: 'jsonp'
		},

		//请求成功后执行的回调函数
		success: function (data) {

			console.log('data ==> ', data);

			//获取城市
			var city = data.result.ad_info.city.replace(/市$/, '');
			console.log('city ==> ', city);

			//绑定用户位置数据
			$('#location-city').text(city);


			//获取定位城市实况天气数据
			weather.getCurrentWeather(city);



		}


	})



	//查看实况天气的空气质量与生活指数
	$('#weather-status').on('click', function () {

		console.log('weather.isGet ==> ', weather.isGet);

		if (!weather.isGet) {

			//开启加载提示
			$('#tip').show();

			$('#air-life-list').html('');

			weather.isGet = true;

			//获取当前的城市
			var city = $('#location-city').text();

			//获取空气质量数据
			$.ajax({
				type: 'GET',
				url: 'https://api.heweather.net/s6/air/now',
				data: {
					location: city,
					key: weather.params.key
				},
				success: function (data) {
					// console.log('空气质量数据 data ==> ', data);

					//合并空气质量数据
					for (var i = 0; i < weather.air_life_data.air_now_city.length; i++) {
						var current = weather.air_life_data.air_now_city[i];

						 current.value = data.HeWeather6[0].air_now_city[current.key];

						 var $li = $(`<li>
								<span class="t1">${current.title}</span>
								<span class="t2">${current.value}</span>
							</li>`);

						 $('#air-life-list').append($li);

					}


					//获取生活指数数据
					$.ajax({
						type: 'GET',
						url: weather.params.baseUrl + '/lifestyle',
						data: {
							location: city,
							key: weather.params.key
						},
						success: function (data) {

							for (var i = 0; i < weather.air_life_data.lifestyle.length; i++) {
								var current = weather.air_life_data.lifestyle[i];

								for (var j = 0; j < data.HeWeather6[0].lifestyle.length; j++) {

									var currentData = data.HeWeather6[0].lifestyle[j];

									if (current.key == currentData.type) {
										//添加value属性
										current.value = currentData.brf;
										break;
									}
								}

								//创建li
								var $li = $(`<li>
										<span class="t1">${current.title}</span>
										<span class="t2">${current.value}</span>
									</li>`);

								$('#air-life-list').append($li);

								
							}


							//关闭加载提示
							$('#tip').hide();


						}
					})

				}
			})

			

		}



		$('#air-life-box').show().animate({
			top: 0
		}, 300)

	})

	//点击air-life-box元素关闭空气质量与生活指数页面
	$('#air-life-box').on('click', function (e) {

		// console.log(e.target);
		// console.log('this ==> ', this);


		if (e.target == this) {
			$(this).animate({
				top: '100%'
			}, 300, function () {

				$(this).hide();

			})
		}

		

	})


	//切换城市天气数据
	$('#search-icon').on('click', function () {

		//切换城市
		var city = $('#search-box').val();

		console.log('city ==> ', city);

		//如果当前城市为空
		if (city.trim() == '') {
			console.log('输入城市名称');
			return;
		}

		//获取当前城市
		var currentCity = $('#location-city').text();

		if (city.replace(/市$/, '') == currentCity.replace(/市$/, '')) {
			console.log('相同的城市');
			//拦截
			return;
		}


		weather.isGet = false;

		//清空空气质量与生活指数内容
		$('#air-life-list').html('');

		//显示加载提示
		$('#tip').show();


		//设置城市
		$('#location-city').text(city);

		//清空文本框内容
		$('#search-box').val('');

		//清空24小时天气数据内容
		$('#hours').html('');

		//清空未来9天天气数据内容
		$('#futire-weather').html('');


		var c = city.replace(/市$/, '');

		//如果没有缓存过的城市
		//indexOf(): 如果找到返回元素的下标，如果找不到返回-1
		if (cities.indexOf(c) === -1) {

			//缓存城市历史记录
			cities.unshift(c);
			console.log('cities ==> ', cities);

			//将cities写入本地存储
			var citiesString = JSON.stringify(cities);
			console.log('citiesString ==> ', citiesString);

			localStorage.setItem('cities', citiesString);
		}

		//关闭下拉菜单
		$('#list').hide();

		//获取当前切换城市的天气数据
		weather.getCurrentWeather(city);

		weather.isYes = false;

	})

	

	//绑定搜索框的获取焦点事件
	$('#search-box').on('focus', function () {

		if (weather.isYes) {
			$('#list').show();
			return;
		}

		console.log('执行');

		//绑定缓存城市数据
		var citiesData = localStorage.getItem('cities');

		citiesData = citiesData ? JSON.parse(citiesData) : [];

		console.log('citiesData ==> ', citiesData);

		//如果没有缓存城市数据，不显示下拉菜单
		if (citiesData.length === 0) {
			return;
		}

		weather.isYes = true;

		//清空列表内容
		$('#list-tag').html('');


		//生成下拉菜单标签
		for (var i = 0; i < citiesData.length; i++) {
			var $span = $(`<span>${citiesData[i]}<i class="close-icon"></i></span>`);

			$('#list-tag').append($span);

		}


		$('#list').show();
		
	})

	//关闭下拉菜单
	$('#close').on('click', function () {
		$('#list').hide();
	})


	//为未来生成下拉菜单标签绑定点击事件
	$('#list-tag').on('click', 'span', function () {

		//获取标签的内容
		var text = $(this).text();
		console.log('text ==> ', text);

		//获取当前城市
		var currentCity = $('#location-city').text();

		if (text == currentCity) {
			console.log('目前已经是' + text + '的天气');
			return;
		}

		//显示加载提示
		$('#tip').show();


		$('#location-city').text(text);
		$('#search-box').val('');

		$('#hours').html('');
		$('#futire-weather').html('');


		//获取天气数据
		weather.getCurrentWeather(text);

		$('#list').hide();

		weather.isGet = false;


	})

	//单个删除缓存城市历史记录
	$('#list-tag').on('click', '.close-icon', function (e) {

		//阻止事件冒泡
		e.stopPropagation();

		
		//获取删除的城市
		var city = $(this).parent().text();
		console.log('city ==> ', city);

		//获取本地存储数据
		var citiesData = JSON.parse(localStorage.getItem('cities'));

		//查找数组元素
		var index = citiesData.indexOf(city);
		console.log('index ==> ', index);

		//删除数组元素
		citiesData.splice(index, 1);

		console.log('citiesData ==> ', citiesData);

		//将删除之后的citiesData数据写入本地存储
		localStorage.setItem('cities', JSON.stringify(citiesData));


		//移除页面的下拉菜单标签
		$(this).parent().remove();

		//如果当前数据全部被删除，则需要关闭下拉菜单
		if (citiesData.length == 0) {
			$('#list').hide();
		} 

	})

	//全部删除
	$('#all-delete').on('click', function () {
		localStorage.setItem('cities', JSON.stringify([]));
		$('#list-tag').html('');
		$('#list').hide();
		weather.isYes = false;
	})

})