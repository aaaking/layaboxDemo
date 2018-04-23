/*
* @author seacole
* 玩家头像
*/
class HeadUI extends ui.components.head.HeadUI {
    constructor(infoType: number = 0) {
        super();
        this.data = null;
        this._labInfo.visible = infoType > 0;
    }
    private _uid: number;
    private _infoType: number;
    private _imgHead: ui.components.head.HeadImgUI;

    public static TYPE_GOLD: number = 1;
    public static TYPE_DIAMOND: number = 2;
    public static TYPE_SCORE: number = 3;
    public static TYPE_UID: number = 4;
    public WIDTH = 73
    public HEIGHT = 73
    public nameLimit = 10

    public setImageBounds(w, h) {
        this.WIDTH = w
        this.HEIGHT = h
        this._imgFemale.width = w
        this._imgFemale.height = h
        this._femaleMask.width = w
        this._femaleMask.height = h
        this._imgMale.width = w
        this._imgMale.height = h
        this._maleMask.width = w
        this._maleMask.height = h
        // this._imgHead.width = w
        // this._imgHead.height = h
        // this._headMask.width = w
        // this._headMask.height = h

    }

    // private _test: number = -1;
    private _avatar: string;
    public set data(value: any) {
        if (value) {
            this._labName.text = Utils.getFitNickName(value.nickname, this.nameLimit) + "";
            this.setLabInfoData(value);
            if (!value.hasOwnProperty("sex"))
                value.sex = 1;
            this._imgMale.visible = value.sex != 2;
            this._imgFemale.visible = value.sex == 2;

            // this._test++;
            // if (this._test % 3 == 0)
            //     value.avatar = 0;
            // else if (this._test % 3 == 1)
            //     value.avatar = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1515770253325&di=47c9309c74a192b47bde773bcf2f135c&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F500fd9f9d72a6059099ccd5a2334349b023bbae5.jpg";
            // else if (this._test % 3 == 2)
            //     value.avatar = "http://c.hiphotos.baidu.com/image/pic/item/c9fcc3cec3fdfc0380b079f3df3f8794a5c226b4.jpg";
            if (value.avatar) {
                if (this._avatar != value.avatar) {
                    this.clearImgHead();
                    this._avatar = value.avatar;

                    if (!this._imgHead) {
                        this._imgHead = new ui.components.head.HeadImgUI();
                        this.addChildAt(this._imgHead, 2);
                    }
                    this._imgHead._img.texture = null;
                    this._imgHead._img.source = null;
                    this._imgHead._img.width = this._imgHead._headMask.width = this.WIDTH;
                    this._imgHead._img.height = this._imgHead._headMask.height = this.HEIGHT;
                    this._imgHead._img.loadImage(value.avatar, 0, 0, this.WIDTH, this.HEIGHT);
                }
            }
            else {
                this.clearImgHead();
                this._avatar = "";
            }
        }
        else {
            // this.clearImgHead();
            // this._labName.text = "";
            // this._labInfo.text = "";
            // this._imgMale.visible = true;
            // this._imgFemale.visible = false;
        }
    }

    private clearImgHead(): void {
        if (this._imgHead) {
            this._imgHead._img.texture = null;
            this._imgHead._img.source = null;
            // this._imgHead.destroy();
        }
    }
    public getInfo(uid: number): void {
        if (this._uid != uid) {
            this._uid = uid;
            if (RoleManager.getRole(uid)){
                this.data = RoleManager.getRole(uid)
            }else{
                webService.getUserInfo(this._uid, (response) => {
                    if (response.code == 0)
                        this.data = response;
                });
            }
        }
    }

    public setLabName(data: any): void {
        Utils.injectProp(this._labName, data);
    }

    public setLabInfo(infoType: number = 0, data: any = null): void {
        this._infoType = infoType;
        this._labInfo.visible = true;
        if (data)
            Utils.injectProp(this._labInfo, data);
    }

    private setLabInfoData(value: any): void {
        switch (this._infoType) {
            case HeadUI.TYPE_GOLD:
                this._labInfo.text = value.gold + "";
                break;

            case HeadUI.TYPE_DIAMOND:
                this._labInfo.text = value.diamond + "";
                break;

            case HeadUI.TYPE_SCORE:
                this._labInfo.text = value.score + "";
                break;

            case HeadUI.TYPE_UID:
                this._labInfo.text = "ID: " + value.uid + "";
                break;
        }
    }

}