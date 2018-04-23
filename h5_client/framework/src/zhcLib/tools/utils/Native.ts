/**
 * @author seacole
 * 交互类
 */

class Native extends Laya.EventDispatcher {
	private static _instance: Native;
	// private bridge:Bridge;

	public static get instance(): Native {
		if (this._instance == undefined) {
			this._instance = new Native();
		}
		return this._instance;
	}

	private _dicCall: any = {};

	constructor() {
		super();
		// this.bridge = Bridge.getInstance();
		// SystemLog.getInstance().log('Bridge.enabled: ' + this.bridge.enabled);
		// egret.ExternalInterface.addCallback('nativeCall', this.nativeCall.bind(this));
	}

	/**
   * 获取设备唯一ID
   * @param callback
   * @param prefix
   * @param makeNew
   */
	getDeviceUUID(callback: Function, prefix: string, makeNew: boolean = false): void {
		// if (this.isNative) {
		// 	this.call('getDeviceUUID', { makeNew }, callback);
		// } else {
		var uuid: string = localStorage.getItem('uuid');
		if (makeNew || !uuid) {
			uuid = StringUtils.makeRandomString(32);
			localStorage.setItem('uuid', uuid);
		}
		callback({ uuid });
		// }
	}

	get isNative(): boolean {
		return Laya.Browser.window.conchConfig;
	}

	/**
	 * 直接调用native方法
	 * @param method
	 * @param params
	 * @param callback
	 */
	static call(method: string, params: any = null, callback: Function = null): void {
		this.instance.call(method, params, callback);
	}

	/**
	 * 直接调用native方法
	 * @param method
	 * @param args
	 * @param callback
	 */
	call(method: string, args: any = null, callback: Function = null): void {
		args = args || {};
		var params: any = {
			id: StringUtils.makeRandomIntString(10),
			method,
			args
		};

		if (callback) {
			this._dicCall[params.id] = callback;
		}

		// __JS__("alert('aaa')");
		// egret.ExternalInterface.call('egretCall', JSON.stringify(params));
	}

	getUrlParams(): any {
		var params = {};
		var href = Laya.Browser.window.location.href;
		var index = href.indexOf("?");
		if (index < 0) {
			return params;
		}
		var hashes = href.substr(index + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			var arr = hashes[i].split('=');
			params[arr[0]] = arr[1];
		}
		log(params);
		return params;
	}

	get isWeiXin(): boolean {
		var ua: string = window.navigator.userAgent.toLowerCase();
		if (ua.indexOf('micromessenger') != -1) {
			return true;
		}
		else {
			return false;
		}
	}

	private iosBundleID: number;
	getIOSType(callback): void {
		if (Native.instance.isNative) {
			let osname = Laya.Browser.window.conchConfig.getOS();
			if (osname == "Conch-ios") {
				NativeHelper.instance.getBundleID((bundleID: string) => {
					bundleID = bundleID.toLowerCase();
					if (bundleID.indexOf("inhouse") == -1)
						Native.instance.iosBundleID = OSConfig.IOS_NATIVE_STORE;
					else
						Native.instance.iosBundleID = OSConfig.IOS_NATIVE_INHOUSE;
					callback()
				});
			}
			else
				callback();
		}
		else
			callback();
	}

	/**
	 * return iOS1,andorid2,其他3
	 */
	get OS(): number {
		if (Native.instance.isNative) {
			let osname = Laya.Browser.window.conchConfig.getOS();
			if (osname == "Conch-ios")
				return Native.instance.iosBundleID > 0 ? Native.instance.iosBundleID : OSConfig.IOS_NATIVE_STORE;
			else if (osname == "Conch-android")
				return OSConfig.ANDROID_NATIVE;
			else
				return OSConfig.UNKNOWN;
		}
		else {
			var u = Laya.Browser.window.navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if (isiOS)
				return OSConfig.IOS_WEB;
			else if (isAndroid)
				return OSConfig.ANDROID_WEB;
			else
				return OSConfig.OTHERS_WEB;
		}
	}

