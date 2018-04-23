/*
* @author seacole
* 非游戏服务器交互逻辑;
*/
class MenuServer extends Laya.EventDispatcher{
    constructor(){
        super();
    }

    protected _socket: Laya.Socket;
    private _uid: number;
    private _code: string;
    private _token: string;
    private _openid: string;
    private _protoBuilderMap: any;
    private _protoIDs: any;
    private _protoRoot: any;
    private _exception: Array<any>;
    private _needCache: Boolean;
    private _cacheList: Array<any> = [];
    private _serverTime: number;
    private _clientTime: number;
    private _heartBeatBegin: number;
    private _ping: number = 0;
    private _latitude: number;
    private _longitude: number;
    private _address: string;
    private _connectCount: number = 0;

    private _notLogList: Array<string> = [EventNames.GAME_HEARTBEAT_NTF];

    initData(root: any): void {
        this._protoRoot = root;
        this._protoIDs = ProtoIDs._protoIDs;
    }

    /**
	 * 连接服务器
	 */
    connect(): void {
        if (this._socket) {
            this._socket.off(Laya.Event.OPEN, this, this.onConnect);
            this._socket.off(Laya.Event.CLOSE, this, this.onDisconnect);
            this._socket.off(Laya.Event.MESSAGE, this, this.onSocketData);
            this._socket.off(Laya.Event.ERROR, this, this.onError);
            this._socket.close();
        }

        this._socket = new Laya.Socket();
        this._socket.on(Laya.Event.OPEN, this, this.onConnect);
        this._socket.on(Laya.Event.ERROR, this, this.onError);
        let url = GameConfig.currentServerUrl + "?uid=" + this._uid + "&c=" + this._code + "&t=" + md5(this._token + this._uid + this.code + "OhFei6SieB0e");
        this._socket.connectByUrl(url);
        log('connecting... ' + url);
        Laya.timer.once(5000, this, this.connect);
    }

    /**
     *关闭服务器
     */
    close(): void {
        log('close Server');
        this._socket.close();
        this.onDisconnect(null);
    }

    /**
     * 连接成功
     */
    private onConnect(event: Laya.Event): void {
        this._connectCount = 0;
        Laya.timer.clear(this, this.connect);
        this._socket.off(Laya.Event.OPEN, this, this.onConnect);
        this._socket.on(Laya.Event.CLOSE, this, this.onDisconnect);
        this._socket.on(Laya.Event.MESSAGE, this, this.onSocketData);

        log('connect on:' + GameConfig.currentServerUrl);
        this.event(EventNames.CONNECT_SERVER);
        this.startHeart();
    }

    /**
     * 连接错误
     */
    private onError(event: Laya.Event): void {
        log('server error');
        GameConfig.nextServerUrlIdx();
        Laya.timer.clear(this, this.connect);
        this.event(EventNames.SERVER_ERROR);
        this.close();


        //连接失败后 每3秒尝试自动重连
        // Laya.timer.once(3000, this, this.connect);
    }

    /**
     * 断开连接
     */
    private onDisconnect(event): void {
        log("disconnect");
        Laya.timer.clear(this, this.connect);
        this._socket.off(Laya.Event.OPEN, this, this.onConnect);
        this._socket.off(Laya.Event.CLOSE, this, this.onDisconnect);
        this._socket.off(Laya.Event.MESSAGE, this, this.onSocketData);
        this._socket.off(Laya.Event.ERROR, this, this.onError);

        if (event && event.code && Number(event.code) == 555) {
            this.event(EventNames.SHOW_DISCONNECT, 1);
        }
        else {
            this.event(EventNames.SHOW_DISCONNECT);
            //断开连接需要区分是进入房间信息错误还是玩了一半游戏断线
            if (this._code) {
                this._connectCount++;
                if (this._connectCount <= 5) {
                    log("正在进行第" + this._connectCount + "次重连...");
                    Laya.timer.once(100, this, this.connect);
                }
                else {
                    log("重连失败");
                    this.event(EventNames.SHOW_DISCONNECT, 2);
                }
            }
        }

    }

    /**
     * 启动心跳
     */
    private startHeart(): void {
        Laya.timer.loop(2000, this, this.onHeartTimer);
    }

    /**
     * 单位时间心跳
     */
    private onHeartTimer(): void {
        if (this._socket.connected) {
            this.send(EventNames.GAME_HEARTBEAT_NTF);
            this._heartBeatBegin = Laya.Browser.now();
            this._socket.flush();
            Laya.timer.loop(5000, this, this.onHeartTimerEnd);
        }
    }

