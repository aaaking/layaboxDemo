/*
* @author seacole
* 战绩统计List  Renderer;
*/
class MenuHistoryScoreRenderer extends ui.components.menu.MenuHistoryScoreRendererUI {
    constructor() {
        super();
        if (GameConfig.IS_BANSHU)
            this._video.removeSelf();
        // this._video.on(Laya.Event.CLICK, this, this.click)
        // this._share.on(Laya.Event.CLICK, this, this.click)
        // this._share.mouseThrough = false
    }

    public updata(index): void {
        // var cfg: any = GameConfig.getGameCfgByGameType(this.dataSource.gtype);
        // if (cfg) {
            // if (this.dataSource.gtype == 3) {
            //     this._imgTile.skin = "menu/item_bg_0.png"
            // } else {
            //     this._imgTile.skin = "menu/item_bg_1.png"
            // }
            this._imgTile.skin = GameDef.SCORE_BG[this.dataSource.gtype]
            if (GameConfig.IS_BANSHU)
                this._imgGame.source = Laya.Loader.getRes("banshu/history_" + this.dataSource.gtype + ".png");
            else
                this._imgGame.source = Laya.Loader.getRes("menu/" + this.dataSource.gtype + ".png");
            // this._labName.text = cfg.name;
            if (this.dataSource.score >= 0) {
                this._score.text = "+" + String(this.dataSource.score)
                this._imgScore.skin = "menu/score_bg_0.png"
                this._score.font = "font_num_10"
            } else {
                this._score.text = this.dataSource.score
                this._imgScore.skin = "menu/score_bg_1.png"
                this._score.font = "font_num_9"
            }
            this._labInfo.text = TimeUtils.timeChange(this.dataSource.end_time*1000)
            // TimeUtils.Format("yyyy-MM-dd hh:mm:ss", this.dataSource.end_time)
            if (this.parent)
                this.width = this.parent["width"] - 20;

            //是比赛
            if (MatchConfig.isMatch(this.dataSource.gmode)) {
                this._imgMatch.visible = true;
                this._video.visible = false;
                this._labMatchTitle.text = this.dataSource.title;
                //有排名
                if (this.dataSource.rank > 0) {
                    this._score.text = this.dataSource.rank;
                    this._imgDi.visible = this._imgMing.visible =this._imgScore.visible = this._score.visible = true;
                    this._imgNoRank.visible = false;
                    this._imgDi.right= this._score.right+this._score.displayWidth+8;
                }
                else {
                    this._imgDi.visible = this._imgMing.visible =this._imgScore.visible = this._score.visible = false;
                    this._imgNoRank.visible = true;
                }

            }
            else {
                this._score.visible = true;
                this._labMatchTitle.text = "";
                this._imgMatch.visible = false;
                this._video.visible = true;
                this._imgNoRank.visible = false;
                this._imgScore.visible=true;
                this._imgDi.visible = this._imgMing.visible=false;
            }
        // }

    }

    protected click() {
        console.log("分享")
    }
}