	get isIOS(): boolean {
		return Laya.Browser.window.conchConfig && Laya.Browser.window.conchConfig.getOS() == "Conch-ios";
	}

	get isAndroid(): boolean {
		return Laya.Browser.window.conchConfig && Laya.Browser.window.conchConfig.getOS() == "Conch-android";
	}


	/**
	 * 设置Android的back键监听
	 */
	private setAndroidBack(): void {
		if (Laya.Render.isConchApp) {
			if (Laya.Browser.window.conch && Laya.Browser.window.conch.setOnBackPressedFunction) {
				Laya.Browser.window.conch.setOnBackPressedFunction(() => {
					// console.log('press back ' + n);
					// if (n-- <= 0) {
					// 	Laya.Browser.window.conch.exit();
					// }
				});
			}
		}

	}

	/**
	 * 获取当前网络状态
	 */
	public getNet(): number {
		if (Native.instance.isNative) {
			var nType = Laya.Browser.window.conch.config.getNetworkType();
			// NET_NO = 0;
			// NET_WIFI = 1;
			// NET_2G = 2;
			// NET_3G = 3;
			// NET_4G = 4;
			// NET_UNKNOWN = 5
			if (nType == 1)
				return 1;
			else
				return 2;
		}
		else {
			if (Laya.Browser.window.navigator && Laya.Browser.window.navigator.connection && Laya.Browser.window.navigator.connection.type) {
				if (Laya.Browser.window.navigator.connection.type == "wifi")
					return 1;
				else
					return 2;
			}
			else
				return 2
		}
	}

	public getMatchRankInfo(info, type, subTitle, des) {
		var link: string = GameConfig.GAME_URL + "share/index.html";
		var desc: string = "";
		var title: string = "";
		var imgUrl: string = GameConfig.WX_URL + "shareIcon/" + GameConfig.APPAREA + ".png";

		link += "?type=" + type + "&cmd=sharegame";
		link += "&pid=" + server.uid;

		// Base64.encode(text)
		if(type == 5){
			link += "&info=" + info
		}else{
			link += "&info=" + Base64.encode(info)
		}
		// link += "&info=" + Base64.encode(info)
		var data = matchSign.MatchSignData.getInfoByCode(matchSign.MatchSignData.currentMatchCode)
		let text = ""
		if(data){
			if(data.gamemode >= 160){
				text = "钻石赛"
			}else if(data.gamemode >= 150){
				text = "官方赛"
			}else if(data.gamemode >= 100){
				text = "比赛"
			}
		}
		title += StringUtils.format(GameConfig.language.share_3, GameConfig.language.share_game_name[BaseGameData.gameType]+text) + subTitle;
		desc += des;


		// alert(desc); 
		return { link, desc, title, imgUrl };
	}

