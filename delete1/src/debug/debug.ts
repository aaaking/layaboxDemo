module debug {
    export class Debug {
        constructor() {
            // <script type="text/javascript" src="libs/laya.debugtool.js"></script>
            // var script: any = Laya.Browser.createElement("script")
            // Laya.Browser.document.body.appengChild(script)
            // script.src = "ibs/laya.debugtool.js"
            Laya.DebugPanel.init();
        }
    }
}