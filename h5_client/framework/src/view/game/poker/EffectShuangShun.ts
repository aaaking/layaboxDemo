/*
 * @author seacole
 * 双顺动画
*/
module poker {
	export class EffectShuangShun extends ui.poker.lianduiUI {
		constructor() {
			super();			
		}
		private static _pool:ObjectPool;

		public static borrow(): poker.EffectShuangShun {
			if (!EffectShuangShun._pool)
				EffectShuangShun._pool = ObjectPool.getInstance("poker.EffectShuangShun", Laya.ClassUtils.getClass(poker.EffectShuangShun));
			return EffectShuangShun._pool.borrowObject() as poker.EffectShuangShun;
		}

		public static return(effect: poker.EffectShuangShun): void {
			if (EffectShuangShun._pool)
				EffectShuangShun._pool.returnObject(effect);
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