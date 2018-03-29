module test {
    import CircleUI = ui.res.CircleUI;
    import PieUI = ui.res.PieUI;
    export class GameMain {
        private txt: Laya.Text;
        private prevX: number = 0;
        private prevY: number = 0;
        //TextInput
        private mTextInput: Laya.TextInput;
        //BitmapFont
        private mFontName: string = "diyFont";
        private mBitmapFont: Laya.BitmapFont;
        private txtBitmapFont: Laya.Text
        //load Image
        //需要切换的图片资源路径
        private resChip: string = "res/img/chip.png";
        private monkey1: string = "res/img/monkey1.png";
        private monkey2: string = "res/img/monkey2.png";
        private monkeyRemote: string = "https://sfault-avatar.b0.upaiyun.com/396/794/3967943700-57332f6666c7b_big64";
        //切换状态
        private flag: boolean = false;
        private img1: Laya.Sprite;
        private cMask1: Laya.Sprite;
        private flag2: boolean = false;
        private img2: Laya.Sprite;
        //three kinds of filters滤镜
        private imgColorFilter: Laya.Sprite;
        private mCircle: CircleUI;
        private mPie: PieUI;
        constructor() {
            Laya.init(1920, 1080, Laya.WebGL);//Laya.init(Laya.Browser.clientWidth, Laya.Browser.clientHeight, Laya.WebGL);1069 522
            Laya.stage.bgColor = '#23238E';//设置舞台背景色
            Laya.stage.addChild(this.testText())
            Laya.stage.addChild(this.testTextInput())
            this.testBitmapFont()
            this.testLoadImage()
            this.testTexture()
            this.testColorFilter()
            this.onLoaded()//Laya.loader.load("res/atlas/comp.atlas", Laya.Handler.create(this, this.onLoaded));
            this.testAnimation()
        }
        private onLoaded(): void {
            this.mCircle = new CircleUI();
            this.mCircle.pos(Laya.stage.width - /*this.mCircle.width*/100, 5)
            // console.log("this.mCircle.width: " + this.mCircle.width)//this is the ui's width which is 600 instead of view's width which 100
            this.mPie = new PieUI();
            this.mPie.pos(180, 205)
            Laya.stage.addChild(this.mCircle);
            Laya.stage.addChild(this.mPie);
        }

        private testText(): Laya.Text {
            var txt: Laya.Text = new laya.display.Text()//Laya.Text();
            txt.overflow = Laya.Text.SCROLL//performance: HIDE > VISIBLE > SCROLL
            txt.text = "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，\n面向AS/JS/TS开发者提供HTML5开发技术方案！"
            txt.color = "#FF0000"
            txt.align = "center"//left center right
            txt.valign = "middle"//top middle bottom
            txt.leading = 12//vertical line space
            txt.fontSize = 30;//设置文本字体大小，单位是像素. default fontSize is 12
            txt.stroke = 5;//设置字体描边  描边为5像素
            txt.strokeColor = "#FFFFFF";
            txt.bold = true;

            txt.borderColor = "#23cfcf";//设置文本框的颜色
            txt.wordWrap = false;//automatic wrap，default false
            txt.size(400, 400);//txt.width = 400; txt.height = 400//txt.height * 2;
            //设置文本的显示起点位置X,Y // txt.x = Laya.stage.width - txt.width >> 1; // txt.y = Laya.stage.height - txt.height >> 1;
            txt.pos(Laya.stage.width - txt.width - 5, 5);
            this.txt = txt
            this.txt.on(Laya.Event.MOUSE_DOWN, this, this.startScrollText);
            return txt;
        }
        private startScrollText(): void {
            this.prevX = this.txt.mouseX;
            this.prevY = this.txt.mouseY;
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.scrollText);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.finishScrollText);
        }
        /* 鼠标滚动文本 */
        private scrollText(): void {
            var nowX: number = this.txt.mouseX;//以自己为参照物，文字的左上角为0，而不是stage的位置
            var nowY: number = this.txt.mouseY;
            this.txt.scrollX += this.prevX - nowX;
            this.txt.scrollY += this.prevY - nowY;
            this.prevX = nowX;
            this.prevY = nowY;
        }
        private finishScrollText(): void {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.scrollText);
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.finishScrollText);
        }

        private testTextInput(): Laya.TextInput {
            this.mTextInput = new Laya.TextInput();//创建一个 TextInput 类的实例对象 textInput 。
            this.mTextInput.prompt = "请输入文字"
            this.mTextInput.wordWrap = true;//设置 textInput 的文本自动换行。
            this.mTextInput.multiline = true
            this.mTextInput.fontSize = 30;//设置 textInput 的字体大小。
            this.mTextInput.pos(0, 0)
            this.mTextInput.size(300, 100)
            this.mTextInput.bgColor = "#c30c30";
            return this.mTextInput
        }

        private testBitmapFont(): Laya.BitmapFont {
            this.mBitmapFont = new Laya.BitmapFont()
            this.mBitmapFont.loadFont("res/bitmapFont/testFont.fnt", new Laya.Handler(this, this.afterLoadBitmapFont));
            return this.mBitmapFont
        }
        private afterLoadBitmapFont(): void {
            this.mBitmapFont.setSpaceWidth(10);//如果位图字体中，没放空格，最好设置一个空格宽度
            Laya.Text.registerBitmapFont(this.mFontName, this.mBitmapFont);
            this.txtBitmapFont = new Laya.Text();
            this.txtBitmapFont.text = "这是layabox测试文件\nabcdefghi\n哈嘻嘿";
            // this.txt.size(250, txt.height)//txt.height=36
            this.txtBitmapFont.width = 250;//txt.height=96，这跟上面的height不一样，好奇葩
            this.txtBitmapFont.pos(10, this.mTextInput.height + 5)
            this.txtBitmapFont.wordWrap = true;
            this.txtBitmapFont.align = "center";
            this.txtBitmapFont.bgColor = "#c30c30"
            this.txtBitmapFont.font = this.mFontName;//使用我们注册的字体
            this.txtBitmapFont.fontSize = 20;
            Laya.stage.addChild(this.txtBitmapFont);
        }

        private testLoadImage(): void {
            this.img1 = new Laya.Sprite();
            this.switchImg();//显示绘制的图片
            this.img1.on("click", this, this.switchImg);//侦听switchImg中图片区域的点击事件，触发后执行switchImg切换图片
            this.cMask1 = new Laya.Sprite();//创建遮罩对象
            this.cMask1.graphics.drawCircle(55, 55, 50, "#000000");//画一个圆形的遮罩区域
            this.cMask1.pos(0, 0);//圆形所在的位置坐标
            this.img1.mask = this.cMask1;//实现img显示对象的遮罩效果,LayaAir的遮罩，可以设置一个对象(支持位图和矢量图)，然后根据对象形状进行遮罩显示。
            Laya.stage.addChild(this.img1);
        }
        private afterLoadImage() {
        }
        private switchImg(): void {
            this.img1.graphics.clear();//清空图片
            var imgUrl: string = (this.flag = !this.flag) ? this.monkey1 : this.monkeyRemote;//获得要切换的图片资源路径
            this.img1.loadImage(imgUrl, 5, 5, 100, 100, new Laya.Handler(this, this.afterLoadImage, null, true));
        }

        private testTexture() {
            //laya.display.Graphics，可以找到drawTexture()方法，
            //laya.net.LoaderManager中的load()方法和getRes()方法，
            //以及laya.utils.Handler中的create()方法
            Laya.loader.load([this.monkey1, this.monkey2], Laya.Handler.create(this, this.loadComplete, null, true), Laya.Handler.create(this, this.loadProgress, null, false));//cannot load remote img url
        }
        private loadComplete(pro: number): void {
            this.img2 = new Laya.Sprite();
            this.img2.pos(5, this.img1.y + this.img1.height + 5)
            this.switchImg2();
            this.img2.on(Laya.Event.CLICK, this, this.switchImg2);
            Laya.stage.addChild(this.img2);//添加到舞台
            // console.log("loadComplete: " + pro)//loadComplete: true
        }
        private switchImg2(): void {
            this.img2.graphics.clear();//清空绘制
            var imgUrl: string = (this.flag2 = !this.flag2) ? this.monkey1 : this.monkey2;//获得要切换的图片资源路径
            var texture: Laya.Texture = Laya.loader.getRes(imgUrl);//获取图片资源
            this.img2.graphics.drawTexture(texture, 5, 5, 0, 0, null, 1);//绘制纹理
            this.img2.size(texture.width, texture.height);//设置纹理宽高 this must be written or click event may not work
        }
        private loadProgress(pro: number) {
            // console.log("loadProgress: " + pro)//loadProgress: 0.5 loadProgress: 1
        }

        //LayaAir引擎提供了颜色滤镜、发光（或阴影）滤镜、模糊滤镜三种效果。其中颜色滤镜支持Canvas与WebGL模式，而发光滤镜与模糊滤镜由于对性能的消耗较大，因此仅支持WebGL模式。
        private testColorFilter() {
            this.imgColorFilter = new Laya.Sprite();
            this.imgColorFilter.loadImage(this.monkeyRemote);
            //颜色滤镜矩阵,灰色
            var colorMatrix: any =
                [
                    0.3086, 0.6094, 0.0820, 0, 0,  //R
                    0.3086, 0.6094, 0.0820, 0, 0, //G
                    0.3086, 0.6094, 0.0820, 0, 0,  //B
                    0, 0, 0, 1, 0, //A
                ];
            //颜色滤镜矩阵，红色
            // var colorMatrix: any =
            //     [
            //         1, 0, 0, 0, 0, //R
            //         0, 0, 0, 0, 0, //G
            //         0, 0, 0, 0, 0, //B
            //         0, 0, 0, 1, 0, //A
            //     ];
            var GrayFilter: Laya.ColorFilter = new Laya.ColorFilter(colorMatrix);//创建灰色颜色滤镜
            this.imgColorFilter.filters = [GrayFilter]
            this.imgColorFilter.pos(95, 205)
            Laya.stage.addChild(this.imgColorFilter);
            //normal remote img
            var normalImg = new Laya.Sprite();
            normalImg.loadImage(this.monkeyRemote)
            normalImg.pos(5, 205)
            //glow filter
            var glowImg = new Laya.Sprite()
            glowImg.loadImage(this.monkeyRemote, 20, 295, 100, 100)
            var glowFilter: Laya.GlowFilter = new Laya.GlowFilter("#ff0000", 15, 0, 0)
            glowImg.filters = [glowFilter]
            //shadow filter
            var shadowImg = new Laya.Sprite()
            shadowImg.loadImage(this.monkeyRemote, 140, 295, 100, 100)
            var shadowFilter: Laya.GlowFilter = new Laya.GlowFilter("#000000", 8, 4, -4)
            shadowImg.filters = [shadowFilter]
            //blurFilter
            var beforeBlurImg = new Laya.Sprite()
            beforeBlurImg.loadImage(this.resChip, 10, 405, 100, 100)
            var blurImg = new Laya.Sprite()
            blurImg.loadImage(this.resChip, 115, 405, 100, 100)
            var blurFilter: Laya.BlurFilter = new Laya.BlurFilter();
            blurFilter.strength = 25;//设置模糊强度
            blurImg.filters = [blurFilter]
            Laya.stage.addChild(normalImg);
            Laya.stage.addChild(glowImg);
            Laya.stage.addChild(shadowImg);
            Laya.stage.addChild(beforeBlurImg);
            Laya.stage.addChild(blurImg);
        }
        //test animation
        private numAnim: Laya.Animation
        private testAnimation() {
            this.numAnim = new Laya.Animation()
            this.numAnim.pos(500, 500)
            this.numAnim.loadAtlas("res/atlas/number.atlas", Laya.Handler.create(this, this.animLoaded), "load")
        }
        private animLoaded() {
            Laya.stage.addChild(this.numAnim);
            // this.numAnim.play()
            // Laya.Animation.createFrames(["number/4.png", "number/5.png"], "ha");
            // this.numAnim.play(0, true, "ha");
            this.numAnim.loadImages(["number/4.png", "number/5.png"]).play()
        }
        private aniUrls(aniName: string, length: number): any {
            var urls: any = [];
            for (var i: number = 0; i < length; i++) {
                urls.push("number/" + aniName + i + ".png");
            }
            return urls;
        }
    }
}
new test.GameMain();

// 1   .laya 文件夹下存放的是项目在开发运行中的一些配置信息。
// 2   项目的输出目录（bin）
// 3   UI项目目录（laya）
// 4   libs/.d.ts代码提供文件目录（libs）
// 5   项目代码目录（src）