
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.cardPackage {
    export class SellCardUI extends View {
		public _boxNormal:Laya.Box;
		public _btnClose:runtime.RuntimeClickBtn;
		public _btnConfirm:runtime.RuntimeClickBtn;
		public _input:Laya.TextInput;
		public _labTip:Laya.Label;
		public _imgIcon:Laya.Image;
		public _boxWaiting:Laya.Box;

        public static  uiView:any ={"type":"View","props":{"width":966,"height":458},"child":[{"type":"Image","props":{"top":0,"skin":"comp/blank.png","right":0,"left":0,"bottom":0}},{"type":"Box","props":{"var":"_boxNormal","centerY":0,"centerX":0},"child":[{"type":"Box","props":{"y":0,"x":0},"child":[{"type":"Image","props":{"y":0,"skin":"menu/img_2.png","centerX":0}},{"type":"Image","props":{"y":10,"skin":"menu/img_title_2.png","centerX":0}}]},{"type":"Button","props":{"y":41,"x":925,"var":"_btnClose","stateNum":2,"skin":"menu/btn_close.png","runtime":"runtime.RuntimeClickBtn","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":353,"x":671,"var":"_btnConfirm","stateNum":2,"skin":"menu/btn_confirm.png","runtime":"runtime.RuntimeClickBtn","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":153,"x":463,"skin":"menu/img_1.png"}},{"type":"TextInput","props":{"y":213,"x":463,"width":385,"var":"_input","text":"TextInput","skin":"menu/img_input.png","restrict":"0-9","padding":"0,10,0,10","height":58,"fontSize":26,"color":"#ffffff"}},{"type":"Label","props":{"y":286,"x":463,"var":"_labTip","text":"请输入金额","fontSize":16,"color":"#ff0400"}},{"type":"Image","props":{"y":127,"x":139,"var":"_imgIcon","skin":"cards/1.png"}}]},{"type":"Box","props":{"var":"_boxWaiting","centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/img_3.png"}},{"type":"Label","props":{"text":"正在交易中请等待","fontSize":30,"color":"#Ceb589","centerY":0,"centerX":0}}]}]};
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
		public _btnBack:runtime.RuntimeClickBtn;
		public _pageName:Laya.Image;
		public _list:Laya.List;
		public _tab:Laya.Tab;

        public static  uiView:any ={"type":"View","props":{"width":1280,"height":720},"child":[{"type":"Image","props":{"skin":"menu/bg.jpg","centerY":0,"centerX":0}},{"type":"Button","props":{"x":7,"var":"_btnBack","stateNum":2,"skin":"menu/btn_back.png","runtime":"runtime.RuntimeClickBtn"}},{"type":"Image","props":{"x":134,"var":"_pageName","skin":"menu/logo_cards_my.png"}},{"type":"List","props":{"y":95,"x":10,"width":1142,"var":"_list","vScrollBarSkin":"comp/vscroll.png","spaceY":25,"spaceX":25,"height":570}},{"type":"Tab","props":{"y":75,"width":102,"var":"_tab","right":10}},{"type":"Image","props":{"skin":"menu/cards_bottom.png","centerX":0,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("runtime.RuntimeClickBtn",runtime.RuntimeClickBtn);

            super.createChildren();
            this.createView(ui.cards.BaseCardListUI.uiView);

        }

    }
}

module ui.cards {
    export class CardUI extends View {
		public _icon:Laya.Image;
		public _mask:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":196,"height":274},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"_icon","skin":"cards/1.png"}},{"type":"Button","props":{"y":282,"visible":false,"stateNum":1,"skin":"menu/btn_buy.png","labelStrokeColor":"#000000","labelStroke":2,"labelSize":20,"labelPadding":"-4,0,0,-20","labelColors":"#ffffff","label":"200","centerX":0}},{"type":"Image","props":{"y":30,"x":30,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.cards.CardUI.uiView);

        }

    }
}

