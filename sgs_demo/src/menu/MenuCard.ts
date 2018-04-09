module menu {
    export class MenuCard extends Laya.Button {
        constructor(skin?: string, label?: string) {
            super(skin, label)
            this.anchorX = this.anchorY = 0.5
            this.stateNum = 2
            this.on(Laya.Event.MOUSE_DOWN, this, this.scaleSmal);
            this.on(Laya.Event.MOUSE_UP, this, this.scaleBig);
            this.on(Laya.Event.MOUSE_OUT, this, this.scaleBig);
        }
        private scaleBig(): void {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, runtime.RuntimeClickBtn.scaleTime);
        }
        private scaleSmal(): void {
            Laya.Tween.to(this, { scaleX: 0.83, scaleY: 0.83 }, runtime.RuntimeClickBtn.scaleTime);
        }
    }
}