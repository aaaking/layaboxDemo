/*
* @author seacole
 * 俱乐部成员Renderer
*/
module club {
	export class ClubPlayerRenderer extends ui.club.ClubPlayerRenderUI {
		constructor() {
			super();
		}

		// {"sex":"1","avatar":"","uid":363686,"nk":"zhc134"}
		public updata(): void {
			// this._labNickname.width=1;
			this._labNickname.text = this.dataSource.nk ? this.dataSource.nk : "俱乐部成员对对对";
			this._pan.width = (this._labNickname.displayWidth > 78) ? 78 : this._labNickname.displayWidth;

			var sex: number = this.dataSource.sex ? this.dataSource.sex : 1;

			this._imgMale.visible = sex != 2;
			this._imgFemale.visible = sex == 2;
			// this.dataSource.avatar = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515770253325&di=47c9309c74a192b47bde773bcf2f135c&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F500fd9f9d72a6059099ccd5a2334349b023bbae5.jpg";
			if (this.dataSource.avatar) {
				this._imgHead.texture = null;
				this._imgHead.source = null;

				this._imgHead.loadImage(this.dataSource.avatar, 0, 0, 78, 78);
			}
			else {
				this._imgHead.texture = null;
				this._imgHead.source = null;
			}
		}
	}
}