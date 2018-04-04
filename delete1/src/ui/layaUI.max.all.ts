
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.res {
    export class CircleUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"Circle","props":{"y":50,"x":50,"radius":50,"lineWidth":1,"fillColor":"#ff0000"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.res.CircleUI.uiView);

        }

    }
}

module ui.res {
    export class EffectAnimDemoUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"ComboBox","props":{"y":185,"x":258,"skin":"comp/combobox.png","labels":"label1,label2","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Script","props":{"playEvent":"mousedown","runtime":"ui.scaleUI"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("EffectAnimation",laya.display.EffectAnimation);
			View.regComponent("ui.scaleUI",ui.scaleUI);

            super.createChildren();
            this.createView(ui.res.EffectAnimDemoUI.uiView);

        }

    }
}

module ui.res {
    export class PieUI extends View {
		public myanim:Laya.Animation;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"Pie","props":{"y":0,"x":45,"startAngle":27.516875253828857,"radius":50,"lineWidth":1,"fillColor":"#ff0000","endAngle":135}},{"type":"Animation","props":{"y":139,"x":105,"width":0,"var":"myanim","source":"TimeLine.ani","interval":100,"height":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.res.PieUI.uiView);

        }

    }
}

module ui {
    export class scaleUI extends laya.display.EffectAnimation {
		public ani1:Laya.FrameAnimation;

        public static  uiView:any ={"type":"View","props":{},"child":[{"type":"Image","props":{"x":1,"skin":"res/img/chip.png","scaleY":0.2,"scaleX":0.2},"compId":2}],"animations":[{"nodes":[{"target":2,"keyframes":{"x":[{"value":1,"tweenMethod":"linearNone","tween":true,"target":2,"key":"x","index":0}],"scaleY":[{"value":0.2,"tweenMethod":"linearNone","tween":true,"target":2,"key":"scaleY","index":0},{"value":0.5,"tweenMethod":"linearNone","tween":true,"target":2,"key":"scaleY","index":5},{"value":1,"tweenMethod":"linearNone","tween":true,"target":2,"key":"scaleY","index":10}],"scaleX":[{"value":0.2,"tweenMethod":"linearNone","tween":true,"target":2,"key":"scaleX","index":0},{"value":0.5,"tweenMethod":"linearNone","tween":true,"target":2,"key":"scaleX","index":5},{"value":1,"tweenMethod":"linearNone","tween":true,"target":2,"key":"scaleX","index":10}]}}],"name":"ani1","id":1,"frameRate":24,"action":0}]};
        constructor(){ super();this.effectData =ui.scaleUI.uiView;}
    }
}
