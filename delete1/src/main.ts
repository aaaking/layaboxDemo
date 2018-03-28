// 程序入口
class GameMain {
    private txt: Laya.Text;
    private prevX: number = 0;
    private prevY: number = 0;
    //TextInput
    private mTextInput: Laya.TextInput;
    constructor() {
        Laya.init(1280, 720, Laya.WebGL);//Laya.init(Laya.Browser.clientWidth, Laya.Browser.clientHeight, Laya.WebGL);1069 522
        Laya.stage.bgColor = '#23238E';//设置舞台背景色
        Laya.stage.addChild(this.testText())
        Laya.stage.addChild(this.testTextInput())
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
        txt.pos(Laya.stage.width - txt.width >> 1, Laya.stage.height - txt.height >> 1);
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
        this.mTextInput.wordWrap = true;//设置 textInput 的文本自动换行。
        this.mTextInput.multiline = true
        this.mTextInput.fontSize = 30;//设置 textInput 的字体大小。
        this.mTextInput.pos(0, 0)
        this.mTextInput.size(300, 200)
        this.mTextInput.bgColor = "#c30c30";
        return this.mTextInput
    }
}
new GameMain();

// 1   .laya 文件夹下存放的是项目在开发运行中的一些配置信息。
// 2   项目的输出目录（bin）
// 3   UI项目目录（laya）
// 4   libs/.d.ts代码提供文件目录（libs）
// 5   项目代码目录（src）