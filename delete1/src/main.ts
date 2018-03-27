// 程序入口
class GameMain {
    constructor() {
        Laya.init(1280, 720);
        console.log("Laya.init(600, 400);");
    }
}
new GameMain();
console.log("new GameMain();");

// 1   .laya 文件夹下存放的是项目在开发运行中的一些配置信息。
// 2   项目的输出目录（bin）
// 3   UI项目目录（laya）
// 4   libs/.d.ts代码提供文件目录（libs）
// 5   项目代码目录（src）