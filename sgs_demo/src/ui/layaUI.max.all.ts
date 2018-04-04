
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.cardPackage {
    export class CardPackageUI extends View {
		public _mask:Laya.Image;
		public _btnBack:Laya.Button;
		public _list:Laya.List;
		public _btnSortNormal:Laya.Button;
		public _btnSortCamp:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":1280,"height":400},"child":[{"type":"Image","props":{"y":10,"x":10,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}},{"type":"Image","props":{"skin":"menu/bg.jpg"}},{"type":"Button","props":{"y":1,"x":7,"var":"_btnBack","stateNum":1,"skin":"menu/btn_back.png"}},{"type":"Image","props":{"y":9,"x":134,"skin":"menu/img_title_1.png"}},{"type":"List","props":{"y":95,"x":10,"width":1142,"var":"_list","vScrollBarSkin":"comp/blank.png","spaceY":28,"spaceX":28,"height":545}},{"type":"Button","props":{"y":110,"x":10,"var":"_btnSortNormal","skin":"comp/button.png","scaleY":2,"scaleX":2,"right":20,"label":"全"}},{"type":"Button","props":{"y":190,"x":10,"var":"_btnSortCamp","skin":"comp/button.png","scaleY":2,"scaleX":2,"right":20,"label":"阵营"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.cardPackage.CardPackageUI.uiView);

        }

    }
}

module ui.cardPackage {
    export class SellCardUI extends View {
		public _mask:Laya.Image;
		public _boxNormal:Laya.Box;
		public _btnClose:Laya.Button;
		public _btnConfirm:Laya.Button;
		public _input:Laya.TextInput;
		public _labTip:Laya.Label;
		public _imgIcon:Laya.Image;
		public _boxWaiting:Laya.Box;

        public static  uiView:any ={"type":"View","props":{"width":1044,"height":512},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}},{"type":"Box","props":{"var":"_boxNormal","centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/img_2.png"}},{"type":"Button","props":{"y":10,"x":945,"var":"_btnClose","stateNum":1,"skin":"menu/btn_close.png"}},{"type":"Button","props":{"y":318,"x":578,"var":"_btnConfirm","stateNum":1,"skin":"menu/btn_confirm.png"}},{"type":"Image","props":{"y":153,"x":463,"skin":"menu/img_1.png"}},{"type":"TextInput","props":{"y":213,"x":463,"width":385,"var":"_input","text":"TextInput","skin":"menu/img_input.png","restrict":"0-9","padding":"0,10,0,10","height":58,"fontSize":26,"color":"#ffffff"}},{"type":"Label","props":{"y":286,"x":463,"var":"_labTip","text":"请输入金额","fontSize":16,"color":"#ff0400"}},{"type":"Image","props":{"y":28,"skin":"menu/img_title_2.png","centerX":0}},{"type":"Image","props":{"y":127,"x":139,"var":"_imgIcon","skin":"cards/1.png"}}]},{"type":"Box","props":{"var":"_boxWaiting","centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/img_3.png"}},{"type":"Label","props":{"text":"正在交易中请等待","fontSize":30,"color":"#Ceb589","centerY":0,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.cardPackage.SellCardUI.uiView);

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
		public _mask:Laya.Image;
		public _btnBack:Laya.Button;
		public _list:Laya.List;
		public _tab:Laya.Tab;

        public static  uiView:any ={"type":"View","props":{"width":1280,"visible":true,"height":720},"child":[{"type":"Image","props":{"y":20,"x":20,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}},{"type":"Image","props":{"y":0,"x":0,"skin":"menu/bg.jpg"}},{"type":"Button","props":{"y":1,"x":7,"var":"_btnBack","stateNum":1,"skin":"menu/btn_back.png"}},{"type":"Image","props":{"y":2,"x":124,"skin":"menu/img_title_4.png"}},{"type":"List","props":{"y":95,"x":0,"width":1142,"var":"_list","vScrollBarSkin":"comp/blank.png","spaceY":28,"spaceX":28,"height":545}},{"type":"Tab","props":{"y":63,"width":87,"var":"_tab","right":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.exchange.ExchangeViewUI.uiView);

        }

    }
}

module ui.scene {
    export class SceneLoginUI extends View {
		public _btnLogin:runtime.RuntimeClickBtn;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":720},"child":[{"type":"Image","props":{"skin":"login/img_bg.jpg","centerY":0,"centerX":0}},{"type":"Button","props":{"var":"_btnLogin","stateNum":1,"skin":"login/btn_guest.png","runtime":"runtime.RuntimeClickBtn","centerX":0,"bottom":100}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("runtime.RuntimeClickBtn",runtime.RuntimeClickBtn);

            super.createChildren();
            this.createView(ui.scene.SceneLoginUI.uiView);

        }

    }
}