module ui.exchange {
    export class ExchangeViewUI extends View {
		public _btnBack:Laya.Button;
		public _list:Laya.List;
		public _tab:Laya.Tab;

        public static  uiView:any ={"type":"View","props":{"width":1280,"visible":true,"height":720},"child":[{"type":"Image","props":{"skin":"menu/bg.jpg","centerY":0,"centerX":0}},{"type":"Button","props":{"y":0,"x":7,"var":"_btnBack","stateNum":2,"skin":"menu/btn_back.png"}},{"type":"Image","props":{"y":0,"x":124,"skin":"menu/logo_cards_exchange.png"}},{"type":"List","props":{"y":95,"x":0,"width":1142,"var":"_list","vScrollBarSkin":"comp/vscroll.png","spaceY":28,"spaceX":28,"height":545}},{"type":"Tab","props":{"y":63,"width":87,"var":"_tab","right":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.exchange.ExchangeViewUI.uiView);

        }

    }
}

module ui.showcard {
    export class ShowCardUI extends View {
		public _mask:Laya.Image;
		public _imgBg:Laya.Image;
		public _imgIcon:Laya.Image;
		public _btnOpen:runtime.RuntimeClickBtn;
		public _labCost:Laya.Label;
		public _btnBack:Laya.Button;
		public _labTip:Laya.Label;
		public _boxWaiting:Laya.Box;
		public _wait:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":720},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}},{"type":"Image","props":{"skin":"menu/bg_2.jpg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":20,"var":"_imgBg","skin":"menu/img_4.png","centerX":0}},{"type":"Image","props":{"y":30,"x":90,"var":"_imgIcon","skin":"showcards/1.png","centerX":0}},{"type":"Button","props":{"var":"_btnOpen","stateNum":2,"skin":"menu/btn_showcard.png","runtime":"runtime.RuntimeClickBtn","labelAlign":"center","centerX":0,"bottom":30},"child":[{"type":"Label","props":{"y":41,"x":110,"width":45,"var":"_labCost","text":"20","strokeColor":"#8b2303","stroke":2,"fontSize":32,"color":"#ffffff","align":"center"}}]},{"type":"Button","props":{"y":20,"x":20,"var":"_btnBack","stateNum":2,"skin":"menu/btn_back.png"}},{"type":"Label","props":{"var":"_labTip","text":"点击屏幕继续","fontSize":30,"color":"#Ceb589","centerY":280,"centerX":0}},{"type":"Box","props":{"y":10,"x":10,"var":"_boxWaiting","centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/img_3.png"}},{"type":"Label","props":{"var":"_wait","text":"正在开卡中请等待...","fontSize":30,"color":"#Ceb589","centerY":0,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("runtime.RuntimeClickBtn",runtime.RuntimeClickBtn);

            super.createChildren();
            this.createView(ui.showcard.ShowCardUI.uiView);

        }

    }
}

module ui.warehouse {
    export class WarehouseUI extends View {
		public _btnBack:Laya.Button;
		public _list:Laya.List;
		public _tab:Laya.Tab;

        public static  uiView:any ={"type":"View","props":{"width":1280,"visible":true,"height":720},"child":[{"type":"Image","props":{"skin":"menu/bg.jpg","centerY":0,"centerX":0}},{"type":"Button","props":{"y":0,"x":7,"visible":true,"var":"_btnBack","stateNum":2,"skin":"menu/btn_back.png"}},{"type":"Image","props":{"y":0,"x":134,"skin":"menu/logo_cards_warehouse.png"}},{"type":"List","props":{"y":95,"x":0,"width":1142,"var":"_list","vScrollBarSkin":"comp/vscroll.png","spaceY":28,"spaceX":28,"height":545}},{"type":"Tab","props":{"y":63,"width":87,"var":"_tab","right":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.warehouse.WarehouseUI.uiView);

        }

    }
}
