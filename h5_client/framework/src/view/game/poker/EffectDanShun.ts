/*
 * @author seacole
 * 单顺动画
*/
module poker {
	export class EffectDanShun extends ui.poker.shunziUI {
		constructor() {
			super();			
		}
		private static _pool:ObjectPool;

		public static borrow(): poker.EffectDanShun {
			if (!EffectDanShun._pool)
				EffectDanShun._pool = ObjectPool.getInstance("poker.EffectDanShun", Laya.ClassUtils.getClass(poker.EffectDanShun));
			return EffectDanShun._pool.borrowObject() as poker.EffectDanShun;
		}

		public static return(effect: poker.EffectDanShun): void {
			if (EffectDanShun._pool)
				EffectDanShun._pool.returnObject(effect);
		}

		public play(scale:number):void
		{					
			this.scale(scale,scale);	
			this.ani1.play(1,false);		
			this.ani1.on(Laya.Event.COMPLETE,this,this.onComplete);	
		}

		private onComplete():void
		{
			this.ani1.off(Laya.Event.COMPLETE,this,this.onComplete);
			this.ani1.stop();
			this.removeSelf();
		}
	}
}