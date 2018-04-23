/*
* @author seacole
*登录管理
*/
class LoginManager {
    constructor() {

    }

    private static _instance: LoginManager;
    public static get instance(): LoginManager {
        if (this._instance == undefined) {
            this._instance = new LoginManager();
        }
        return this._instance;
    }

    private _loginData: any = { uid: 0, token: '' };
    private _roomcode: string;
    public appWxLogin(): void {
        NativeHelper.instance.wxLogin(function (code: string) {
            if (code.length > 0) {
                LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
                webService.loginByWxFromWechat(code, this.onVerifyResponse.bind(this));
            } else {
                HintCtrl.instance.show("微信登录失败");
            }
        }.bind(this))
    }

    //有序执行登录
    public orderedLogin(isFirstEnter: boolean = false): boolean {
        var isAutoLogin: boolean = true;
        var params: any = Native.instance.getUrlParams();
        if (params.hasOwnProperty("pid"))
            GameConfig.pid = params.pid;
        //if中为测试代码
        if (isFirstEnter && params.id && params.password) {
            if (params.hasOwnProperty("roomcode"))
                this._roomcode = params.roomcode;
            this.passportLogin(params.id, params.password);
        }
        else {
            var flag: boolean;
            if (isFirstEnter) {
                if (params.hasOwnProperty("roomcode"))
                    this._roomcode = params.roomcode;
                flag = this.checkToken();
                if (!flag)
                    flag = this.checkIsWxLoginFromWechat();
                if (!flag) {
                    // if (Native.instance.isWeiXin)
                    //     Laya.Browser.window.location.href = webService.getWxLoginUrl();
                    // else
                        isAutoLogin = false;
                }

            }
            else {
                // if (Native.instance.isWeiXin)
                //     Laya.Browser.window.location.href = webService.getWxLoginUrl();
                // else
                    isAutoLogin = false;
            }
        }
        if (isFirstEnter)
            this.getWxConfig();
        else
            GameLogic.userData.clearData();
        return isAutoLogin;
    }

    /**
     * 注册
     */
    public regist(uname: string, upwd: string, nickname: string): void {
        webService.regist(uname, upwd, nickname, (response: any) => {
            if (response.code == 0) {
                response.nickname = nickname;
                this.onVerifyResponse(response);
            }
            else
                HintCtrl.instance.show("regist error. code:" + response.code);
        });
    }

    /**
    * 通行证登录
    */
    public passportLogin(uname: string, upwd: string): void {
        webService.passportLogin(uname, upwd, (response: any) => {
            if (response.code == 0) {
                this.onVerifyResponse(response);
            }
            else
                AlertInGameCtrl.instance.show(GameConfig.language.account_login_fail, null, 0, false);
            log("passport login error. code:" + response.code);
        });
    }

    /**
    * 游客登录
    */
    public touristLogin(): void {
        webService.touristLogin(webService.uuid, (response: any) => {
            if (response.code == 0) {
                this.onVerifyResponse(response);
            }
            else
                AlertInGameCtrl.instance.show(GameConfig.language.guest_fail, null, 0, false);
            log("passport login error. code:" + response.code);
        });
    }

    /**
    * 检查是否有token 暂时没用
    */
    private checkToken(): boolean {
        let data = this._loginData;
        console.log('checkToken: ' + JSON.stringify(GameLogic.userData));
        data.uid = GameLogic.userData.getItem('uid');
        data.token = GameLogic.userData.getItem('token');
        data.nickname = GameLogic.userData.getItem('nickname');
        data.sex = GameLogic.userData.getItem('sex');
        data.avatar = GameLogic.userData.getItem('avatar');
        data.openid = GameLogic.userData.getItem('openid');
        if (data.token && data.uid) {
            Laya.timer.callLater(this, this.loginSucc);//避免连续跳转不同场景会出现加载短暂黑屏


            // server.setInfo(this._loginData.uid, this._loginData.token);
            // GameConfig.setServerUrl("10.10.10.100:51002;");
            // server.code = "90001";
            // AppControl.getInstance().showPage(WaKengPage);
            return true;
        }
        return false;
    }

    private checkIsWxLoginFromWechat(): boolean {
        var params: any = Native.instance.getUrlParams();
        var code: string;
        if (params.hasOwnProperty("code") && params.hasOwnProperty("state") && params.state == "wx") {
            code = params.code;
            if (params.hasOwnProperty("roomcode"))
                this._roomcode = params.roomcode;
        }
        if (code && code != "null") {
            log("try to login by wechat.code:" + code);
            webService.loginByWxFromWechat(code, this.onVerifyResponse.bind(this));
            return true;
        }
        else {
            return false;
        }
    }

    public getWxConfig(): void {
        webService.getWxConfig(WxWeb.instance.wxConfig);
    }

    /**
     * web返回
     */
    private onVerifyResponse(response): void {
        // AlertCtrl.instance.show(JSON.stringify(response));
        LoadingUI.instance.hide();
        if (response.code == 0) {
            this._loginData = response;
            GameLogic.userData.setItem('uid', this._loginData.uid);
            GameLogic.userData.setItem('nickname', this._loginData.nickname);
            GameLogic.userData.setItem('sex', this._loginData.sex);
            GameLogic.userData.setItem('avatar', this._loginData.avatar);
            GameLogic.userData.setItem('token', this._loginData.token);
            GameLogic.userData.setItem('openid', this._loginData.openid, true);
            this.loginSucc();
        }
        else {
            HintCtrl.instance.show("login error. code:" + response.code);
            if (!AppControl.getInstance().currentPage)
                AppControl.getInstance().showPage(LoginPage);
        }
    }

    /**
     * 设置登录信息后跳转
     */
    private loginSucc(): void {
        //测试代码
        // var params: any = Native.instance.getUrlParams();
        // if (params.hasOwnProperty("roomcode"))
        //     this.roomcode = params.roomcode;
        //-------

        NativeHelper.instance.voiceSetUserInfo(this._loginData.uid + "");
        this.checkJoinTable();
    }

    public set roomcode(value: string) {
        this._roomcode = value;
    }

    public checkJoinTable(): void {
        server.setInfo(this._loginData.uid, this._loginData.token, this._loginData.openid);
        // this.roomcode = "931362";
        if (this._roomcode) {
            webService.joinTable(this._roomcode, (response: any) => {
                if (response.code == 0) {
                    GameConfig.setServerUrl(response.ip);
                    GameConfig.joinTable(response, true)

                }
                else {
                    if (!AppControl.getInstance().currentPage || AppControl.getInstance().currentPage instanceof LoginPage)
                        AppControl.getInstance().showPage(MenuPage, { room_code: LoginManager.instance._roomcode });
                    else
                        AlertInGameCtrl.instance.show(GameConfig.language.join_table_fail, null, 0, false);// + " code:" + response.code

                }
            });
        }
        else
            AppControl.getInstance().showPage(MenuPage);
    }
}