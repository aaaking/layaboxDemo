/*
* @author seacole
* 比赛类型;
*/
module matchSign {
    export class MatchSignKind extends ui.matchSign.MatchKindUI {
        constructor() {
            super();

            this._btns = [];
            this._games = GameDef.currentMatchs.concat();
            // var daboluoIdx:number=this._games.indexOf(Number(GameDef.GAME_TYPE.SHISANSHUI));
            // if (daboluoIdx!=-1)
            //     this._games.splice(daboluoIdx,1);
            for (var i = 0; i < this._games.length; i++) {
                var btn: component.BaseButton = new component.BaseButton();
                btn.loadImage ("res/gameIcon/gameIcon_kind_"+this._games[i]+".png");
                btn.stateNum = 1;               
                this.addChild(btn);
                btn.centerX = 0;
                btn.y = 24 + (46 + 22) * i;
                btn.on(Laya.Event.CLICK, this, this.onTouch);
                this._btns.push(btn);

                if (i != (this._games.length - 1)) {
                    var img: Laya.Image = new Laya.Image();
                    img.source = Laya.loader.getRes("matchSign/matchSign_img_3.png");
                    img.mouseEnabled = false;
                    img.centerX = 0;
                    img.y = btn.y + 46 + 10;
                    this.addChild(img);
                }
            }
            this.height = this._bg.height = (22 + 46) * this._games.length + 40;
        }

        private _games: Array<number>;
        private _btns: Array<component.BaseButton>;

        private onTouch(e: Laya.Event): void {
            var index: number = this._btns.indexOf(e.currentTarget as component.BaseButton);
            if (index != -1) {
                MatchSignCreateCtrl.instance.show(this._games[index],GameDef.showGames[String(this._games[index])]);
                this.visible=false;
            }
        }
    }
}