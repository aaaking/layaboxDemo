class UITools {
    static canvasWidth = 1280
    static canvasHeight = 720
    private constructor() {
    }
    private static _instance: UITools;
    public static get instance(): UITools {
        if (!this._instance)
            this._instance = new UITools();
        return this._instance;
    }
    static changeGray(sprite: Laya.Sprite) {
        //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，灰图
        var grayscaleMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
        //创建一个颜色滤镜对象，灰图
        var grayscaleFilter: Laya.ColorFilter = new Laya.ColorFilter(grayscaleMat);
        // 灰度猩猩
        sprite.filters = [grayscaleFilter];
    }
    static resetGray(sprite: Laya.Sprite) {
        sprite.filters = null;
    }
}