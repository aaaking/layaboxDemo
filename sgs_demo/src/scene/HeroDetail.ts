class HeroDetail extends Laya.View {
    skeleton: Laya.Skeleton
    templet: Laya.Templet
    constructor(sourceView: any, sourceX: number, sourceY: number) {
        super()
        var bg: Laya.Text = new Laya.Text()
        bg.alpha = 0.6
        bg.size(Laya.stage.width, Laya.stage.height)
        bg.bgColor = "#000000"
        bg.on(Laya.Event.CLICK, this, function () {
            console.log("bg.on(Laya.Event.CLICK,")
        })
        this.addChild(bg)
        Laya.stage.addChild(this)
        this.templet = new Laya.Templet();
        this.templet.on(Laya.Event.COMPLETE, this, this.parseComplete);
        this.templet.on(Laya.Event.ERROR, this, this.onError);
        this.templet.loadAni("res/spine/119.sk");
    }
    parseComplete() {
        var x = 300
        var y = 250
        var skeletonI: Laya.Skeleton = this.templet.buildArmature(0);
        for (var animIndex = 0; animIndex < 1; animIndex++) {
            var row: number = Math.floor(animIndex / 6)
            var column = Math.floor(animIndex % 6)
            skeletonI.pos(x * 2, y * 2);
            skeletonI.showSkinByIndex(1);
            skeletonI.play("skill2", true);
            this.addChild(skeletonI)
        }
        for (var animIndex = 0; animIndex < this.templet.getAnimationCount(); animIndex++) {
            var txtView: Laya.Text = new Laya.Text()
            var txtStr = this.templet.getAniNameByIndex(animIndex)
            txtView.text = animIndex + ":" + txtStr
            txtView.fontSize = 25
            txtView.pos(20, 15 + animIndex * 35)
            txtView.color = "#ff0000"
            txtView.on("click", this, function (txtStrP: string) {
                skeletonI.stop()
                skeletonI.play(txtStrP, true);
            }, [txtStr])
            this.addChild(txtView)
        }
        // //创建第一个动画
        // var skeleton0: Laya.Skeleton;
        // //从动画模板创建动画播放对象
        // skeleton0 = this.templet.buildArmature(0);
        // skeleton0.pos(200, 700);
        // this.addChild(skeleton0);
        // //切换动画皮肤
        // // skeleton0.showSkinByIndex(1);
        // //播放
        // skeleton0.play(0, true);
        // //创建第二个动画
        // var skeleton1: Laya.Skeleton;
        // skeleton1 = this.templet.buildArmature(0);
        // skeleton1.pos(300, 700);
        // // skeleton1.showSkinByIndex(1);
        // skeleton1.play("skill2", true);
        // Laya.stage.addChild(skeleton1);
        // this.addChild(skeleton1);

        var backBtn: Laya.Text = new Laya.Text()
        backBtn.fontSize = 30
        backBtn.text = LangMgr.back
        backBtn.bold = true
        backBtn.color = "#ff0000"
        backBtn.pos(Laya.stage.width - 180, 10)
        backBtn.on("click", this, function () { this.removeSelf() })
        this.addChild(backBtn)
    }
    onError() {
        console.log("hero detail parse error");
    }
}