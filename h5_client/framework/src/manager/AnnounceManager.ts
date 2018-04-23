/*
* @author seacole
*公告管理
*/
class AnnounceManager {
    constructor() {

    }

    private static _instance: AnnounceManager;
    public static get instance(): AnnounceManager {
        if (this._instance == undefined) {
            this._instance = new AnnounceManager();
        }
        return this._instance;
    }

    public start(): void {
        if (!GameConfig.IS_BANSHU) {
            Laya.timer.loop(60 * 1000 * 5, this, this.onTimer);
            this.onTimer();
        }
    }

    public stop(): void {
        MarqueeText.instance.clear();
        Laya.timer.clear(this, this.onTimer);
    }

    private onTimer(): void {
        webService.getAnnounce((response) => {
            if (response.code == 0) {
                for (var i: number = 0; i < response.times; i++) {
                    MarqueeText.instance.show(response.tips);
                }
            }
        });
    }
}