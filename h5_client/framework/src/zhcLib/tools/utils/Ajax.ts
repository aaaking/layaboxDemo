/**
 * @author seacole *
 * Ajax异步请求
 */
class Ajax {
	static callNet(url: string, params: any = null, method: string = "get", header: any[] = null, onSuccess: Function = null, onError: Function = null, responseType: string = "text"): void {
		var request: Laya.HttpRequest = new Laya.HttpRequest();
		request.on(Laya.Event.COMPLETE, this, function (event: Laya.Event): void {
			if (onSuccess) {
				onSuccess(request.data);
			}
		});
		request.on(Laya.Event.ERROR, this, function (event: Laya.Event): void {
			if (onError) {
				onError(request.data);
			}
		});
		request.on(Laya.Event.PROGRESS, this, function (event: Laya.Event): void {
		});

		if (!header)
			header = [];
		var data: any;
		if (method == "get") {
			header.push("Content-Type", "application/x-www-form-urlencoded");
			data = Utils.obj2query(params);
			if (data)
				url += "?" + data;
			request.send(url, null, method, responseType, header);
			log(method + " " + url);
		}
		else {
			if (params)
				data=JSON.stringify(params);
			header.push("Content-Type", "application/json");
			request.send(url, data, method, responseType, header);
			log(method + " " + url + "?" + data);
		}
	}

	static GET(url: string, params: any = null, onSuccess: Function = null, onError: Function = null, header: any = null): void {
		this.callNet(url, params, 'get', header, onSuccess, onError);
	}

	static POST(url: string, params: any = null, onSuccess: Function = null, onError: Function = null, header: any = null): void {
		this.callNet(url, params, 'post', header, onSuccess, onError);
	}
}