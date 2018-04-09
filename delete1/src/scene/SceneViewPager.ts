class RoleInfo {
    name: string;
    cost: number;
    skin: string;
    constructor(name: string, cost: number, skin: string) {
        this.name = name;
        this.cost = cost;
        this.skin = skin;
    }
}

class Item extends Laya.Box {
    role: Laya.Image;
    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
        this.graphics.drawRect(0, 0, this.width, this.height, null);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.role = new Laya.Image();
        this.role.width = 532;
        this.role.height = 565;
        this.role.scale(0.4, 0.4);
        this.role.anchorX = 0.5;
        this.role.anchorY = 0.5;
        this.role.pos(this.width / 2, this.height / 2);
        this.addChild(this.role);
    }
}

class SceneViewPager extends Laya.View {
    private scrollView: ScrollView;
    private roleInfos: Array<RoleInfo>;
    private roleInfosHas: Array<RoleInfo>;//roles that I have
    private _mouseX: number = 0;
    // 商店角色图缩放大小。
    private itemMaxScale: number = 0.7;
    private itemMinScale: number = 0.4;
    // ScrollView操作 
    // 鼠标按下
    private _mouseDown: boolean = false;
    // 鼠标移动速度
    private _mouseSpeed: number = 0;
    private _mouseStartPosX: number = 0;
    private _curMoveFrame: number = 0;

