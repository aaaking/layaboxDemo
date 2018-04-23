/*
 * @author seacole
 * 飞机动画
*/
module poker {
	export class EffectFeiji extends ui.poker.palneUI {
		constructor() {
			super();
			this.centerX=0;
			this.centerY=0;
		}

		private static _instance: EffectFeiji;
		public static get instance(): EffectFeiji {
			if (!this._instance)
				this._instance = new EffectFeiji();
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