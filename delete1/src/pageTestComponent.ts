module pageTestComponent {
    export class ThisScene {
        constructor() {
            var scaleBtn = new ScaleButton("res/img/chip.png", "labelStr")
            Laya.stage.addChild(scaleBtn)
        }
    }
    export class ScaleButton extends Laya.Button {
        constructor(skin: string = null, label: string = "") {
            super(skin, label)
            this.on(Laya.Event.MOUSE_DOWN, this, this.small)
            this.on(Laya.Event.MOUSE_UP, this, this.big)
            this.on(Laya.Event.MOUSE_OUT, this, this.big)
        }
        private small() {
            Laya.Tween.to(this, {scaleX: 0.8, scaleY: 0.8}, 300)
        }
        private big() {
            Laya.Tween.to(this, {scaleX: 1, scaleY: 1}, 300)
        }
    }
    // new pageTestComponent.ThisScene()
}