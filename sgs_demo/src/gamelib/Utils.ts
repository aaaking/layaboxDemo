/**
 * @author seacole
 * 工具类
 */

class Utils {
	/**
	 * object转成查询字符串
	 * @param obj
	 * @returns {string}
	 */
	static obj2query(obj: any): string {
		if (!obj) {
			return '';
		}
		var arr: string[] = [];
		for (var key in obj) {
			arr.push(key + '=' + obj[key]);
		}
		return arr.join('&');
	}

	static injectProp(target: Object, data: Object = null, callback: Function = null, ignoreMethod: boolean = true, ignoreNull: boolean = true, keyBefore: string = ""): boolean {
		if (!data) {
			return false;
		}
		let result = true;
		for (let key in data) {
			let value: any = data[key];
			if ((!ignoreMethod || typeof value != 'function') && (!ignoreNull || value != null)) {
				if (callback) {
					callback(target, key, value);
				} else {
					target[key] = value;
				}
			}
		}
		return result;
	}

	static getCharCodeLength(str: string): number {
		let length = str.length
		let arr = []
		let charCode
		let realLength = 0
		let charCodelength
		let newstr = []
		for (var i = 0; i < length; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) charCodelength = 1;
			else charCodelength = 2;
			realLength = realLength + charCodelength;
		}
		return realLength;
	}

	static deepCopy(p, c) {
		var c = c || {};
		for (var i in p) {
			if (!p.hasOwnProperty(i)) {
				continue;
			}
			if (typeof p[i] === 'object') {
				c[i] = (p[i].constructor === Array) ? [] : {};
				this.deepCopy(p[i], c[i]);
			} else {
				c[i] = p[i];
			}
		}
		return c;
	}

	static removeHeadAndEndSpace(str: string): string {
		while (str.length) {
			if (str.substr(0, 1) == " ")
				str = str.substring(1, str.length);
			else
				break;
		}
		while (str.length) {
			if (str.substr(str.length - 1, 1) == " ")
				str = str.substring(0, str.length - 1);
			else
				break;
		}
		return str;
	}

	static getParam(name: string): string {
		var url = window.location.search
		if (url.indexOf("?") != -1) {
			var str = url.substr(1);
			var strs = str.split("&");
			for (var i = 0; i < strs.length; i++) {
				var items = strs[i].split("=")
				if (items.length > 1) {
					var key = strs[i].split("=")[0]
					var value = decodeURI(strs[i].split("=")[1])
					if (key.toLowerCase() == name.toLowerCase()) {
						return value
					}
				}
			}
		}
		return ""
	}

	static isMobileDevice(): boolean {
		if (navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
		) {
			return true;
		}
		else {
			return false;
		}
	}

	static toAscii(hex): string {
		// Find termination
		var str = "";
		var i = 0, l = hex.length;
		if (hex.substring(0, 2) === '0x') {
			i = 2;
		}
		for (; i < l; i += 2) {
			var code = parseInt(hex.substr(i, 2), 16);
			str += String.fromCharCode(code);
		}
		return str;
	};

	static toNumberUnit(size: number): string {
		var i = Math.floor(Math.log(size) / Math.log(1000));
		return (size / Math.pow(1000, i)).toFixed(2) + ' ' + ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'][i];
	}
}
