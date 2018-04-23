/**
* @author seacole
* 错误报告
*/
class Reportor {
	private static _instance: Reportor;
	public static get instance(): Reportor {
		if (this._instance == undefined) {
			this._instance = new Reportor();
		}
		return this._instance;
	}

	start(): void {
		window.onerror = this.onWindowError;
	}

	stop(): void {
		window.onerror = null;
	}

	private _lastError: any;
	onWindowError(error, url, row, col) {
		if (Reportor.instance._lastError && Reportor.instance._lastError == error)
			return;
		Reportor.instance._lastError = error;
		var PF: number = Reportor.instance.getPf();
		var OS: number = Native.instance.OS;
		var MSG: string = url + '[' + row + ',' + col + ']\n' + error;
		var UID: number = server.uid;
		var GID: string = BaseGameData.gameType;
		var params: any = { PF, OS, MSG };
		if (UID)
			params.UID = UID;
		if (GID)
			params.GID = GID;

		webService.reportor(params);
	}

	/**
	 * return 微信WEB1 WEB2 APP3 
	 */
	private getPf(): number {
		if (Native.instance.isWeiXin)
			return 1;
		else if (!Native.instance.isNative)
			return 2;
		else
			return 3;
	}
}