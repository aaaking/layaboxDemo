/*
* @author seacole
* 非实时录音管理
*/
class RecordManager {
    constructor() {

    }

    private static _instance: RecordManager;
    public static get instance(): RecordManager {
        if (this._instance == undefined) {
            this._instance = new RecordManager();
        }
        return this._instance;
    }

    /**
     * 开始录音
     * @param callback 
     */
    public startRecord(callback: any): void {
        if (Native.instance.isNative) {

        }
        else {
            if (Native.instance.isWeiXin)
                WxWeb.instance.startRecord(callback);
        }

    }
    /**
     * 停止录音
     * @param needSend 
     * @param seatid 
     * @param nickname 
     * @param time 
     */
    public stopRecord(needSend: boolean, seatid: number, nickname: string, time: number = 0): void {
        if (Native.instance.isNative) {

        }
        else {
            if (Native.instance.isWeiXin)
                WxWeb.instance.stopRecord(needSend, seatid, nickname, time);
        }
    }

    /**
     * 下载录音
     * @param serverId 
     * @param seatid 
     * @param nickname 
     * @param time 
     */
    public downloadVoice(serverId: string, seatid: number = 0, nickname: string = "", time: number = 0): void {
        if (Native.instance.isNative) {

        }
        else {
            if (Native.instance.isWeiXin)
                WxWeb.instance.downloadVoice(serverId, seatid, nickname, time);
        }
    }

    /**
     * 清除录音
     */
    public clearRecord(): void {
        if (Native.instance.isNative) {

        }
        else {
            if (Native.instance.isWeiXin)
                WxWeb.instance.clearRecord();
        }
    }
}