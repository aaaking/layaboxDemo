/**
 * @author seacole
 * string辅助
 */
class StringUtils {

	static chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	static makeRandomString(len: number): string {
		var s: string = "";
		var cl: number = this.chars.length;
		for (var i: number = 0; i < len; i++) {
			s += this.chars.charAt(MathUtils.makeRandomInt(cl));
		}

		return s;
	}

	static makeRandomIntString(len: number): string {
		var s: string = "";
		for (var i: number = 0; i < len; i++) {
			s += MathUtils.makeRandomInt(10);
		}

		return s;
	}

	static stringCut(str: string, len: number, fill: string = '...'): string {
		var result: string = str;
		if (str.length > len) {
			result = str.substr(0, len) + fill;
		}
		return result;
	}

	static zeros: Array<string> = [
		"0",
		"00",
		"000",
		"0000",
		"00000",
		"000000",
		"0000000",
		"00000000",
		"000000000",
		"0000000000"
	];

	static supplement(value: number, count: number): string {
		var index = count - value.toString().length - 1;
		if (index < 0) {
			return value.toString();
		}
		return this.zeros[index] + value;
	}

	static format(formatStr: string, ...params): string {
		var result: string = formatStr;
		for (var i = 0, len = params.length; i < len; i++) {
			result = result.replace("{" + i + "}", params[i]);
		}

		return result;
	}

	/**
	 * 将下划线变成驼峰
	 */
	static transformStrToHump(str) {
		var re = /_(\w)/g;
		return str.replace(re, function (all, letter) {
			return letter.toUpperCase();
		});
	}


	public static getColor(content: any, color: number): string {
		return "<font color='#" + color.toString(16) + "'>" + content + "</font>";
	}
	public static getIconName(path: string): string {
		if (!path) {
			return "";
		}
		var pos = path.lastIndexOf('/');
		var name = path.substring(pos + 1, path.length);
		name = "props/Mobile_" + name + ".png";
		return name
	}
	public static getShopPicName(path: string): string {
		var pos = path.lastIndexOf('/');
		var name = path.substring(pos + 1, path.length);
		name = "props/" + name + ".png";
		return name
	}
}
