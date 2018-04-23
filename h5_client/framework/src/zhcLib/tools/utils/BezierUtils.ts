/*
* @author seacole
* 贝塞尔曲线;
*/
class BezierUtils {
    constructor() {

    }
   
    public static createCurve(originPoint: Array<Laya.Vector3>): Array<Laya.Vector3> {
        //控制点收缩系数 ，经调试0.6较好，CvPoint是opencv的，可自行定义结构体(x,y) 
        var scale: number = 0.6;
        var originCount: number = originPoint.length;
        var midpoints: Array<Laya.Vector3> = [];
        //生成中点      
        for (var i: number = 0; i < originCount; i++) {
            var tmp: Laya.Vector3 = new Laya.Vector3();
            var nexti: number = (i + 1) % originCount;
            Laya.Vector3.add(originPoint[i], originPoint[nexti], tmp);
            Laya.Vector3.scale(tmp, 0.5, tmp);
            midpoints.push(tmp);
        }

        //平移中点 
        var extrapoints: Array<Laya.Vector3> = [];
        for (var i: number = 0; i < originCount; i++) {
            var nexti: number = (i + 1) % originCount;
            var backi: number = (i + originCount - 1) % originCount;
            var midinmid: Laya.Vector3 = new Laya.Vector3();
            Laya.Vector3.add(midpoints[i], midpoints[backi], midinmid);
            Laya.Vector3.scale(midinmid, 0.5, midinmid);
            var offest: Laya.Vector3 = new Laya.Vector3();
            Laya.Vector3.subtract(originPoint[i], midinmid, offest);

            var tmp: Laya.Vector3 = new Laya.Vector3();
            Laya.Vector3.add(midpoints[backi], offest, tmp);
            var add: Laya.Vector3 = new Laya.Vector3();
            Laya.Vector3.subtract(tmp, originPoint[i], add);
            Laya.Vector3.scale(add, scale, add);
            Laya.Vector3.add(originPoint[i], add, tmp);
            extrapoints.push(tmp);

            var tmp: Laya.Vector3 = new Laya.Vector3();
            Laya.Vector3.add(midpoints[i], offest, tmp);
            var add: Laya.Vector3 = new Laya.Vector3();
            Laya.Vector3.subtract(tmp, originPoint[i], add);
            Laya.Vector3.scale(add, scale, add);
            Laya.Vector3.add(originPoint[i], add, tmp);
            extrapoints.push(tmp);
        }
        return extrapoints;

        // var controlPoint: Array<Laya.Vector3> = [];
        // var out:Array<Array<Laya.Vector3>>=[];
        // //生成4控制点，产生贝塞尔曲线 
        // for (var i: number = 0; i < originCount; i++) {
        //     controlPoint=[];
        //     controlPoint.push(originPoint[i]);
        //     var extraindex: number = 2 * i;
        //     controlPoint.push(extrapoints[extraindex + 1]);
        //     var extranexti: number = (extraindex + 2) % (2 * originCount);
        //     controlPoint.push(extrapoints[extranexti]);
        //     var nexti: number = (i + 1) % originCount;
        //     controlPoint.push(originPoint[nexti]);
        //     var u: number = 0;
        //     var curvePoint: Array<Laya.Vector3>=[];
        //     while (u <= 1 ) {
        //         //u的步长决定曲线的疏密 
        //         u += 0.005;
        //         var tempP: Laya.Vector3 = this.bezier3func(u, controlPoint);
        //         //存入曲线点  
        //         curvePoint.push(tempP);
        //     }
        //     out.push(curvePoint);
        // }
        // return out;
    }
    
    public static bezier3func(uu: number, controlP:Array<Laya.Vector3>): Laya.Vector3 {
        var part0: Laya.Vector3 = new Laya.Vector3();
        var part1: Laya.Vector3 = new Laya.Vector3();
        var part2: Laya.Vector3 = new Laya.Vector3();
        var part3: Laya.Vector3 = new Laya.Vector3();
        var tmp: number = (1 - uu) * (1 - uu) * (1 - uu);
        Laya.Vector3.scale(controlP[0], tmp, part0);
        tmp = 3*uu * (1 - uu) * (1 - uu);
        Laya.Vector3.scale(controlP[1], tmp, part1);
        tmp = 3*uu * uu * (1 - uu);
        Laya.Vector3.scale(controlP[2], tmp, part2);
        tmp = uu * uu * uu;
        Laya.Vector3.scale(controlP[3], tmp, part3);
        var out: Laya.Vector3 = new Laya.Vector3();
        Laya.Vector3.add(part0, part1, out);
        Laya.Vector3.add(out, part2, out);
        Laya.Vector3.add(out, part3, out);
        return out;
    }
}