module test {
    import CircleUI = ui.res.CircleUI;
    import PieUI = ui.res.PieUI;
    import EffectAnimUI = ui.res.EffectAnimDemoUI;
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
            // this.onLoaded()//Laya.loader.load("res/atlas/comp.atlas", Laya.Handler.create(this, this.onLoaded));
            this.testTweenAndEase()
            Laya.loader.load("res/atlas/comp.atlas", new Laya.Handler(this, function () {
                this.onLoaded()
                this.testAnimation()
                var anim1 = new Laya.Animation()
                anim1.loadAnimation("TimeLine.ani")
                anim1.pos(400, 130)
                Laya.stage.addChild(anim1)
                anim1.play(0)

                var anim2 = new Laya.Animation()
                anim2.loadAnimation("TimeLine.ani")
                anim2.pos(400, 260)
                Laya.stage.addChild(anim2)
                anim2.play(0, true, "ani2")
                //test spine
                var skeleton: Laya.Skeleton = new Laya.Skeleton();
                Laya.stage.addChild(skeleton);
                skeleton.pos(800, 1000);
                skeleton.scale(0.4, 0.4)
                skeleton.load("res/spine/raptor.sk", new Laya.Handler(this, function () { }));//通过加载直接创建动画
                //effect animation demo
                var effectAnimUI = new EffectAnimUI()
                effectAnimUI.pos(300, 300)
                Laya.stage.addChild(effectAnimUI)
            }))
            this.testHttpRequest()
            this.testWebcocket()
            this.testByte()
            this.testJsonp()
        }
        private onLoaded(): void {
            this.mCircle = new CircleUI();
            this.mCircle.pos(Laya.stage.width - /*this.mCircle.width*/100, 5)
            // console.log("this.mCircle.width: " + this.mCircle.width)//this is the ui's width which is 600 instead of view's width which 100
            this.mPie = new PieUI();
            this.mPie.pos(180, 205)
            this.mPie.myanim.play()
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
        private loadComplete(pro: any, pro2: any, pro3: any, pro4: any): void {
            this.img2 = new Laya.Sprite();
            this.img2.pos(5, this.img1.y + this.img1.height + 5)
            this.switchImg2();
            this.img2.on(Laya.Event.CLICK, this, this.switchImg2);
            Laya.stage.addChild(this.img2);//添加到舞台
            // console.log("loadComplete: " + pro + "  loadComplete:2 " + pro2 + "  loadComplete:3 " + pro3 + "  loadComplete:4 " + pro4)//loadComplete: true undefined
        }
        private switchImg2(): void {
            this.img2.graphics.clear();//清空绘制
            var imgUrl: string = (this.flag2 = !this.flag2) ? this.monkey1 : this.monkey2;//获得要切换的图片资源路径
            var texture: Laya.Texture = Laya.loader.getRes(imgUrl);//获取图片资源
            this.img2.graphics.drawTexture(texture, 5, 5, 0, 0, null, 1);//绘制纹理
            this.img2.size(texture.width, texture.height);//设置纹理宽高 this must be written or click event may not work
        }
        private loadProgress(pro: any, pro2: any, pro3: any, pro4: any) {
            // console.log("loadProgress: " + pro + "  loadComplete:2 " + pro2 + "  loadComplete:3 " + pro3 + "  loadComplete:4 " + pro4)//loadProgress: 0.5 loadProgress: 1
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
            this.numAnim.pos(Laya.stage.width - 75, 25)
            this.numAnim.loadAtlas("res/atlas/number.atlas", Laya.Handler.create(this, this.afterLoadAtlas), "load")// "res/atlas/number.json"也行
        }
        private afterLoadAtlas() {
            Laya.stage.addChild(this.numAnim);
            // this.numAnim.play()
            // Laya.Animation.createFrames(["number/4.png", "number/5.png"], "ha");
            // this.numAnim.play(0, true, "ha");
            this.numAnim.loadImages(["number/4.png", "number/5.png"]).play()
        }

        //test tween and ease
        private testTweenAndEase() {
            var w: number = 800;//"LayaBox字符串总宽度"
            var offsetX: number = Laya.stage.width - w >> 1;//文本创建的起始位置(>>在此使用右移运算符，相当于/2 用>>效率更高)
            var demoString: string = "LayaBox";
            var letterText: Laya.Text;
            //根据"LayaBox"字符串长度创建单个字符，并对每个单独字符使用缓动动画
            for (var i: number = 0, len: number = demoString.length; i < len; ++i) {
                letterText = this.createLetter(demoString.charAt(i));
                letterText.x = w / len * i + offsetX;
                // letterText.y = 110;//文本的初始y属性
                // //对象letterText属性y从缓动目标的10向初始的y属性110运动，每次执行缓动效果需要3000毫秒，缓类型采用elasticOut函数方式，延迟间隔i*100毫秒执行。
                // Laya.Tween.from(letterText, { y: 10 }, 3000, Laya.Ease.elasticOut, null, i * 1000);
                letterText.y = -110;//文本的初始y属性
                //对象letterText属性y从始的y属性-110向缓动目标的10向初运动，每次执行缓动效果需要3000毫秒，缓类型采用elasticOut函数方式，延迟间隔i*100毫秒执行。
                Laya.Tween.to(letterText, { y: 10, update: new Laya.Handler(this, function (p: any) { /*do something*/ }, [letterText]) }, 1000, Laya.Ease.elasticOut, Laya.Handler.create(this, function (p: Laya.Text) { p.color = "#ff0000" }, [letterText]), i * 100);
            }
        }
        //创建单个字符文本，并加载到舞台
        private createLetter(char: string): Laya.Text {
            var letter: Laya.Text = new Laya.Text();
            letter.text = char;
            letter.color = "#ffffff";
            letter.font = "Impact";
            letter.fontSize = 100;
            Laya.stage.addChild(letter);
            return letter;
        }
        // test httprequest
        private testHttpRequest() {
            var xhr: Laya.HttpRequest = new Laya.HttpRequest()
            xhr.http.timeout = 10000;//设置超时时间；
            xhr.once(Laya.Event.COMPLETE, this, this.completeHandler);
            xhr.once(Laya.Event.ERROR, this, this.errorHandler);
            xhr.on(Laya.Event.PROGRESS, this, this.processHandler);
            //free weather: https://www.sojson.com/blog/234.html
            //知乎的「知」字，可以知道它的 unicode 为 0x77e5，
            //encodeURI对它进行 UTF-8 编码，变成了三个字节：0xe7, 0x9f, 0xa5因此，encodeURI 得到的结果则是 「%E7%9F%A5」
            //如果是使用 escape 编码「知」,得到的结果就是 「%u77E5」；
            var city = "city=%E5%8C%97%E4%BA%AC"//java code: String city = java.net.URLEncoder.encode("北京", "utf-8");
            var jsonpCallback = "&jsonp=jsonpCallbackFunction"
            xhr.send("https://www.sojson.com/open/api/weather/json.shtml?" + city + jsonpCallback, "", "get", "text");
        }
        private processHandler(data: any): void {
            console.log("processHandler: " + data);
        }
        private errorHandler(data: any): void {
            console.log("errorHandler: " + data);
        }
        private completeHandler(e: any): void {
            console.log("completeHandler: " + e);
        }
        private jsonpCallbackFunction(data1: any, data2: any) {
            console.log("jsonpCallbackFunction data1: " + data1 + "  \ndata2:" + data2);
        }
        //test websocket, websocketServer.js is in ../websocketServer/websocketServer.js
        private socket: Laya.Socket;
        private byte: Laya.Byte;
        private testWebcocket() {
            this.byte = new Laya.Byte();
            this.byte.endian = Laya.Byte.LITTLE_ENDIAN;//这里我们采用小端
            this.socket = new Laya.Socket();
            this.socket.endian = Laya.Byte.LITTLE_ENDIAN;//这里我们采用小端
            //建立连接
            // this.socket.connectByUrl("ws://localhost:8000");
            this.socket.connect("localhost", 8000)
            this.socket.on(Laya.Event.OPEN, this, this.openHandler);//open
            this.socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);//message
            this.socket.on(Laya.Event.CLOSE, this, this.closeHandler);//close
            this.socket.on(Laya.Event.ERROR, this, this.errorHandlerWebsocket);//error
        }
        private openHandler(event: any = null): void {//正确建立连接；
            console.log("websocket openHandler " + event)
            this.byte.writeByte(1);//写入一个字节0-255
            this.byte.writeInt16(20);//写入一个int16的数据
            this.byte.writeFloat32(20.5);//写入一个32位的浮点数据
            this.byte.writeUTFString("hello");// 写入一个字符串；
            var by: Laya.Byte = new Laya.Byte();//这里声明一个临时Byte类型
            by.endian = Laya.Byte.LITTLE_ENDIAN;//设置endian；
            by.writeInt32(5000);//写入一个int32数据
            by.writeUint16(16);//写入一个uint16 数据
            this.byte.writeArrayBuffer(by.buffer);//把临时字节数据的数据写入byte中，这里注意写入的是by.buffer;
            this.socket.send(this.byte.buffer);//这里是把字节数组的数据通过socket发送给服务器。
            this.byte.clear();//清除掉数据;方便下次读写；
        }
        private receiveHandler(msg: any = null): void {///接收到数据触发函数
            console.log("websocket receiveHandler " + msg)
            //.............这里我们假设收到的是二进制ArrayBuffer
            this.byte.clear();
            this.byte.writeArrayBuffer(msg);//把接收到的二进制数据读进byte数组便于解析。
            this.byte.pos = 0;//设置偏移指针；
            ////下面开始读取数据，按照服务器传递过来的数据，按照顺序读取
            var a: number = this.byte.getByte();
            var b: number = this.byte.getInt16();
            var c: number = this.byte.getFloat32();
            var d: string = this.byte.getString();
            var e: string = this.byte.getUTFString();
        }
        private closeHandler(e: any = null): void {//关闭事件
            console.log("websocket closeHandler " + e)
        }
        private errorHandlerWebsocket(e: any = null): void {//连接出错
            console.log("websocket errorHandlerWebsocket " + e)
        }

        //test Byte
        private testByte() {
            //有三种方法可以实例化一个Byte，根据参数的不同创建二进制数据。
            //实例化一个二进制数组Byte
            var byte: Laya.Byte = new Laya.Byte();
            //或者传入一个类型化数组
            var uint8Byte: Uint8Array = new Uint8Array(10);
            var byte: Laya.Byte = new Laya.Byte(uint8Byte);
            //或者传入一个ArrayBuffer类型
            var buffer: ArrayBuffer = new ArrayBuffer(20);
            var byte: Laya.Byte = new Laya.Byte(buffer);
            //writeArrayBuffer(arraybuffer:*, offset:number = 0, length:number = 0):void
            var byte: Laya.Byte = new Laya.Byte();
            var byte1: Laya.Byte = new Laya.Byte();
            byte1.writeFloat32(20.0);//写入一个四个字节的浮点数
            byte1.writeInt16(16);//写入一个两个字节的整数
            byte1.writeUTFString("hell world");//写入一个字符串；
            byte.writeArrayBuffer(byte1.buffer);//把byte1的数据从第六个字节开始读入byte中。省略其中的浮点数20.0和整数16
            byte.pos = 0;//
            console.log("byte.readUTFString(): " + byte.readUTFString() + "  byte.length: " + byte.length)//从byte中读出字符串。
            // console.log("byte.getUTFString(): " + byte.getUTFString())// log is undefined
            console.log(Laya.Byte.getSystemEndian());//打印系统的字节顺序
            byte.pos = 6
            console.log("byte.bytesAvailable: " + byte.bytesAvailable)//可从字节流的当前位置到末尾读取的数据的字节数。
        }
        //test jsonp, server code is in ../websocketServer/server2.js
        //由于同源策略，一般来说位于xxx.com的网页无法与非xxx.com的服务器沟通，而HTML的DOM元素是一个例外，一般来讲凡是带有src属性的DOM元素不受跨域的限制
        private testJsonp() {
            var script: any = Laya.Browser.createElement("script");
            Laya.Browser.document.body.appendChild(script);
            script.src = "http://localhost:9090/?a=1";
        }
        public static testJsonpComplete() {
            console.log("testJsonpComplete JSONP执行到这里");
        }
    }
    new test.GameMain();
    // extended httprequest
    export class MyHttpRequest extends Laya.HttpRequest {
        constructor() {
            super();
        }
        send(url: string, data: any = null, method: string = "get", responseType: string = "text", headers: any = null) {
            super.send(url, data, method, responseType, headers);
            this._http.upload.onprogress = function (e: any): void {
                console.log("this._http.upload.onprogress: " + e);
            }
            this._http.upload.onload = function (e: any): void {
                console.log("this._http.upload.onload: " + e);
            }
            this._http.upload.onerror = function (e: any): void {
                console.log("this._http.upload.onerror: " + e);
            }
            this._http.upload.onabort = function (e: any): void {
                console.log("this._http.upload.onabort: " + e);
            }
        }
    }
}
// 1   .laya 文件夹下存放的是项目在开发运行中的一些配置信息。
// 2   项目的输出目录（bin）
// 3   UI项目目录（laya）
// 4   libs/.d.ts代码提供文件目录（libs）
// 5   项目代码目录（src）