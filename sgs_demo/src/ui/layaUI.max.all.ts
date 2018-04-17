
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.cardPackage {
    export class SellCardUI extends View {
		public _mask:Laya.Image;
		public _boxNormal:Laya.Box;
		public _btnClose:runtime.RuntimeClickBtn;
		public _btnConfirm:runtime.RuntimeClickBtn;
		public _input:Laya.TextInput;
		public _labTip:Laya.Label;
		public _imgIcon:Laya.Image;
		public _boxWaiting:Laya.Box;

        public static  uiView:any ={"type":"View","props":{"width":966,"height":458},"child":[{"type":"Image","props":{"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"left":0,"bottom":0}},{"type":"Box","props":{"var":"_boxNormal","centerY":0,"centerX":0},"child":[{"type":"Box","props":{"y":0,"x":0},"child":[{"type":"Image","props":{"y":0,"skin":"menu/img_2.png","centerX":0}},{"type":"Image","props":{"y":10,"skin":"menu/img_title_2.png","centerX":0}}]},{"type":"Button","props":{"y":41,"x":925,"var":"_btnClose","stateNum":2,"skin":"menu/btn_close.png","runtime":"runtime.RuntimeClickBtn","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":353,"x":671,"var":"_btnConfirm","stateNum":2,"skin":"menu/btn_confirm.png","runtime":"runtime.RuntimeClickBtn","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":153,"x":463,"skin":"menu/img_1.png"}},{"type":"TextInput","props":{"y":213,"x":463,"width":385,"var":"_input","text":"TextInput","skin":"menu/img_input.png","restrict":"0-9","padding":"0,10,0,10","height":58,"fontSize":26,"color":"#ffffff"}},{"type":"Label","props":{"y":286,"x":463,"var":"_labTip","text":"请输入合法金额","fontSize":16,"color":"#ff0400"}},{"type":"Image","props":{"y":100,"x":139,"var":"_imgIcon","skin":"cards/1.png"}}]},{"type":"Box","props":{"var":"_boxWaiting","centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/img_3.png","sizeGrid":"3,0,3,0"}},{"type":"Label","props":{"text":"正在交易中请等待","fontSize":30,"color":"#Ceb589","centerY":0,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("runtime.RuntimeClickBtn",runtime.RuntimeClickBtn);

            super.createChildren();
            this.createView(ui.cardPackage.SellCardUI.uiView);

        }

    }
}

module ui.cards {
    export class BaseCardListUI extends View {
		public _mask:Laya.Image;
		public _btnBack:Laya.Button;
		public _pageName:Laya.Image;
		public _list:Laya.List;
		public _tab:Laya.Tab;

        public static  uiView:any ={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Image","props":{"skin":"menu/bg.jpg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"left":0,"bottom":0}},{"type":"Button","props":{"x":0,"var":"_btnBack","stateNum":2,"skin":"menu/btn_back.png"}},{"type":"Image","props":{"x":163,"var":"_pageName","skin":"menu/logo_cards_my.png"}},{"type":"List","props":{"y":88,"x":10,"width":1142,"var":"_list","vScrollBarSkin":"comp/vscroll.png","spaceY":25,"spaceX":25,"height":570}},{"type":"Tab","props":{"y":75,"width":102,"var":"_tab","right":10}},{"type":"Image","props":{"skin":"menu/cards_bottom.png","centerX":0,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.cards.BaseCardListUI.uiView);

        }

    }
}

module ui.cards {
    export class CardUI extends View {
		public _icon:Laya.Image;
		public _star:Laya.Image;
		public _imgName:Laya.Image;
		public _mask:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":184,"height":243},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"_icon","skin":"cards/1.png"}},{"type":"Image","props":{"y":3,"x":42,"var":"_star","top":3,"skin":"star/4.png","left":42}},{"type":"Image","props":{"y":0,"x":0,"var":"_imgName","skin":"cardsname/0.png"}},{"type":"Image","props":{"y":30,"x":30,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.cards.CardUI.uiView);

        }

    }
}

module ui.loading {
    export class LoadingUI extends View {
		public _mask:Laya.Image;
		public _loadingTopLabel:Laya.Label;
		public _loadingImg:Laya.Image;
		public _loadingLabel:Laya.Label;
		public _loadingBottomLabel:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Image","props":{"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"left":0,"bottom":0}},{"type":"Box","props":{"width":400,"height":535,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"top":0,"skin":"menu/img_3.png","centerX":0,"bottom":0,"sizeGrid":"3,0,3,0"}},{"type":"Label","props":{"y":130,"x":-25,"var":"_loadingTopLabel","text":"矿工正在玩命为你挖掘新卡...","fontSize":35,"color":"#ffffff","centerY":-120,"centerX":0}},{"type":"Image","props":{"y":200,"x":200,"var":"_loadingImg","skin":"menu/loading_circle.png","centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"var":"_loadingLabel","text":"00:00","fontSize":30,"color":"#ffffff","centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":370,"x":76,"var":"_loadingBottomLabel","text":"平均用时：20秒","fontSize":35,"color":"#ffffff","centerY":120,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.loading.LoadingUI.uiView);

        }

    }
}

module ui.showcard {
    export class ShowCardUI extends View {
		public _imgBg:Laya.Image;
		public _imgIcon:Laya.Image;
		public _btnOpen:Laya.Button;
		public _labCost:Laya.Label;
		public _btnBack:Laya.Button;
		public _labTip:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":720},"child":[{"type":"Image","props":{"skin":"menu/bg_2.jpg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":20,"var":"_imgBg","skin":"menu/img_4.png","centerX":0}},{"type":"Image","props":{"y":30,"x":90,"var":"_imgIcon","skin":"cards/1.png","centerX":0}},{"type":"Button","props":{"var":"_btnOpen","stateNum":2,"skin":"menu/btn_showcard.png","labelAlign":"center","centerX":0,"bottom":30},"child":[{"type":"Label","props":{"y":41,"x":110,"width":45,"var":"_labCost","text":"32","strokeColor":"#8b2303","stroke":2,"fontSize":32,"color":"#ffffff","align":"center"}}]},{"type":"Button","props":{"x":0,"var":"_btnBack","stateNum":2,"skin":"menu/btn_back.png"}},{"type":"Label","props":{"var":"_labTip","text":"点击屏幕继续","fontSize":30,"color":"#Ceb589","centerY":280,"centerX":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.showcard.ShowCardUI.uiView);

        }

    }
}
