// 程序入口
class GameMain {
    constructor() {
        Laya.init(1280, 720);
        var txt: Laya.Text = new laya.display.Text()//Laya.Text();
        txt.text = "hello layabox"
        txt.color = "#FF0000"

        txt.fontSize = 66;//设置文本字体大小，单位是像素. default fontSize is 12

        txt.stroke = 5;//设置字体描边  描边为5像素
        txt.strokeColor = "#FFFFFF";
        txt.bold = true;
        txt.pos(0, 0);//设置文本的显示起点位置X,Y
        txt.borderColor = "#23cfcf";//设置文本框的颜色

        Laya.stage.bgColor = '#23238E';//设置舞台背景色
        Laya.stage.addChild(txt)
    }
}
new GameMain();

// 1   .laya 文件夹下存放的是项目在开发运行中的一些配置信息。
// 2   项目的输出目录（bin）
// 3   UI项目目录（laya）
// 4   libs/.d.ts代码提供文件目录（libs）
// 5   项目代码目录（src）