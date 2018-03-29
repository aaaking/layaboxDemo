
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
    export class PieUI extends View {
		public myanim:Laya.Animation;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":400},"child":[{"type":"Pie","props":{"y":0,"x":45,"startAngle":27.516875253828857,"radius":50,"lineWidth":1,"fillColor":"#ff0000","endAngle":135}},{"type":"Animation","props":{"y":119,"x":59,"var":"myanim","source":"TimeLine.ani","interval":100}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.res.PieUI.uiView);

        }

    }
}
