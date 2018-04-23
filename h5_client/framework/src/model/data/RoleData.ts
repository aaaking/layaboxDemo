/*
* @author seacole
* 角色信息;
*/
class RoleData extends Model {
    constructor() {
        super();
    }

    public uid: number = 0;
    public nickname: string = "";
    public gold: number = 0;
    public avatar: number = 0;
    public sex: string = "";
    public diamond: number = 0;
    public game_code: number = 0;
    public permit: number = 0;
    private _queryCount: number = 0;

    /**
     * 清理属性
     */
    public clear(): void {
        this.uid = 0;
        this.nickname = "";
        this.gold = 0;
        this.avatar = 0;
        this.sex = "";
        this.diamond = 0;
        this.game_code = 0;
        this._queryCount = 0;
    }

    public getInfo(isRefresh: boolean = false): void {
        if (!this.uid || isRefresh) {
            webService.getUserInfo(server.uid, (response: any) => {
                if (response.code == 0) {
                    Utils.injectProp(this, response);
                    Dispatcher.dispatch(EventNames.REFRESH_ROLE_INFO);
                }
            });
        }
    }

    /**
     * 定时查询充值订单是否完成
     */
    public startQuery(): void {
        var cpTranNo: string = localStorage.getItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO);
        if (cpTranNo) {
            if (this._queryCount > 10) {
                localStorage.setItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO, "");
                this._queryCount = 0;
            }
            else {
                this._queryCount++;
                webService.query(cpTranNo, (response) => {
                    if (response.code == 0) {
                        localStorage.setItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO, "");
                        this._queryCount = 0;
                        this.getInfo(true);
                    }
                    else {
                        Laya.timer.once(10000, this, this.startQuery);
                    }
                });
            }
        }
    }

    public query(): void {
        var cpTranNo: string = localStorage.getItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO);
        if (cpTranNo) {
            webService.query(cpTranNo, (response) => {
                if (response.code == 0) {
                    localStorage.setItem(GameLogic.selfData.uid + GameConfig.CP_TRAN_NO, "");
                    this._queryCount = 0;
                    this.getInfo(true);
                }
            });
        }
    }



}