	/**
	 * 分享
	 * @param type 1 房号 2 截屏 3 战绩
	 * @param pos 0 好友 1 朋友圈
	 * @param title 主标题 
	 * @param subTitle 副标题
	 */
	public share(type: number = 1, pos: number = 0, title: string = "", subTitle: string = "", info?): void {
		if (Native.instance.isNative) {
			var imgUrl: string;
			//分享房号
			if (type == 1) {
				var data: any = Native.instance.getShareInfo();//{link,desc,title,imgUrl}
				// alert("result11");
				// Laya.loader.load([{ url: "wx/shareIcon/icon.png", type: Laya.Loader.IMAGE }], Laya.Handler.create(this, (a) => {
				// 	var arrayBuff = Laya.loader.getRes("wx/shareIcon/icon.png");
				// 	Laya.Browser.window.conch.saveAsPng(arrayBuff, 131, 131, "wx/shareIcon/icon.png");
				// 	NativeHelper.instance.wxShareWebPage(pos, data.link, Laya.Browser.window.conch.getCachePath() + "/shareicon.png", data.title, data.desc, function (result) {
				// 		alert("result");
				// 	});
				// }));
				// alert(JSON.stringify(data));
				NativeHelper.instance.wxShareWebPage(pos, data.link, "", data.title, data.desc, function (result) {

				});
			} else if (type == 3 || type == 4) {
				let data = Native.instance.getMatchRankInfo(info, type, title, subTitle)
				NativeHelper.instance.wxShareWebPage(pos, data.link, "", data.title, data.desc, function (result) {

				});
			}
			//分享截屏
			else {
				Laya.Browser.window.conch.captureScreen(function (arrayBuff, width, height) {
					// alert(Laya.Browser.window.conch.getCachePath());
					//存储文件的方式
					Laya.Browser.window.conch.saveAsPng(arrayBuff, width, height, Laya.Browser.window.conch.getCachePath() + "/share.png");
					Laya.Browser.window.globalImage = window.document.createElement("img");
					Laya.Browser.window.globalImage.onload = function () {
						// ...使用image对象

					}
					Laya.Browser.window.globalImage.src = "file:///" + Laya.Browser.window.conch.getCachePath() + "/share.png";
					log("[SHARE] file:" + Laya.Browser.window.conch.getCachePath() + "/share.png");

					NativeHelper.instance.wxShareImg(pos, Laya.Browser.window.conch.getCachePath() + "/share.png", function (result) {

					});

					//
					// Laya.Browser.window.image = window.document.createElement("img");
					// Laya.Browser.window.image.putImageData(arrayBuff, width, height);
					//...使用image对象
					// data/user/0/com.simjoys.h5gameapp//LayaCache//appCache
				});
			}
		}
		else {
			HintCtrl.instance.show(GameConfig.language.wx_share);
		}
	}

	/**
	 * return {link,desc,title,imgUrl}
	 */
	public getShareInfo(): any {
		var link: string = GameConfig.GAME_URL + "share/index.html";
		var desc: string = "";
		var title: string = "";
		var imgUrl: string = GameConfig.WX_URL + "shareIcon/" + GameConfig.APPAREA + ".png";
		if (server.code) {
			link += "?type=1&cmd=sharegame&gamearea="+GameConfig.APPAREA+"&roomcode=" + server.code + "&game_rule=" + GameConfig.DESC[server.code] + "&gametype=" + BaseGameData.gameType;
			var matchRule: string = matchSign.MatchSignData.getMatchShareDesc(Number(server.code));
			var tmp: string = GameConfig.DESC[server.code];
			
			if (matchRule) {
				var data = matchSign.MatchSignData.getInfoByCode(parseInt(server.code))
				let text = "比赛"
				desc = matchRule;
				if(data){
					if(data.gamemode >= 160){
						text = "钻石赛"
						desc = "精彩赛事不间断，可赢得钻石奖励！快来参与吧！";
					}else if(data.gamemode >= 150){
						text = "官方赛"
					}
				}
				title += StringUtils.format(GameConfig.language.share_2, GameConfig.language.share_game_name2[BaseGameData.gameType]+text, server.code);
				link += "&match_rule=" + matchRule;
				
			}
			else {
				title += StringUtils.format(GameConfig.language.share_2, GameConfig.language.share_game_name[BaseGameData.gameType], server.code);
				if (tmp)
					desc += tmp + ",就等你来嗨！";
			}
			link += "&pid=" + server.uid;
			link = encodeURI(link);
		}
		else {
			link += "?type=2&cmd=sharegame&gamearea="+GameConfig.APPAREA;
			link += "&pid=" + server.uid;
			title += StringUtils.format(GameConfig.language.share_1, GameConfig.APPNAME);
			desc += GameConfig.APPDESC;
		}

		// alert(desc); 
		return { link, desc, title, imgUrl };
	}

	public iapSetVerifyUrl(url: string) {
		if (this.OS != OSConfig.IOS_NATIVE_STORE) {
			return;
		}

		let call = Laya.PlatformClass.createClass("IAPManager");
		call.call("setVerifyUrl:", url);
	}


