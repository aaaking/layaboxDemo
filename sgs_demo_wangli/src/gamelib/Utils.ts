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

	static removeHeadAndEndSpace(str:string): string {
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
}
