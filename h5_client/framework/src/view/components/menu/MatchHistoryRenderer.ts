/*
* @author seacole
* 比赛玩家列表Renderer;
*/

class MatchHistoryRenderer extends ui.matchSign.MatchSignUser3RendererUI {
    constructor() {
        super();
    }

    public updata(isLast: boolean, isFreeMatch: boolean): void {
        if (this.dataSource) {
            if (this.dataSource.hasOwnProperty("rk"))
                if (this._dataSource.rk <= 3) {
                    this._labRank.text = "";
                    this._imgRank.visible = true;
                    this._imgRank.source = Laya.loader.getRes("matchSign/matchSign_rank_" + this.dataSource.rk + ".png");
                }
                else {
                    this._labRank.text = this.dataSource.rk;
                    this._imgRank.visible = false;
                }
            else {
                this._labRank.text = "";
                this._imgRank.visible = false;
            }
            this._imgLine.visible = !isLast;
            this._labNickname.text = Utils.getFitNickName(this.dataSource.nk, 20);
            if (isFreeMatch) {
                this._labNickname.centerX = 108;
                this._imgDiamond.visible = this._labReward.visible = false;

            }
            else {
                this._labNickname.centerX = 0;
                this._labReward.text = this.dataSource.score ? this.dataSource.score : 0;
                this._imgDiamond.visible = this._labReward.visible = true;
            }
        }
    }
}
