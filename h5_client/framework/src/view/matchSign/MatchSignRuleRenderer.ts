/*
* @author seacole
* 比赛报名规则Renderer;
*/
module matchSign{
	export class MatchSignRuleRenderer extends ui.matchSign.MatchSignRuleRendererUI{
		constructor(){
			super();			
		}
	
		public updata(): void {
            if (this.dataSource) {
                this._btn.label="玩法"+this.dataSource;
            }
        }

		public set selected(value: boolean) {
			this._btn.selected = value;
		}
	}
}