    /**
    * 收到心跳
    */
    private onRecvHeart(message: any): void {
        this._serverTime = message.time;
        this._clientTime = Laya.Browser.now();
        this._ping = (this._clientTime - this._heartBeatBegin) * 0.5;
        Dispatcher.dispatch(EventNames.PING_CHANGE);
        //log("onRecvHeart ping=" + ping + " stime=" + message.time);        
        Laya.timer.clear(this, this.onHeartTimerEnd);
    }

    /**
     * 心跳超时
     */
    private onHeartTimerEnd(): void {
        log('心跳接收超时,主动关闭连接.');
        this.close();
    }

    /**
     * 获取当前服务器时间 单位：毫秒
     */
    public get serverTime(): number {
        var now: number = Laya.Browser.now();
        return this._serverTime + now - this._clientTime;
    }

    /**
     * 服务器回包
     */
    private onSocketData(message: any): void {
        var bytes: Laya.Byte = new Laya.Byte(message);
        bytes.endian = Laya.Socket.BIG_ENDIAN;
        var nameId = bytes.getInt16();
        var body: Uint8Array = bytes.getUint8Array(bytes.pos, bytes.length - bytes.pos);
        var name: string = this._protoIDs[nameId];
        if (name) {
            // var msgname: string = name.substring(name.indexOf('.') + 1, name.length);
            var awesomeMessage: any = this._protoRoot.lookup(name);
            var message: any = awesomeMessage.decode(body);
            this.dispatchMessage(name, message)
        }
    }

    public onSheetData(nameId, body: any) {

        var name: string = this._protoIDs[nameId];
        if (name) {
            var awesomeMessage: any = this._protoRoot.lookup(name);
            var message: any = awesomeMessage.decode(body);
            return { name: name, msg: message }
        }
    }

    /**
     * 派发服务器消息
     */
    public dispatchMessage(name: string, message: any): void {
        //优先特殊处理的协议
        switch (name) {
            case EventNames.GAME_HEARTBEAT_NTF:
                this.onRecvHeart(message);
                return;
            default:
                break;
        }

        if (this._needCache) {
            if (this._exception && this._exception.indexOf(name) > -1) {

            }
            else {
                this._cacheList.push([name, message]);
                return;
            }
        }

        if (this._notLogList.indexOf(name) == -1)
            log("recv:" + name + " " + JSON.stringify(message));

        if (message)
            this.event(name, message);
    }

    /**
	 * 发送消息
	 * @param name
	 * @param data
	 */
    send(name: string, data: any = null): void {
        if (!this._socket)
            return;
        if (!data)
            data = {};
        var awesomeMessage: any = this._protoRoot.lookup(name);
        // Create a new message
        var message: any = awesomeMessage.create(data);
        // Verify the message if necessary (i.e. when possibly incomplete or invalid)
        var errMsg: any = awesomeMessage.verify(message);
        if (errMsg)
            throw Error(errMsg);

        // Encode a message to an Uint8Array (browser) or Buffer (node)
        var buffer: any = awesomeMessage.encode(message).finish();
        if (this._notLogList.indexOf(name) == -1)
            log("send:" + name + " " + JSON.stringify(message));
        (this._socket.output as Laya.Byte).clear();
        // (this._socket.output as Laya.Byte).writeInt16(buffer.length + 2);
        (this._socket.output as Laya.Byte).writeInt16(this._protoIDs[name]);
        (this._socket.output as Laya.Byte).writeArrayBuffer(buffer, 0, buffer.length);
        this._socket.flush();
    }

    /**
     * 开始缓存协议
     */
    public startCache(exception: Array<any> = null, cTime: number = -1): void {
        log("开始缓存");
        if (exception) {
            this._exception = exception.concat();
        }
        else {
            this._exception = [];
        }
        this._needCache = true;
    }

    /**
     * 缓存结束
     */
    public stopCache(): void {
        log("缓存结束");
        this._needCache = false;
        while (this._cacheList.length > 0) {
            var arr: Array<any> = this._cacheList.shift();
            this.dispatchMessage(arr[0], arr[1]);
            if (this._needCache) {
                break;
            }
        }
    }

    /**
	 * 登录后相关属性赋值
	 * @param uid
	 * @param token
     * @param code 房间号
	 */
    public setInfo(uid: string, token: string, openid: string): void {
        this._token = token;
        this._uid = parseInt(uid);
        this._openid = openid;
    }

    public set code(code: string) {
        if (!code)
            this._connectCount = 0;
        this._code = code;
        // this._code="16973";
        WxWeb.instance.onShare();
    }

    public get code(): string {
        return this._code;
    }
}