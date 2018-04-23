/*
 * @author seacole
 * 炸弹动画
*/
module poker {
	export class EffectBoom extends ui.poker.boomUI {
		constructor() {
			super();
			this.centerX=0;
			this.centerY=0;
		}

		private static _instance: EffectBoom;
		public static get instance(): EffectBoom {
			if (!this._instance)
				this._instance = new EffectBoom();
			return this._instance;
		}

		public show(parent:Laya.Sprite):void
		{
			if (!this.parent)
				parent.addChild(this);
			this.ani1.play(1,false);
			this.ani1.on(Laya.Event.COMPLETE,this,this.onPlayEnd);
		}

		private onPlayEnd():void
		{
			this.ani1.off(Laya.Event.COMPLETE,this,this.onPlayEnd);
			this.removeSelf();
		}

	}
}