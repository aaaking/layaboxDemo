/*
* @author seacole
* 连续动画;
*/
class TweenUtils {
    constructor(target: any) {
        this._target = target;
        this.clear();
    }

    private _target: any;
    private _steps: any[];
    private _isPlaying: boolean;

    public static get(target: any): TweenUtils {
        return new TweenUtils(target);
    }

    /**
     * 缓动对象的props属性到目标值。
     * @param	target 目标对象(即将更改属性值的对象)。
     * @param	props 变化的属性列表，比如
     * @param	duration 花费的时间，单位毫秒。
     * @param	ease 缓动类型，默认为匀速运动。
     * @param	complete 结束回调函数。
     * @param	delay 延迟执行时间。
     * @param	coverBefore 是否覆盖之前的缓动。
     * @param	autoRecover 是否自动回收，默认为true，缓动结束之后自动回收到对象池。
     */
    public to(props: any, duration: number, ease: Function = null, complete: Laya.Handler = null, delay: number = 0, coverBefore: boolean = false, autoRecover: boolean = true): TweenUtils {
        this._steps.push({ props, duration, ease, complete, delay, coverBefore, autoRecover });
        this.gogogo();
        return this;
    }

    public delay(delay: number): TweenUtils {
        this._steps.push({ delay });
        return this;
    }

    public set(setProps: any): TweenUtils {
        this._steps.push({ setProps });
        return this;
    }

    private gogogo(): void {
        if (!this._isPlaying) {
            if (this._steps && this._steps.length) {
                var step: any = this._steps.shift();
                if (step.hasOwnProperty("props")) {
                    this._isPlaying = true;
                    Laya.Tween.to(this._target, step.props, step.duration, step.ease, step.complete, step.delay, step.coverBefore, step.autoRecover);
                    Laya.timer.once(step.duration + step.delay, this, this.onStepComplete);
                }
                else if (step.hasOwnProperty("delay")) {
                    this._isPlaying = true;
                    Laya.timer.once(step.delay, this, this.onStepComplete);
                }
                else if (step.hasOwnProperty("setProps")) {
                    Utils.injectProp(this._target,step.setProps);
                    this.onStepComplete();
                }
            }
        }
    }

    private onStepComplete(): void {
        this._isPlaying = false;
        this.gogogo();
    }

    public clear():void
    {
        this._steps = [];
        this._isPlaying = false;
        Laya.Tween.clearTween(this._target);
    }
}