module ui.scene {
    export class SceneMenuUI extends View {
		public _btnWarehouse:runtime.RuntimeClickBtn;
		public _btnCardPackage:runtime.RuntimeClickBtn;
		public _btnShowcard:runtime.RuntimeClickBtn;
		public _btnBankExchange:runtime.RuntimeClickBtn;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":720},"child":[{"type":"Image","props":{"y":-160,"x":-480,"skin":"login/img_bg.jpg","centerY":0,"centerX":0}},{"type":"Button","props":{"y":100,"var":"_btnWarehouse","stateNum":1,"skin":"menu/btn_2.png","runtime":"runtime.RuntimeClickBtn","centerX":-526}},{"type":"Button","props":{"y":100,"var":"_btnCardPackage","stateNum":1,"skin":"menu/btn_3.png","runtime":"runtime.RuntimeClickBtn","centerX":499}},{"type":"Button","props":{"y":200,"var":"_btnShowcard","stateNum":1,"skin":"menu/btn_1.png","runtime":"runtime.RuntimeClickBtn","centerX":-172}},{"type":"Button","props":{"y":200,"var":"_btnBankExchange","stateNum":1,"skin":"menu/btn_5.png","runtime":"runtime.RuntimeClickBtn","centerX":177}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("runtime.RuntimeClickBtn",runtime.RuntimeClickBtn);

            super.createChildren();
            this.createView(ui.scene.SceneMenuUI.uiView);

        }

    }
}

module ui.showcard {
    export class ShowCardUI extends View {
		public _mask:Laya.Image;
		public _imgBg:Laya.Image;
		public _imgIcon:Laya.Image;
		public _btnOpen:Laya.Button;
		public _labCost:Laya.Label;
		public _btnBack:Laya.Button;
		public _labTip:Laya.Label;
		public _boxWaiting:Laya.Box;
		public _wait:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":720},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"_mask","top":0,"skin":"comp/blank.png","right":0,"mouseThrough":false,"mouseEnabled":true,"left":0,"bottom":0}},{"type":"Image","props":{"skin":"menu/bg_2.jpg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":20,"var":"_imgBg","skin":"menu/img_4.png","centerX":0}},{"type":"Image","props":{"y":30,"x":90,"var":"_imgIcon","skin":"showcards/1.png","centerX":0}},{"type":"Button","props":{"var":"_btnOpen","stateNum":1,"skin":"menu/btn_showcard.png","centerX":0,"bottom":30},"child":[{"type":"Label","props":{"y":30,"x":79,"width":35,"var":"_labCost","text":"20","height":20,"fontSize":20,"color":"#ffffff","align":"center"}}]},{"type":"Button","props":{"y":20,"x":20,"var":"_btnBack","stateNum":1,"skin":"menu/btn_back.png"}},{"type":"Label","props":{"var":"_labTip","text":"点击屏幕继续","fontSize":30,"color":"#Ceb589","centerY":280,"centerX":0}},{"type":"Box","props":{"y":10,"x":10,"var":"_boxWaiting","centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/img_3.png"}},{"type":"Label","props":{"var":"_wait","text":"正在开卡中请等待","fontSize":30,"color":"#Ceb589","centerY":0,"centerX":0}}]}]};
        constructor(){ super()}
        createChildren():void {
        
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

        public static  uiView:any ={"type":"View","props":{"width":1280,"visible":true,"height":720},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"menu/bg.jpg"}},{"type":"Button","props":{"y":1,"x":7,"visible":true,"var":"_btnBack","stateNum":1,"skin":"menu/btn_back.png"}},{"type":"Image","props":{"y":9,"x":134,"skin":"menu/img_title_1.png"}},{"type":"List","props":{"y":95,"x":0,"width":1142,"var":"_list","vScrollBarSkin":"comp/vscroll.png","spaceY":28,"spaceX":28,"height":545}},{"type":"Tab","props":{"y":63,"width":87,"var":"_tab","right":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.warehouse.WarehouseUI.uiView);

        }

    }
}
