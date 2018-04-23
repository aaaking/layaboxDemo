/*
* @author seacole
* 战绩页签;
*/
class MenuScoreUI extends ui.components.menu.MenuScoreUI {
    constructor() {
        super();
        this.name = "MenuScoreUI";
        this._list.itemRender = MenuHistoryScoreRenderer;
        this._list.scrollBar.visible = false;
        this._list.scrollBar.elasticDistance = 100;
        this._list.selectEnable = true;
        this._list.renderHandler = new Laya.Handler(this, this.updateList);
        this._list.mouseHandler = new Laya.Handler(this, this.onSelect);
        this._list.scrollBar.on(Laya.Event.CHANGE, this, this.onScrollListsChanged);
        this._list.array = [];

        this._listDetail.itemRender = MenuHistoryDetailRenderer;
        this._listDetail.scrollBar.visible = false;
        this._listDetail.selectEnable = true;
        this._listDetail.renderHandler = new Laya.Handler(this, this.updateListDetail);
        this._listDetail.mouseHandler = new Laya.Handler(this, this.onSelectDetail);

        EventManager.instance.registerOnObject(this, AppControl.getInstance().stage, Laya.Event.RESIZE, this, this.onResize);
        EventManager.instance.registerOnObject(this, this._btnBack, Laya.Event.CLICK, this, this.onBack);
        EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.UNAUTHORIZED, this, this.onUnauthorized);
        Dispatcher.on(EventNames.BACK_TO_LOGIN, this, this.clear);
        this.clear();
    }

    private _listArr: Array<any>;
    private _currRefreshPage: number;
    private _maxPageCount: number;
    private _currentTag: number;
    private _dicDetail: any={};
    private _detailTotal;
    private _lastGid: number;
    private _lastGtype: number;
    private _isFirstPageGet: boolean;
    public static TAG_LIST: number = 1;
    public static TAG_DETAIL: number = 2;

    public addListener(): void {
        EventManager.instance.enableOnObject(this);
        Laya.timer.loop(10 * 1000, this, this.onTimer);
        this.onResize();
        this._currentTag = 0;
        this.currentTag = MenuScoreUI.TAG_LIST;
    }

    public removeListener(): void {
        EventManager.instance.disableOnObject(this);
        Laya.timer.clear(this, this.onTimer);
        this.clear();
    }

    private onResize(): void {
        this.width = AppControl.getInstance().stage.width;
        this.height = AppControl.getInstance().stage.height > 1280 ? 1150 : AppControl.getInstance().stage.height - 130;
    }

    private clear(): void {
        this._isFirstPageGet = false;
        this._currRefreshPage = 0;
        this._maxPageCount = 0;
        this._listArr = [];
        // this._dicDetail = {};
        // this._detailTotal = {};
        this.updata();
    }

    /***渲染单元格时的回调方法***/
    private updateList(cell: MenuHistoryScoreRenderer, index: number): void {
        cell.updata(index);
    }

    /***选择单元格回调***/
    private onSelect(e: Laya.Event): void {
        if (e.type == Laya.Event.CLICK) {
            let className = Laya.ClassUtils.getClass(e.target)
            if (e.target.name == "share") {

            } else if (e.target.name == "video") {
                var gid: number = (e.target.parent as MenuHistoryScoreRenderer).dataSource.gid;
                var gtype: number = (e.target.parent as MenuHistoryScoreRenderer).dataSource.gtype
                if (this._dicDetail[gid]) {
                    this.showDetail(gid, gtype);
                }
                else {
                    LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
                    webService.getHistoryNoraml(gid, gtype, this.onGetHistoryDetail.bind(this));
                }
            } else {
                if (!GameConfig.IS_BANSHU) {
                    var gid: number = (e.target as MenuHistoryScoreRenderer).dataSource.gid;
                    var gtype: number = (e.target as MenuHistoryScoreRenderer).dataSource.gtype;
                    if (this._dicDetail[gid]) {
                        if (MatchConfig.isMatch((e.target as MenuHistoryScoreRenderer).dataSource.gmode))
                            this.showMatchHistory(gid);
                        else
                            this.showDetail(gid, gtype);
                    }
                    else {
                        LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
                        if (MatchConfig.isMatch((e.target as MenuHistoryScoreRenderer).dataSource.gmode))
                            webService.getHistoryMatch(gid, 1, gtype, (e.target as MenuHistoryScoreRenderer).dataSource.title, (e.target as MenuHistoryScoreRenderer).dataSource.tplayer,
                                (e.target as MenuHistoryScoreRenderer).dataSource.ttime, (e.target as MenuHistoryScoreRenderer).dataSource.rank, this.onGetHistoryMatchDetail.bind(this));
                        else
                            webService.getHistoryNoraml(gid, gtype, this.onGetHistoryDetail.bind(this));
                    }
                }
            }
        }
        // else if (e.type == Laya.Event.MOUSE_OUT) {
        //     if (this._list.scrollBar.value >= this._list.scrollBar.max)
        //         this.getNextPage();
        // }
    }

    private _refreshFirstPage: boolean;
    private _refreshListsMore: boolean;
    private onScrollListsChanged(): void {
        if (this._list.scrollBar.value < 0)
            this._refreshFirstPage = true;
        else if (this._list.scrollBar.value > 0)
            this._refreshFirstPage = false

        if (this._refreshFirstPage && this._list.scrollBar.value == 0)
            this.getFirstPage(true);

        if (this._list.scrollBar.value > this._list.scrollBar.max)
            this._refreshListsMore = true;
        else if (this._list.scrollBar.value < this._list.scrollBar.max)
            this._refreshListsMore = false

        if (this._refreshListsMore && this._list.scrollBar.value == this._list.scrollBar.max)
            this.getNextPage();
    }

    /***渲染单元格时的回调方法***/
    private updateListDetail(cell: MenuHistoryDetailRenderer, index: number): void {
        cell.updata();
    }

    /***选择单元格回调***/
    private onSelectDetail(e: Laya.Event, index): void {
        if (e.type == Laya.Event.CLICK) {
            // goto播录像
            var vid: string
            var gtype: number
            if (e.target.name == "video") {
                vid = (e.target.parent as MenuHistoryDetailRenderer).dataSource.vid;
                gtype = (e.target.parent as MenuHistoryDetailRenderer).dataSource.gtype
            } else {
                vid = (e.target as MenuHistoryDetailRenderer).dataSource.vid;
                gtype = (e.target as MenuHistoryDetailRenderer).dataSource.gtype
            }
            LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);


            var testPath = GameConfig.WEB_SERVICE_URL + "/history/video?vid=" + vid;
            Laya.loader.load(testPath, Laya.Handler.create(this, this.onGetVidoInfo, [gtype]), null, Laya.Loader.BUFFER)
            // webService.getVideoDetail(vid, gtype, this.onGetHistoryDetail.bind(this));
        }
    }

    private onGetVidoInfo(gtype: number, data: number): void {
        LoadingUI.instance.hide();
        if (data) {
            // if (String(gtype) == GameDef.GAME_TYPE.SHANXI_MJ || String(gtype) == GameDef.GAME_TYPE.WAKENG
            //     || String(gtype) == GameDef.GAME_TYPE.JINYUN_MJ || String(gtype) == GameDef.GAME_TYPE.SHISANSHUI
            //     || String(gtype) == GameDef.GAME_TYPE.JINYUN_GS_MJ || String(gtype) == GameDef.GAME_TYPE.JINYUN_HZ_MJ
            //     || String(gtype) == GameDef.GAME_TYPE.SHANGQIU_MJ || String(gtype) == GameDef.GAME_TYPE.GUANPAI) {
                GameConfig.IS_MATCH = false;
                AppControl.getInstance().showPage(GameConfig.getGamePage(GameDef.GAME_NAME[gtype - 1]), 1, String(gtype), data);
            // }
        }
    }

    private onGetHistoryList(response: any): void {
        if (response.code == 0) {
            if (this._currRefreshPage < response.page)
                this._currRefreshPage = response.page;
            this._maxPageCount = response.page_cnt;
            for (var i: number = 0; i < response.data.length; i++) {
                var flag: boolean = true;
                for (var j: number = 0; j < this._listArr.length; j++) {
                    if (this._listArr[j].gid == response.data[i].gid) {
                        flag = false;
                        break;
                    }
                }
                if (flag)
                    this._listArr.push(response.data[i]);
            }
            this._listArr.sort(this.onSort);
            this._list.array = this._listArr;
            this.updata();
            if (this.lastGInfo) {
                if (this._detailTotal && this._detailTotal[this._lastGid])
                    this.showDetail(this._lastGid, this._lastGtype);
                else {
                    LoadingUI.instance.show(LoadingUI.TYPE_NO_BG_DELAY);
                    webService.getHistoryNoraml(this._lastGid, this._lastGtype, this.onGetHistoryDetail.bind(this));
                }


            }
        }
    }

    private onSort(a: any, b: any): number {
        if (!a.hasOwnProperty("end_time"))
            a.end_time = 0;
        if (!b.hasOwnProperty("end_time"))
            b.end_time = 0;
        if (a.end_time > b.end_time)
            return -1;
        else if (a.end_time < b.end_time)
            return 1;
        else
            return 0;
    }

    private onGetHistoryDetail(response: any, gid: number, gtype: number): void {
        LoadingUI.instance.hide();
        if (response.code == 0) {
            if (!this._detailTotal)
                this._detailTotal = {}

            if (this._detailTotal[gid])
                return;
            if (!this._detailTotal[gid])
                this._detailTotal[gid] = [];
            if (response.data) {
                for (var i: number = 0; i < response.data.length; i++) {
                    let data = JSON.parse(response.data[i])
                    data.gtype = gtype
                    response.data[i] = data;
                    for (var k in data.ss) {
                        let v = data.ss[k]
                        if (!this._detailTotal[gid][k]) {
                            this._detailTotal[gid][k] = {
                                "n": v.n,
                                "s": v.s
                            }
                        } else {
                            this._detailTotal[gid][k].s += v.s
                        }
                    }
                }
            }
            this._dicDetail[gid] = response.data;
            this.showDetail(gid, gtype);
        }
    }

    private onGetHistoryMatchDetail(response: any, gid: number, gtype: number, title: string, tplayer: number, ttime: number, rank: number): void {
        LoadingUI.instance.hide();
        if (response.code == 0) {
            var data: any = { gid, gtype, title, tplayer, ttime };
            if (response.data)
                data.list = response.data;
            this._dicDetail[gid] = { list: response.data, gid, gtype, title, tplayer, ttime, rank, page: response.page, pageCnt: response.page_cnt };
            this.showMatchHistory(gid);
        }
    }

    private showMatchHistory(gid: number): void {
        MatchHistoryCtrl.instance.show(this._dicDetail[gid]);
    }

    private showDetail(gid: number, gtype): void {
        this.zOrder = 4
        this._lastGid = gid;
        this._lastGtype = gtype;
        this._listDetail.array = this._dicDetail[gid];
        this._luxiangname.skin = "createTable/" + gtype + ".png"
        this.currentTag = MenuScoreUI.TAG_DETAIL;
        this._profit.removeChildren()
        let peace = this._profit.width / this._detailTotal[gid].length
        for (var k in this._detailTotal[gid]) {
            let v = this._detailTotal[gid][k]
            let name = new Laya.Label(Utils.getFitNickName(v.n, 10))
            name.fontSize = 26
            name.color = "#ffffff"
            name.align = "center"
            name.strokeColor = "#5c281f"
            name.stroke = 2
            name.x = peace * parseInt(k) + peace / 2
            name.y = 10
            name.anchorX = 0.5
            this._profit.addChild(name)
            let text = new Laya.Label(String(v.s))
            text.align = "center"
            if (v.s >= 0) {
                text.text = "+" + v.s
                text.font = "font_num_10"
            } else {
                text.font = "font_num_9"
            }
            text.x = peace * parseInt(k) + peace / 2
            text.y = 45
            text.anchorX = 0.5
            this._profit.addChild(text)
        }
    }

    private onHistoryProfit(response): void {
        if (response.code == 0 && response.data) {
            for (var k in response.data) {
                // this["profit_" + k].text = response.data[k]
                if (response.data[k] >= 0) {
                    this["profit_" + k].text = "+" + response.data[k]
                    this["profit_" + k].color = "#ffe932"
                } else {
                    this["profit_" + k].color = "#2bff4e"
                    this["profit_" + k].text = String(response.data[k])
                }
            }
        }
    }

    public getFirstPage(isRefresh: boolean = false): void {
        if (!this._isFirstPageGet || isRefresh) {
            if (!this._isFirstPageGet)
                webService.getHistoryProfit(this.onHistoryProfit.bind(this))
            webService.getHistoryList(1, 3, this.onGetHistoryList.bind(this));
            this._isFirstPageGet = true;
        }
    }

    private getNextPage(): void {
        if (this._currRefreshPage < this._maxPageCount)
            webService.getHistoryList(this._currRefreshPage + 1, 3, this.onGetHistoryList.bind(this));
    }

    private updata(): void {
        if (this._list.array && this._list.array.length) {
            this._labNoHistory.visible = false;
            this._list.visible = true;
        }
        else {
            this._labNoHistory.visible = true;
            this._list.visible = false;
        }
    }

    public set currentTag(value: number) {
        if (this._currentTag != value) {
            this._currentTag = value;
            if (this._currentTag == MenuScoreUI.TAG_LIST) {
                this._listHistoryBox.visible = true;
                this._list.visible = true;
                this._listDeatilBox.visible = false;
                this._listDetail.visible = false;
                this._btnBack.visible = false;
            }
            else {
                this._listHistoryBox.visible = false;
                this._list.visible = false;
                this._listDeatilBox.visible = true;
                this._listDetail.visible = true;
                this._btnBack.visible = true;
            }
        }
    }

    private onBack(e: Laya.Event): void {
        this.zOrder = 1
        this.clearLastInfo();
        this.currentTag = MenuScoreUI.TAG_LIST;
    }

    private onUnauthorized(e: Laya.Event): void {
        this.clearLastInfo();
    }

    public clearLastInfo(): void {
        this._lastGid = 0;
        this._lastGtype = 0;
    }

    public get lastGInfo(): boolean {
        if (this._lastGid && this._lastGtype)
            return true;
        else
            return false;
    }

    private onTimer(): void {
        if (this.visible && !this.lastGInfo)
            this.getFirstPage(true);
    }

    public get isDetailShowing(): boolean {
        return this._listDeatilBox.visible;
    }

}