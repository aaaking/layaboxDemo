/*
* @author seacole
* 扑克结算个人信息renderer
*/
class WaKengGameEndInfoRenderer extends ui.wakeng.WaKengGameEndInfoRendererUI {
    constructor() {
        super();
    }

    private onDataChanged(uid: number): void {
        if (this.dataSource && !this.dataSource.nickname && this.dataSource.hasOwnProperty("uid") && this.dataSource.uid == uid) {
            var player: PlayerData = BaseGameData.getPlayerDataByUid(uid);
            this.dataSource.nickname = player.nickname;
            this.updata();
            Dispatcher.off(EventNames.PLAYER_DATA_CHANGED, this, this.onDataChanged);
        }
    }


    //nickname leftCards boom score
    public updata(): void {
        if (this.dataSource) {
            this._labNickname.text = Utils.getFitNickName(this.dataSource.nickname, 10);
            if (!this.dataSource.nickname)
                Dispatcher.on(EventNames.PLAYER_DATA_CHANGED, this, this.onDataChanged);
            else
                Dispatcher.off(EventNames.PLAYER_DATA_CHANGED, this, this.onDataChanged);
            // if (this.dataSource.info[0].hasOwnProperty("value"))
            //     this._labLeftCards.text = this.dataSource.info[0].value;
            // else
            //     this._labLeftCards.text = "0";
            this._imgWuSan.visible = false;
            if (this.dataSource.info[1].hasOwnProperty("value")) {
                this._labBomb.text = "×" + this.dataSource.info[1].value;
                this._imgBomb.visible = true;
            }
            else {
                this._labBomb.text = "";
                this._imgBomb.visible = false;
            }


            if (this.dataSource.info[2].hasOwnProperty("value")) {
                if (this.dataSource.info[2].value >= 0) {
                    this._labScore.font = "font_num_14";
                    this._labScore.text = "+" + this.dataSource.info[2].value;
                    this._imgWuSan.visible = BaseGameData.globalInfo == "无3翻倍";
                }
                else {
                    this._labScore.font = "font_num_15";
                    this._labScore.text = this.dataSource.info[2].value;
                }
            }
            else {
                this._labScore.text = "+0";
                this._labScore.font = "font_num_14"
            }
            this._imgMaster.visible = this.dataSource.seatid == BaseGameData.btnSeatid;
            var color: string = "";
            if (this.dataSource.seatid == BaseGameData.selfSeatid)
                color = "#ffe00d";
            else
                color = "#fff4d0";
            this._labNickname.color = color;
            // this._labLeftCards.color = color;
            this._labBomb.color = color;
            this._labScore.color = color;
            // console.warn(this._labNickname.displayWidth);
            // this._imgMaster.x = this._labNickname.x + this._labNickname.width * 0.5 - (this._labNickname.getChildAt(0) as Laya.Text).textWidth * 0.5 - 10 - this._imgMaster.width * this._imgMaster.scaleX;
        }
    }
}
