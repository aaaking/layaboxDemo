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

	static checkSeatid(seatid) {
		return seatid && seatid > 0 && seatid <= BaseGameData.maxPlayer
	}



	static getDir(seatid) {
		let dirList = [
			[[1]],
			[[1, 3, 2, 4], [3, 1, 2, 4]],
			[[1, 2, 4, 3], [4, 1, 2, 3], [2, 4, 1, 3]],
			[[1, 2, 3, 4], [4, 1, 2, 3], [3, 4, 1, 2], [2, 3, 4, 1]]
		]
		let dir = seatid


		if (BaseGameData.selfSeatid == 0) {

			let base_seat = 1
			// if (BaseGameData.lastSeatid > 0){
			// 	base_seat = BaseGameData.lastSeatid
			// }
			return dirList[BaseGameData.maxPlayer - 1][base_seat - 1][seatid - 1]
		}
		return dirList[BaseGameData.maxPlayer - 1][BaseGameData.selfSeatid - 1][seatid - 1]
	}

	static getRealDuration(timeout: number) {
		return timeout - server.serverTime
	}

	static currentPos(seatid) {
		if (!Utils.checkSeatid(seatid)) {
			return 0
		}
		let num = (seatid - BaseGameData.offset - 1) % BaseGameData.maxPlayer + 1
		return num <= 0 ? num + BaseGameData.maxPlayer : num
	}

	static getFitNickName(nickname: string, num) {
		let length = nickname.length
		let arr = []
		let charCode
		let realLength = 0
		let charCodelength
		let newstr = []
		for (var i = 0; i < length; i++) {
			charCode = nickname.charCodeAt(i);

			if (charCode >= 0 && charCode <= 128) charCodelength = 1;
			else charCodelength = 2;

			if (realLength + charCodelength > num) {
				for (var j = arr.length - 1; j >= 0; j--) {
					if (realLength - arr[j] > num) {
						realLength = realLength - arr[j]
						newstr.pop()
					} else {
						// newstr.pop()
						let str = ""
						for (var m = 0; m < newstr.length; m++) {
							str = str + newstr[m]
						}
						return str
					}
				}
			}
			newstr[i] = nickname[i]
			arr[i] = charCodelength
			realLength = realLength + charCodelength
		}

		return nickname
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

	static backToMenu() {
		// if(GameConfig.IS_MATCH)
		// 	matchSign.MatchSignData.backCode = parseInt(server.code)
		server.code = "";
		AppControl.getInstance().showPage(MenuPage);
		server.close();
	}
}
