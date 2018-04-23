/*
* @author seacole
* 战绩统计List  Renderer;
*/
class MenuHistoryDetailRenderer extends ui.components.menu.MenuHistoryDetailRenderUI {
    constructor() {
        super();
    }

    public updata(): void {
        // var cfg: any = GameConfig.getGameCfgByGameType(this.dataSource.gtype);
        // if (cfg) {
            this._time.text = TimeUtils.Format("MM-dd hh:mm",this.dataSource.st)
            // this._labInfo.text = StringUtils.format(GameConfig.language.history_detail, this.dataSource.round, this.dataSource.score);
            if (this.parent){
                this.width = this.parent["width"] - 20;
                this._box.width = this.width - 200
            }
            this._box.removeChildren()
            let peace = this._box.width/this.dataSource.ss.length
            for(var k in this.dataSource.ss){
                let v = this.dataSource.ss[k]
                let view = new Laya.Box()
                view.width = peace
                let text = new Laya.Label(Utils.getFitNickName(v.n,10))
                text.color = "#9b5036"
                text.fontSize = 18
                text.centerX = 0
                // text.strokeColor = "#5c281f"
                // text.stroke = 2
                view.addChild(text)
                let score = new Laya.Label(String(v.s))
                if(v.s > 0){
                    score.font = "font_num_10"
                }else{
                    score.font = "font_num_9"
                }
                view.addChild(score)
                score.y = 47
                score.centerX = 0
                this._box.addChild(view)
                view.x = parseInt(k)*peace
            }
        // }

    }
}