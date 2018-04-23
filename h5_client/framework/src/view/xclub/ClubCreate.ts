/*
* @author seacole
 * 俱乐部创建
*/
module club {
	export class ClubCreate extends BaseCtrl {
		constructor() {
			super();
			this["name"] = "ClubCreate";

		}

		private static _instance: ClubCreate;
		static get instance(): ClubCreate {
			if (!this._instance)
				this._instance = new ClubCreate();
			return this._instance;
		}

		protected _ui: ui.club.ClubCreateUI;

		public show(): void {
			this.showself();
		}

		public beforeShow(): void {
			if (!this._ui) {
				this._ui = new ui.club.ClubCreateUI();

				EventManager.instance.registerOnObject(this, this._ui._btnCreate, Laya.Event.CLICK, this, this.onTouch);
				EventManager.instance.registerOnObject(this, this._ui._close, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._mask, Laya.Event.CLICK, this, this.hide);
				EventManager.instance.registerOnObject(this, this._ui._input, Laya.Event.INPUT, this, this.onInputChange);
				EventManager.instance.registerOnObject(this, Dispatcher.eventDispatcher, EventNames.CLUB_CREATE_SUCC, this, this.onCreateSucc);
				

			}
			super.beforeShow();
			this.onShow();
		}

        /**
        * 开启监听，配置宽高，添加到舞台
        */
		public onShow(): void {		
			super.onShow();
			this._ui._input.text="";
			this.tweenSelf();
		}
        /**
         * 离开时调度
         */
		public afterShow(): void {
			super.afterShow();
		}

		private onInputChange(e: Laya.Event): void {
			var flag: boolean;
			while (Utils.getCharCodeLength(this._ui._input.text) > 20) {
				flag = true;
				this._ui._input.text = this._ui._input.text.substring(0, this._ui._input.text.length - 1);
			}
			if (flag)
				HintCtrl.instance.show(GameConfig.language.match_name_too_long);
		}

		private onTouch(e: Laya.Event): void {
			switch (e.currentTarget) {
				case this._ui._btnCreate:
				var str:string=this._ui._input.text;
					if (str){
						str=Utils.removeHeadAndEndSpace(str);
						if (str)
							ClubAlert.instance.show(StringUtils.format(GameConfig.language.club_create_1, str), this, this.create, str);
						else
							AlertInGameCtrl.instance.show(GameConfig.language.club_create_2,null,0,false);
					}						
					else
						AlertInGameCtrl.instance.show(GameConfig.language.club_create_2,null,0,false);
					break;
			}
		}

		private create(params:any[]): void {
			var title:string=params[0];
			ClubManager.createClub(title);	
		}

		private onCreateSucc():void{
			this.hide();
		}

	}
}