    constructor() {
        super()
        var bg: Laya.Text = new Laya.Text()
        bg.alpha = 0.6
        bg.size(Laya.stage.width, Laya.stage.height)
        bg.bgColor = "#000000"
        this.addChild(bg)
        var backBtn: Laya.Text = new Laya.Text()
        backBtn.fontSize = 30
        backBtn.text = "Back"
        backBtn.bold = true
        backBtn.color = "#ff0000"
        backBtn.pos(Laya.stage.width - 180, 10)
        backBtn.on("click", this, function () { this.removeSelf() })
        this.addChild(backBtn)
        Laya.stage.addChild(this)
        this.initRoles()
        Laya.timer.frameLoop(1, this, this.onUpdate);
        this.setScrollView();
    }
    private onUpdate() {
        if (!this.visible) {
            return;
        }
        if (!this._mouseDown && this._mouseSpeed != 0) {
            var direction = Math.abs(this._mouseSpeed) / this._mouseSpeed;
            var absSpeed = Math.sqrt(Math.abs(this._mouseSpeed));
            var moveDis = this._mouseSpeed;
            this.updateScrollViewPos(moveDis);
            this.updateScale();
            absSpeed = absSpeed - 0.3;
            if (absSpeed < 1) {
                absSpeed = 0;
                this._mouseSpeed = 0;
                this.centeringControl();// 居中显示 
            } else {
                this._mouseSpeed = absSpeed * absSpeed * direction;
            }
        }
    }
    private setScrollView() {
        this.scrollView = new ScrollView();
        this.addChild(this.scrollView);
        this.initScrollView();
        var array = [];
        for (var i = 0; i < this.roleInfos.length; i++) {
            var roleInfo: RoleInfo = this.roleInfos[i];
            array.push({ role: { skin: roleInfo.skin } });
        }
        this.scrollView.array = array;
        this.scrollView.renderHandler = new Laya.Handler(this, this.onScrollRender);
        this.scrollView.mouseHandler = new Laya.Handler(this, this.onScrollMouse);
    }
    private initScrollView() {
        this.scrollView.leftAlign = 210;
        this.scrollView.rightAlign = 210;
        this.scrollView.space = 50;
        this.scrollView.cellWidth = 300;
        this.scrollView.cellHeight = 300;
        this.scrollView.itemRender = Item;
        this.scrollView.height = 1280;
        this.scrollView.anchorY = 0.5;
        this.scrollView.pos(0, 600);
    }
    private onScrollRender(cell: Laya.Box, index: number) {
        if (index > this.roleInfos.length) {
            return;
        }
        var item: Item = cell as Item;
        var data: any = this.scrollView.array[index];
        var roleImg: Laya.Image = item.role;
        var skinStr: string = data.role.skin;
        roleImg.skin = skinStr;
        if (!this.getHadRole(index)) {// 设置灰色角色
            this.grayingRole(roleImg);
        }
    }
    private onScrollMouse(e: Event) {
        // 移动ScrollView时其中单元格缩放
        if (e.type == Laya.Event.MOUSE_DOWN) {
            this.mouseDown();
        } else if (e.type == Laya.Event.MOUSE_UP) {
            this.mouseUp();
        } else if (e.type == Laya.Event.MOUSE_MOVE) {
            this.mouseMove();
        }
    }
    private mouseDown() {
        if (this._mouseDown) {
            console.error("mouse had down");
        }
        this._mouseDown = true;
        this._mouseStartPosX = Laya.MouseManager.instance.mouseX;
        this._mouseX = Laya.MouseManager.instance.mouseX;
    }
    private mouseUp() {
        if (!this._mouseDown) {
            return;
        }
        var stableFrame = Laya.timer.currFrame - this._curMoveFrame;
        // 滑动
        if (stableFrame > 2) {
            this._mouseSpeed = 0;
            this.centeringControl();
        }
        this._mouseDown = false;
    }
    private mouseMove() {
        if (this._mouseDown) {
            var dis = Laya.MouseManager.instance.mouseX - this._mouseX;
            this._mouseX = Laya.MouseManager.instance.mouseX;
            this.updateScrollViewPos(dis);
            this.updateScale();
            this._curMoveFrame = Laya.timer.currFrame;
            this._mouseSpeed = dis;
        }
    }
    private updateScale() {
        var centerIndex = this.getScreenCenterCellIndex();
        var leftIndex = Math.max(centerIndex - 1, 0);
        var rightIndex = Math.min(centerIndex + 1, this.scrollView.array.length - 1);
        var scrollPosX = this.scrollView.x;
        var centerPos = Laya.stage.width / 2 - scrollPosX;
        for (var index = leftIndex; index <= rightIndex; index++) {
            let cellPos = this.scrollView.getCellPosByIndex(index);
            let cellDis = Math.abs(cellPos - centerPos);
            if (cellDis < 180) {
                let scaleRate = this.itemMaxScale - (this.itemMaxScale - this.itemMinScale) / 180 * cellDis;
                let item: Item = this.scrollView.getItemByIndex(index) as Item;
                item.role.scale(scaleRate, scaleRate);
            } else {
                let item: Item = this.scrollView.getItemByIndex(index) as Item;
                item.role.scale(0.4, 0.4)
            }
        }
    }
    private updateScrollViewPos(dis: number) {
        var posX: number = dis + this.scrollView.x;
        if (posX > 0) {
            posX = 0;
        }
        if (posX < -this.scrollView.width + Laya.stage.width) {
            posX = -this.scrollView.width + Laya.stage.width;
        }
        this.scrollView.pos(posX, this.scrollView.y);
    }
    private centeringControl() {
        var centerIndex = this.getScreenCenterCellIndex()
        var cellPosX = this.getCellPosByIndex(centerIndex);
        var posX = Laya.stage.width / 2 - cellPosX;
        Laya.Tween.to(this.scrollView, { x: posX }, 500, Laya.Ease.cubicOut).update = new Laya.Handler(this, this.updateScale);
        // this.showRolePrice();
    }
    public getScreenCenterCellIndex(): number {
        var distance = -this.scrollView.x;
        var index: number = (distance - this.scrollView.leftAlign + this.scrollView.space + (Laya.stage.width + this.scrollView.cellWidth) / 2) / (this.scrollView.cellWidth + this.scrollView.space);
        return Math.round(index) - 1;
    }
    public getCellPosByIndex(index: number): number {
        return this.scrollView.leftAlign + (index + 0.5) * this.scrollView.cellWidth + index * this.scrollView.space;
    }
    private grayingRole(roleImg: Laya.Image): void {
        //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，灰图
        var grayscaleMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
        //创建一个颜色滤镜对象，灰图
        var grayscaleFilter: Laya.ColorFilter = new Laya.ColorFilter(grayscaleMat);
        // 灰度猩猩
        roleImg.filters = [grayscaleFilter];
    }
    private getHadRole(index: number) {
        var centerRoleName = this.roleInfos[index].name;
        for (var i = 0; i < this.roleInfosHas.length; i++) {
            if (this.roleInfosHas[i].name == centerRoleName) {
                return true;
            }
        }
        return false;
    }
    private initRoles() {
        this.roleInfos = new Array<RoleInfo>()
        this.roleInfosHas = new Array<RoleInfo>()
        for (var i = 0; i < 100; i++) {
            var role: RoleInfo = new RoleInfo("name:" + i, 100000 + i, "res/img/guanyu.png")
            this.roleInfos.push(role)
            if (i % 2 == 0) {
                this.roleInfosHas.push(role)
            }
        }
    }
}