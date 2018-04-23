/*
* @author seacole
*日历中文本Renderer;
*/
class DateLabelRenderer extends Laya.Label {
    constructor() {
        super();
        this.anchorY = 0.5;
        this.bold = true;
        this.fontSize = 30;
        this.y = 15;
        this.color = "#9b5036";
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