/*
* @author seacole;
*/
class LineRenderer extends Laya.Sprite {
    constructor() {
        super();
    }

    private _images: Array<Laya.Image>;
    private _currentFrame: number;
    private _ro: number;
    private _imgWidth: number;
    private _index: number;
    public init(effectData: EffectData): void {
        if (!this._images) {
            this._images = [];
            for (var i: number = 1; i <= 5; i++) {
                var img: Laya.Image = new Laya.Image(effectData.url + i + ".png");
                img.anchorY=0.5;
                if (effectData.blendMode)
                    img.blendMode = "lighter";
                this._images.push(img);
            }
        }
        this.setInfo(effectData.posX, effectData.posY, effectData.toPosX, effectData.toPosY);
        this._index = effectData.index;
        this.play();
        Laya.timer.once(effectData.duation, this, this.hide);
    }

    private setInfo(cX: number, cY: number, eX: number, eY: number): void {
        this.x = cX;
        this.y = cY;
        var mX: number = eX - cX;
        var mY: number = eY - cY;
        this._ro = MathUtils.radiusToAngle(Math.atan(mY / mX));
        if (mX == 0) {
            if (mY < 0)
                this._ro = 90;
            else
                this._ro = -90;
        }
        else if (mY == 0) {
            if (mX > 0)
                this._ro = 0;
            else
                this._ro = -180;
        }
        else {
            if (mX < 0 && mY > 0)
                this._ro = 180 + this._ro;
            else if (mX < 0 && mY < 0)
                this._ro = -180 + this._ro;
        }
        this._imgWidth = Math.sqrt(mX * mX + mY * mY);
    }

    private play(): void {
        this.removeChildren();
        for (var i: number = 0; i < this._images.length; i++) {
            this._images[i].visible = false;
            this._images[i].rotation = this._ro;
            this._images[i].width = this._imgWidth;
            this.addChild(this._images[i]);
        }
        this._currentFrame = 0;
        Laya.timer.frameLoop(2, this, this.onFrame);
    }

    private onFrame(): void {
        this._images[this.perFrame()].visible = false;
        this._images[this._currentFrame].visible = true;
        this._currentFrame = this.nextFrame();
    }

    private perFrame(): number {
        if (this._currentFrame > 0)
            return this._currentFrame - 1;
        else
            return this._images.length - 1;
    }

    private nextFrame(): number {
        if (this._currentFrame >= (this._images.length - 1))
            return 0;
        else
            return this._currentFrame + 1;
    }

    public get index(): number {
        return this._index;
    }

    private hide(): void {
        Laya.timer.clear(this, this.onFrame);
        Laya.timer.clear(this, this.hide);
        Dispatcher.dispatch(EventNames.REMOVE_LINE_RENDERER, [this]);
    }

}