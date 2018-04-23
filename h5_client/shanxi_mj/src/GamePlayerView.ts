module shanxi_mj {
    export  class GamePlayerView extends component.BasePlayer{
        constructor(p){
            super(p)
        }
        protected _imgPao
  
        protected initView(p){
            this._imgPao = new Laya.Image("table/table_buhua.png")
            this._imgPao.pos(57,60)
            this.view._box.addChild(this._imgPao)
            
        }

        public clear(needCheckIsGameing: boolean = true): void {
            super.clear(needCheckIsGameing)
          
            
        }

        protected setChildPos(master: number, ready: number): void {
            super.setChildPos(master,ready)
            if(ready == 1){
                this._imgPao.x = -16
            }else{
                this._imgPao.x = 57
            }
        }  

        protected onDataChange(uid: number): void {
            super.onDataChange(uid)
            this._imgPao.visible = BaseGameData.isGameing;
            if (this._data) {
                if (this._data.uid == uid) {
                     this._imgPao.skin = "card/tag_" + this._data.pao + ".png"
                }
            }
        }
    }
}