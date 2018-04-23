/*
* @author seacole
 * 创建桌子
*/
class ReportCtrl extends BaseCtrl {
    constructor() {
        super();
        this["name"] = "ReportCtrl";
    }

    private static _instance: ReportCtrl;
    public static get instance(): ReportCtrl {
        if (!this._instance)
            this._instance = new ReportCtrl();
        return this._instance;
    }

    protected _ui: ui.panel.ReportUI;
    private _listScoreData: any[];
    private _listVisitData: any[];
    private _selectTab: number = 0;
    private _type: number;
    private _data: any;

    public static TYPE_REAL_TIME: number = 1;
    public static TYPE_GAME_END: number = 2;

    public show(type: number = ReportCtrl.TYPE_REAL_TIME, data: any = null): void {
        this._type = type;
        this._data = data;
        this._selectTab = 0;
        this.showself();
    }

    /**
     * 这里完成new ui，添加注册监听等初始化工作
     */
    public beforeShow(): void {
        if (!this._ui) {
            this._ui = new ui.panel.ReportUI();
            this._ui._listResult.itemRender = ReportRenderer;
            this._ui._listResult.scrollBar.visible = false;
            this._ui._listResult.renderHandler = new Laya.Handler(this, this.updateListResult);
            this._ui._listVisiter.itemRender = HeadRenderer;
            this._ui._listVisiter.scrollBar.visible = false;
            this._ui._listVisiter.renderHandler = new Laya.Handler(this, this.updateListVisiter);

            EventManager.instance.registerOnObject(this, this._ui._btnClose, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnResult, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, this._ui._btnVisiter, Laya.Event.CLICK, this, this.onTouch);
            EventManager.instance.registerOnObject(this, server, EventNames.GAME_REAL_TIME_RECORD_REP, this, this.onRealTimeRecordRepHandler);
        }
        super.beforeShow();
        this.onShow();
    }

    /**
    * 开启监听，配置宽高，添加到舞台
    */
    public onShow(): void {
        this.checkType();
        this.checkTab();
        super.onShow();
        if (this._type == ReportCtrl.TYPE_REAL_TIME) {
            server.realTimeRecordReq();
            // this.onRealTimeRecordRepHandler({
            //     playerInfo: [{ uid: 10001, score: 1, info: ["自摸次数", "2", "接炮次数", "3", "自摸次数", "4", "接炮次数", "5", "自摸次数", "222", "自摸次数", "222"] }
            //         , { uid: 10002, score: 12345, info: ["自摸次数", "22", "接炮次数", "3", "自摸次数", "4", "接炮次数", "5", "自摸次数", "222"] }
            //         , { uid: 10003, score: -54321, info: ["自摸次数", "2", "接炮次数", "333", "自摸次数", "4", "接炮次数", "5", "自摸次数", "222"] }
            //         , { uid: 10004, score: 1900, info: ["自摸次数", "2", "接炮次数", "3", "自摸次数", "41", "接炮次数", "52", "自摸次数", "222"] }
            //     ], visiters: [10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011]
            // });
        }
        else
            this.onRealTimeRecordRepHandler(this._data);
    }
    /**
     * 离开时调度
     */
    public afterShow(): void {
        super.afterShow();
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._ui._btnClose:
                this.hide();
                break;

            case this._ui._btnResult:
                this.selectTab = 0;
                break;

            case this._ui._btnVisiter:
                this.selectTab = 1;
                break;
        }
    }

    private set selectTab(value: number) {
        if (this._selectTab != value) {
            this._selectTab = value;
            this.checkTab();
        }
    }

    private checkType() {
        this._ui._boxRealtime.visible = this._type == ReportCtrl.TYPE_REAL_TIME;
        this._ui._imgGameEnd.visible = this._type == ReportCtrl.TYPE_GAME_END;
    }

    private checkTab(): void {
        if (this._selectTab == 0) {
            this._ui._btnResult.alpha = 1;
            this._ui._btnVisiter.alpha = 0.01;
        }
        else {
            this._ui._btnResult.alpha = 0.01;
            this._ui._btnVisiter.alpha = 1;
        }
        this._ui._boxResult.visible = this._selectTab == 0;
        this._ui._boxVisiter.visible = this._selectTab == 1;
    }

    /***渲染单元格时的回调方法***/
    private updateListResult(cell: ReportRenderer, index: number): void {
        cell.updata();
    }

    /***渲染单元格时的回调方法***/
    private updateListVisiter(cell: HeadRenderer, index: number): void {
        cell.updata();
        cell.scale(0.8, 0.8);
    }

    private onRealTimeRecordRepHandler(msg: any): void {
        if (msg) {
            if (msg.playerInfo)
                this._listScoreData = msg.playerInfo;
            else
                this._listScoreData = [];
            if (msg.visiters)
                this._listVisitData = msg.visiters;
            else
                this._listVisitData = [];
            this._ui._imgNoResult.visible = this._listScoreData.length == 0;
            this._ui._imgNoVisiter.visible = this._listVisitData.length == 0;
            this._ui._listResult.array = this._listScoreData;
            this._ui._listVisiter.array = this._listVisitData;
        }
    }
}