/**
 * @author seacole
 * 加载菊花
 */
class LoadingCircle extends Laya.Component {
    private static _instance: LoadingCircle;
    public static get instance(): LoadingCircle {
        if (!LoadingCircle._instance)
            LoadingCircle._instance = new LoadingCircle();
        return LoadingCircle._instance;
    }

    private _c1: Laya.Image;
    private _c2: Laya.Image;
    private _c3: Laya.Image;
    private _c4: Laya.Image;
    private _c5: Laya.Image;
    private _c6: Laya.Image;
    private _c7: Laya.Image;
    private _c8: Laya.Image;

    private _tweenTime: number = 0.6;
    private _isPlaying: boolean;
    private _timeCount: number;


    private _imgs: Array<Laya.Sprite>;
    private _r: number = 60;
    public constructor() {
        super();
        var bg: Laya.Image = new Laya.Image("loading/loading_bg.png");
        bg.x = -bg.width * 0.5;
        bg.y = -bg.height * 0.5;
        this.addChild(bg);
        this._imgs = [];
        for (var i: number = 0; i < 8; i++) {
            var img: Laya.Image = new Laya.Image("loading/symbol_loading.png");
            img.x = -19.5;
            img.y = -19.5;
            var s: Laya.Sprite = new Laya.Sprite();
            s.addChild(img);
            switch (i) {
                case 0:
                    s.x = 0;
                    s.y = -this._r;
                    break;

                case 1:
                    s.x = this._r * 0.7;
                    s.y = -this._r * 0.7;
                    break;

                case 2:
                    s.x = this._r;
                    s.y = 0;
                    break;

                case 3:
                    s.x = this._r * 0.7;
                    s.y = this._r * 0.7;
                    break;

                case 4:
                    s.x = 0;
                    s.y = this._r;
                    break;

                case 5:
                    s.x = -this._r * 0.7;
                    s.y = this._r * 0.7;
                    break;

                case 6:
                    s.x = -this._r;
                    s.y = 0;
                    break;

                case 7:
                    s.x = -this._r * 0.7;
                    s.y = -this._r * 0.7;
                    break;

            }
            this._imgs.push(s);
        }
    }

    public play(): void {
         this.visible = true;
        if (this._isPlaying)
            return;       
        this._isPlaying = true;
        this._timeCount = 0;
        Laya.timer.loop(150, this, this.onTimer);
        this.onTimer(null);
    }

    private onTimer(e: Laya.Event): void {
        var s: Laya.Sprite = this._imgs[this._timeCount];
        if (!s.parent)
            this.addChild(s);
        s.alpha = 0;
        s.scaleX = 0.01;
        s.scaleY = 0.01;
        Laya.Tween.clearTween(s);
        Laya.Tween.to(s, { alpha: 1, scaleX: 0.7, scaleY: 0.7 }, this._tweenTime * 1000, Laya.Ease.cubicInOut, Laya.Handler.create(this, this.step1, [s]));
        this._timeCount++;
        if (this._timeCount >= 8)
            this._timeCount = 0;
    }

    private step1(s: Laya.Sprite): void {
        Laya.Tween.to(s, { alpha: 0, scaleX: 0.01, scaleY: 0.01 }, this._tweenTime * 1000, Laya.Ease.cubicInOut);
    }

    public stop(): void {
        this.visible = false;
        this._isPlaying = false;
        for (var i: number = 0; i < this._imgs.length; i++) {
            Laya.Tween.clearTween(this._imgs[i]);
            if (this._imgs[i].parent)
                this.removeChild(this._imgs[i]);
        }
        Laya.timer.clear(this, this.onTimer);
    }
}
