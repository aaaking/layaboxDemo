/*
* @author seacole
* 比赛报名所需Renderer;
*/
module matchSign{
	export class MatchSignCostRenderer extends ui.matchSign.MatchSignCostRendererUI{
		constructor(){
			super();			
		}
	
		public updata(): void {
            if (this.dataSource) {
                this._btn.label=this.dataSource+"钻石";
            }
        }

		public set selected(value:boolean)
		{
			this._btn.selected=value;
		}
	}
}