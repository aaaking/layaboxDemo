/*
* @author seacole
*实时语音管理
*/
class RealTimeSpeechManager extends Laya.EventDispatcher {
    constructor() {
        super();
    }

    private static _instance: RealTimeSpeechManager;
    public static get instance(): RealTimeSpeechManager {
        if (this._instance == undefined) {
            this._instance = new RealTimeSpeechManager();
        }
        return this._instance;
    }

    public static CONST_MIC: string = "r_ssyy_2";

    public setMic(): void {
        var isOpen: string = localStorage.getItem(RealTimeSpeechManager.CONST_MIC);
        if (isOpen == "on")
            this.openMic();
        else
            this.closeMic();
    }

    private openMic(): void {
        NativeHelper.instance.checkRecordPermission((permission: number) => {
            if (permission) {
                NativeHelper.instance.voiceOpenMic((code: number) => {
                    if (code == 0) {
                        localStorage.setItem(RealTimeSpeechManager.CONST_MIC, "on");
                        Laya.SoundManager.setMusicVolume(SoundManager.instance.musicVolume * 0.7);
                    }
                    this.event(EventNames.REALTIME_MIC, ["on", code]);
                });
            } else {
                AlertInGameCtrl.instance.show("未获取麦克风权限，无法进行实时语音，<br>请在设置中开启权限", (type: number) => {
                    if (type == AlertCtrl.CONFIRM) {
                        NativeHelper.instance.openPermissionSetting();
                    }
                });
                this.event(EventNames.REALTIME_MIC, ["off", 1000]);
            }
        });
    }

    private closeMic(): void {
        NativeHelper.instance.voiceCloseMic((code: number) => {
            if (code == 0) {
                localStorage.setItem(RealTimeSpeechManager.CONST_MIC, "off");
                Laya.SoundManager.setMusicVolume(SoundManager.instance.musicVolume);
            }
            this.event(EventNames.REALTIME_MIC, ["off", code]);
        });
    }

    public passiveCloseMic(): void {
        NativeHelper.instance.voiceCloseMic((code: number) => {
            this.event(EventNames.REALTIME_MIC, ["off", code]);
        });
    }

    public switchMic(): void {
        var isOpen: string = localStorage.getItem(RealTimeSpeechManager.CONST_MIC);
        if (isOpen == "on")
            this.closeMic();
        else {
            this.openMic();
        }
    }


    public setSpeaker(): void {
        var isOpen: string = localStorage.getItem("r_speaker");
        if (!isOpen || isOpen == "on")
            this.openSpeaker();
        else
            this.closeSpeaker();
    }

    private openSpeaker(): void {
        NativeHelper.instance.voiceOpenSpeaker((code: number) => {
            if (code == 0) {
                localStorage.setItem("r_speaker", "on");
            }
            this.event(EventNames.REALTIME_SPEAKER, ["on", code]);
        });
    }

    private closeSpeaker(): void {
        NativeHelper.instance.voiceCloseSpeaker((code: number) => {
            if (code == 0) {
                localStorage.setItem("r_speaker", "off");
            }
            this.event(EventNames.REALTIME_SPEAKER, ["off", code]);
        });
    }

    public switchSpeaker(): void {
        var isOpen: string = localStorage.getItem("r_speaker");
        if (!isOpen || isOpen == "on")
            this.closeSpeaker();
        else
            this.openSpeaker();
    }

}