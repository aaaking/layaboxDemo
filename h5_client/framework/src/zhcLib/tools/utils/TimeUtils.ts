class TimeUtils {
	/**
	 * 格式化到XX:XX:XX:XX
	 * @param second 单位秒
	 */
	static timeFormat(second: number, format: string = '{1}:{0}', placeZero: boolean = true): string {
		let ss: any = second % 60;
		let mm: any = Math.floor(second / 60) % 60;
		let hh: any = Math.floor(second / 3600) % 24;
		let dd: any = Math.floor(second / 3600 / 24);

		if (placeZero) {
			ss = StringUtils.supplement(ss, 2);
			mm = StringUtils.supplement(mm, 2);
			hh = StringUtils.supplement(hh, 2);
			dd = StringUtils.supplement(dd, 2);
		}
		return StringUtils.format(format, ss, mm, hh, dd);
	}

	static Format(fmt, time?) { //author: meizz 

		var date = new Date()
		if (time) {
			date = new Date(time * 1000)
		}
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	/**
	 * 获取系统时间的xx:xx
	 */
	static getSystemTimeHM(needTimeChange: boolean = false): string {
		var time: number = Laya.Browser.now();
		var d: Date = new Date(time);
		var hour: number = d.getHours();
		var min: number = d.getMinutes();
		var str: string = "";
		if (hour < 10)
			str += "0";
		str += hour + ":";
		if (min < 10)
			str += "0";
		str += min;
		if (needTimeChange) {
			var sec: number = d.getSeconds();
			Laya.timer.clear(this, this.dispath);
			Laya.timer.once(60 * 1000 - sec * 1000, this, this.dispath);
		}
		return str;
	}

	static dispath(): void {
		Dispatcher.dispatch(EventNames.TIME_CHANGE);
	}

	//时间戳转换日期 (yyyy-MM-dd HH:mm:ss)  
	static formatDateTime(timeValue) {
		var date = new Date(timeValue);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var M = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		var D = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		var H = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		var second = date.getSeconds();
		var minut = minute < 10 ? ('0' + minute) : minute;
		var secon = second < 10 ? ('0' + second) : second;
		return y + '-' + M + '-' + D + ' ' + H + ':' + minut + ':' + secon;
	};

	//判断传入日期是否为昨天  
	static isYestday(timeValue) {
		var date = (new Date()); //当前时间  
		var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨  
		var yestday = new Date(today - 24 * 3600 * 1000).getTime();
		return timeValue < today && yestday <= timeValue;
	};

	//判断传入日期是否属于今年  
	static isYear(timeValue) {
		var takeNewYear = this.formatDateTime(new Date()).substr(0, 4); //当前时间的年份  
		var takeTimeValue = this.formatDateTime(timeValue).substr(0, 4); //传入时间的年份  
		return takeTimeValue == takeNewYear;
	}

	//60000 1分钟  
	//3600000 1小时  
	//86400000 24小时  
	//对传入时间进行时间转换   
	static timeChange(timeValue) {
		var timeNew = Date.parse(String(new Date())); //当前时间  
		var timeDiffer = timeNew - timeValue; //与当前时间误差  
		var returnTime = '';

		if (timeDiffer <= 60000) { //一分钟内  

			var returnTime = "刚刚";

		} else if (timeDiffer > 60000 && timeDiffer < 3600000) { //1小时内  

			var returnTime = Math.floor(timeDiffer / 60000) + '分钟前';

		} else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && this.isYestday(timeValue) === false) { //今日  

			var returnTime = '今天 ' + this.formatDateTime(timeValue).substr(11, 5);

		} else if (timeDiffer > 3600000 && this.isYestday(timeValue) === true) { //昨天  

			var returnTime = '昨天 ' + this.formatDateTime(timeValue).substr(11, 5);

		} else if (timeDiffer > 86400000 && this.isYestday(timeValue) === false && this.isYear(timeValue) === true) {  //今年  

			var returnTime = this.formatDateTime(timeValue).substr(5, 11);

		} else if (timeDiffer > 86400000 && this.isYestday(timeValue) === false && this.isYear(timeValue) === false) { //不属于今年  

			var returnTime = this.formatDateTime(timeValue).substr(0, 10);

		}
		return returnTime;
	}

	static isToday(time: number, now: number = 0): boolean {
		if (!now)
			now = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
		var t: Date = new Date(time);
		var n: Date = new Date(now);
		if (t.getFullYear()==n.getFullYear() && t.getMonth()==n.getMonth() && t.getDate()==n.getDate())
			return true;
		else
			return false;
	}

	static isTomorrow(time: number, now: number = 0): boolean {
		if (!now)
			now = server.serverTime ? server.serverTime * 1000 : new Date().getTime();
		now+=24*60*60*1000;
		var t: Date = new Date(time);
		var n: Date = new Date(now);
		if (t.getFullYear()==n.getFullYear() && t.getMonth()==n.getMonth() && t.getDate()==n.getDate())
			return true;
		else
			return false;
	}


}