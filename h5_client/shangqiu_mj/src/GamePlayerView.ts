module shangqiu_mj {
    export  class GamePlayerView extends component.BasePlayer{
        constructor(p){
            super(p)
        }
        protected _imgFlower
        protected _ting
        protected _labelFlower:Laya.Label
        protected initView(p){
            this._imgFlower = new Laya.Image("table/table_buhua.png")
            this._imgFlower.pos(6,67)
            this.view._box.addChild(this._imgFlower)
            this._labelFlower = new Laya.Label()
            this._labelFlower.fontSize = 20
            this._labelFlower.color = "#ffffff"
            this._labelFlower.width = 37
            this._labelFlower.height = 20
            this._labelFlower.align = "center"
            this._labelFlower.pos(51,70)
            this.view._box.addChild(this._labelFlower)
            this._ting = new Laya.Image("card/ting_icon.png")
            this.view._box.addChild(this._ting)
            this._ting.centerX = 0
            this._ting.y = -32
            if(this._dir == 3){
                this._ting.y = 0
                this._ting.centerX = 80
            }
            this._ting.visible = false
        }

        public clear(needCheckIsGameing: boolean = true): void {
            super.clear(needCheckIsGameing)
            this._labelFlower.text = "";
            this._ting.visible = false
        }

        protected onDataChange(uid: number): void {
            super.onDataChange(uid)
            if (this._data) {
                if (this._data.uid == uid) {
                    this._labelFlower.text = this._data.flowerCout + "";
                }
            }
        }

        public showTing(){
            this._ting.visible = true
        }

        public hideTing(){
            this._ting.visible = false
        }

        public set dir(value: number) {
            this._dir = value;
            switch (this._dir) {
                case 1:
                    this.setChildPos(1, 2);
                    break;
                case 2:
                    this.setChildPos(2, 1);
                    break;

                case 3:
                    this.setChildPos(1, 2);
                    break;

                case 4:
                    this.setChildPos(1, 2);
                    break;
            }

            if (this._chatContent) {
                this._chatContent.popleft = GameDef.CHAT_POS[BaseGameData.maxPlayer - 1][this._dir - 1]
                if (this._chatRecord)
                    this._chatRecord.visible = this._chatRecordCh.visible = false;

            }
            if(this._dir == 3){
                this._ting.y = 10
                this._ting.centerX = 80
            }else{
                this._ting.centerX = 0
                this._ting.y = -32
            }
        }
    }
}