	public iapRecharge(id: number): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_ATONCE, null, null, null, 30000);
		webService.iapOrder(id, 1, (response) => {
			if (response.code != 0 || response.data == null || response.data.product_id == null || response.data.order_id == null) {
				LoadingUI.instance.hide();
				Native.instance.shopOrderFail(response.code);
			} else {
				let str = JSON.stringify({ product_id: response.data.product_id, order_id: response.data.order_id })
				let call = Laya.PlatformClass.createClass("IAPManager");
				call.callWithBack(function (result) {
					if (result == 0) {
						GameLogic.selfData.getInfo(true);
						AlertInGameCtrl.instance.show("充值成功", null, 0, false);
					} else if (result == 100) {
						AlertInGameCtrl.instance.show("充值失败", null, 0, false);
					} else if (result == 99) {
						AlertInGameCtrl.instance.show("参数错误", null, 0, false);
					} else if (result == 98) {
						AlertInGameCtrl.instance.show("当前环境无法支付", null, 0, false);
					} else if (result == 97) {
						AlertInGameCtrl.instance.show("获取商店商品信息失败", null, 0, false);
					} else if (result == 96) {
						AlertInGameCtrl.instance.show("充值失败", null, 0, false);
					} else if (result == 1) {
						AlertInGameCtrl.instance.show("验证订单失败，请稍后再试", null, 0, false);
					} else {
						AlertInGameCtrl.instance.show("充值失败", null, 0, false);
					}
					LoadingUI.instance.hide();
				}, "iapRecharge:", str);
			}
		});
	}

	/**
	 * 充值
	 * @param id 商品id
	 */
	public recharge(id: number): void {
		var cburl: string = GameConfig.GAME_URL + "index.html";
		if (server.code)
			cburl += "?share_room=" + server.code;
		if (Native.instance.isNative) {
			if (this.OS == OSConfig.IOS_NATIVE_STORE) {
				this.iapRecharge(id);
			} else {
				webService.rechagre(id, 1, "", (response) => {
					if (response.code == 0) {
						LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_ATONCE, null, null, null, 2000);
						var l = 0;
						var t = 0;
						var w = window.innerWidth - l * 2;
						var h = window.innerHeight - t * 2;
						Laya.Browser.window.conch.setExternalLinkEx(response.data.payInfo, l, t, w, h, true);
						Laya.Browser.window.conch.hideWebview();
						localStorage.setItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO, response.data.cpTranNo);
						GameLogic.selfData.startQuery();
					}
					else {
						Native.instance.shopOrderFail(response.code);
					}
				});
			}
		}
		else {
			if (Native.instance.isWeiXin) {
				webService.rechagre(id, 999, "", (response) => {
					if (response.code == 0) {
						Native.instance.onBridgeReady(response.data.payInfo, response.data.cpTranNo);
						// Native.instance.showIframe(response.data.payInfo);
						// localStorage.setItem(GameLogic.selfData.uid+GameConfig.CP_TRAN_NO, response.data.cpTranNo);
						// Laya.Browser.window.location.href = response.data.payInfo;
					}
					else
						Native.instance.shopOrderFail(response.code);
				});
			}
			//不在微信浏览器
			else {
				webService.rechagre(id, 1, cburl, (response) => {
					if (response.code == 0) {
						// Native.instance.showIframe(response.data.payInfo);
						localStorage.setItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO, response.data.cpTranNo);
						Laya.Browser.window.location.href = response.data.payInfo;
					}
					else
						Native.instance.shopOrderFail(response.code);
				});
			}
		}
	}

	private shopOrderFail(code): void {
		AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.shop_order_fail, code), null, 0, false);
	}

	// private showIframe(url: string): void {
	// 	var iframe = laya.utils.Browser.window.document.getElementById('recharge_iframe');
	// 	if (iframe) {
	// 		if (iframe.parentNode)
	// 			iframe.parentNode.removeChild(iframe);
	// 		return;
	// 	}
	// 	iframe = laya.utils.Browser.window.document.createElement('iframe');
	// 	iframe.id = "recharge_iframe";
	// 	iframe.setAttribute('src', url);
	// 	iframe.setAttribute('frameborder', 0);
	// 	var body = laya.utils.Browser.window.document.getElementsByTagName("body")[0];
	// 	body.appendChild(iframe);

	// 	//适配处理
	// 	var frameWidth = AppControl.getInstance().stage.width - 40;
	// 	var frameHeight = AppControl.getInstance().stage.height - 40;

	// 	// var styleStr = "position: absolute; left: 20px; top: 20px; z-index: 100009;";//laya 的index是100000
	// 	var styleStr = "position: absolute; left:5%; top:5%; z-index: 100009;";//laya 的index是100000
	// 	iframe.setAttribute('width', "90%");
	// 	iframe.setAttribute('height', "90%");
	// 	iframe.setAttribute('style', styleStr);
	// }

	/**
	* 充值 微信公众号
	*/
	private rechargeInWXMP(response: any, cpTranNo: string): void {
		Laya.Browser.window.WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
				"appId": response.appId,     //公众号名称，由商户传入     
				"timeStamp": response.timeStamp,         //时间戳，自1970年以来的秒数     
				"nonceStr": response.nonceStr, //随机串     
				"package": response.package,
				"signType": response.signType,         //微信签名方式：     
				"paySign": response.paySign //微信签名 
			},
			function (res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					localStorage.setItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO, cpTranNo);
					GameLogic.selfData.startQuery();
					alert("充值成功");
				}
				else if (res.err_msg == "get_brand_wcpay_request:cancel") {

					//                alert("");
				}
				else if (res.err_msg == "get_brand_wcpay_request:fail") {

					// alert("充值失败");
				}      // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
				//	           window.location.href = url;
			}
		);
	}

	private onBridgeReady(response: any, cpTranNo: string): void {
		if (typeof Laya.Browser.window.WeixinJSBridge == "undefined") {
			if (Laya.Browser.document.addEventListener) {
				Laya.Browser.document.addEventListener('WeixinJSBridgeReady', () => {
					Native.instance.rechargeInWXMP(response, cpTranNo);
				}, false);
			} else if (Laya.Browser.document.attachEvent) {
				Laya.Browser.document.attachEvent('WeixinJSBridgeReady', () => {
					Native.instance.rechargeInWXMP(response, cpTranNo);
				});
				Laya.Browser.document.attachEvent('onWeixinJSBridgeReady', () => {
					Native.instance.rechargeInWXMP(response, cpTranNo);
				});
			}
		} else {
			Native.instance.rechargeInWXMP(response, cpTranNo);
		}
	}

	private _hasNewVersion: boolean;
	private _newver: string;
	private _newverurl: string;
	private _newTips: string;
	/**
	 * 检查版本更新
	 */
	public checkUpdata(): void {
		if (Native.instance.isNative) {
			webService.checkUpdata((response) => {
				// alert(JSON.stringify(response));
				if (response.code == 0 && response.hasOwnProperty("newver") && response.hasOwnProperty("url")) {
					Laya.timer.clear(this, this.checkUpdata);
					if (server.code) {
						this._hasNewVersion = true;
						this._newver = response.newver;
						this._newverurl = response.url;
						this._newTips = response.tips;
					}
					else
						UpdateCtrl.instance.show(response.newver, response.url, response.tips);
				}
				else
					Laya.timer.once(30 * 60 * 1000, this, this.checkUpdata);
			});
		}
	}

	/**
	 * 已有更新情况下，在大厅弹出
	 */
	public checkNewVer(): void {
		if (Native.instance.isNative) {
			if (this._hasNewVersion)
				UpdateCtrl.instance.show(this._newver, this._newverurl, this._newTips);
		}
	}

	private batteryLevel: number = 100;
	private batteryState: number = 0;
	/**
     * 设置电池信息回调
     * 
     * @author DB
     * @param {Function} callback 
     * @memberof NativeHelper
     */
	public setBatteryCallback(callback: Function = null): void {
		if (Native.instance.isNative)
			NativeHelper.instance.setBatteryCallback(Native.instance.onBatteryChanged);
	}

	public setGroundCallback(callback: Function = null): void {
		if (Native.instance.isNative)
			NativeHelper.instance.setGroundCallback(Native.instance.onEnterBackGround);
	}

	private onEnterBackGround(isEnterBackGround): void {
		if (isEnterBackGround) {
			SoundManager.instance.stopMusic();
			if (!TableEndCtrl.instance.parent && !TableEndShuCtrl.instance.parent && !DialogManager.instance.hasDialog("MATCH_OVER") &&
				!DialogManager.instance.hasDialog("MATCH_OUT_WIN") && !DialogManager.instance.hasDialog("MATCH_OUT_LOSE")) {
				server.close()
			}

		} else {
			SoundManager.instance.playBg("bg1");
			if (!TableEndCtrl.instance.parent && !TableEndShuCtrl.instance.parent && !DialogManager.instance.hasDialog("MATCH_OVER") &&
				!DialogManager.instance.hasDialog("MATCH_OUT_WIN") && !DialogManager.instance.hasDialog("MATCH_OUT_LOSE")) {
				server.reconnect()
			}
		}
	}

	/**
	 * 
	 * @param state 电量改变
	 * @param level 
	 */
	public onBatteryChanged(state: number, level: number): void {
		if (state != -1 && level != -1) {
			Native.instance.batteryLevel = level;
			Native.instance.batteryState = state;
		}
		Dispatcher.dispatch(EventNames.BATTERY_CHANGE, [Native.instance.batteryState, Native.instance.batteryLevel]);
	}

	/**
     * 注册语音状态回调
     */
	public voiceMemberVoiceCallback(): void {
		NativeHelper.instance.voiceMemberVoiceCallback(this.onMemberVoice);
	}

    /**
     * 玩家语音状态发生变化    
     * @param {number} memberID 玩家 id
     * @param {number} status 0:停止说话 1:开始说话 2:继续说话 98取消禁言 99禁言
     * @param {string} roomName  所在房间名
     */
	public onMemberVoice(memberID: number, status: number, roomName: string): void {
		Dispatcher.dispatch(EventNames.VOICE_CHANGE, [memberID, status, roomName]);
	}

	/**
	* 屏蔽玩家语音
	* @param {string} roomName 
	* @param {number} memberID 
	* @param {number} enable 0 禁言 1不禁言
	* @param {Function} callback 
	*/
	public voiceForbidMemberVoice(roomName: string, memberID: number, enable: number, callback): void {
		LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
		NativeHelper.instance.voiceForbidMemberVoice(roomName, memberID, enable, (code: number) => {
			if (code == 0) {
				if (enable) {
					// HintCtrl.instance.show("禁言成功")
					Dispatcher.dispatch(EventNames.VOICE_CHANGE, [memberID, 99, roomName]);
				}

				else {
					// HintCtrl.instance.show("取消禁言成功")
					Dispatcher.dispatch(EventNames.VOICE_CHANGE, [memberID, 98, roomName]);
				}
				callback();
			}
			LoadingUI.instance.hide();
		});
	}

	public deepLinkCallback(): void {
		//native网页跳转参数
		NativeHelper.instance.deepLinkCallback(function (json, url) {
			try {
				var response: any = JSON.parse(json);//https://auhblo.mlinks.cc/AduS?code=123456&cmd=sharegame&pid=123456                
			} catch (error) {

			}

			if (response.hasOwnProperty("pid")) {
				GameConfig.pid = response.pid;
				webService.getUserInfo(server.uid, (response: any) => { });
			}

			if (response.hasOwnProperty("roomcode") && response.hasOwnProperty("cmd") && Number(response.roomcode) > 0) {
				if (response.cmd == "sharegame") {
					if (server.code) {
						if (server.code != response.roomcode)
							AlertInGameCtrl.instance.show(StringUtils.format(GameConfig.language.already_in_room, response.roomcode), null, 0, false);
					} else {
						LoginManager.instance.roomcode = response.roomcode;
						LoginManager.instance.checkJoinTable();
					}
				}
			}
		})
	}

	public gotoDownload(): void {
		var url: string = GameConfig.GAME_URL + "share/index.html?gamearea="+GameConfig.APPAREA;
		Laya.Browser.window.location.href = url;
	}
}
