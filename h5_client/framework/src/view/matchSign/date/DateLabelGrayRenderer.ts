/*
* @author seacole
*日历中文本Renderer灰色;
*/
class DateLabelGrayRenderer extends Laya.Label {
    constructor() {
        super();
        this.anchorY = 0.5;
        this.bold = true;
        this.fontSize = 30;
        this.y = 15;
        this.color = "#c89b7e";
        this.width = 100;
        this.align = "center";
        this.height = this.fontSize;
    }

    public updata(): void {
        if (this.dataSource) {
            this.text = this.dataSource;
        }
    }

}