/*
* @author seacole
* 游戏List  Renderer;
*/
class MenuGameRenderer extends ui.components.menu.MenuGameRendererUI{
    constructor(){
        super();
    }

    public updata():void
    {
        this._imgGame.source=Laya.Loader.getRes("gamename/"+this.dataSource.gtype+".png");
        this._labName.text=Utils.getFitNickName(this.dataSource.name,10);
        this._score.text = this.dataSource.score
        this._labDesc.text=TimeUtils.timeFormat(this.dataSource.end_time);
        if (this.parent)
            this.width=this.parent["width"];
    }
}