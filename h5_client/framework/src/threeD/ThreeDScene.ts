/*
* @author seacole
* 3D场景;
*/
class ThreeDScene {


    private _camera: Laya.Camera;

    constructor() {
        // FishManager.instance.init();

        // var scene = AppControl.getInstance().AppStage.ThreeDLevel;

        // this._camera = (new Laya.Camera(0, 50, ThreeDConfig.CAMERA_Z - ThreeDConfig.SCREEN_Z));
        // this._camera.transform.translate(new Laya.Vector3(0, 0.0, ThreeDConfig.CAMERA_Z));
        this._camera.transform.rotate(new Laya.Vector3(0, 0, 0), true, false);
        this._camera.clearColor = null;
        this._camera.fieldOfView=45;
        // this._camera.addComponent(CameraMoveScript);       
        
        // ThreeDHelper._camera=this._camera;
        // Laya.Matrix4x4.multiply(this._camera.projectionMatrix, this._camera.viewMatrix, ThreeDHelper._projectViewMat);

        // var directionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        // directionLight.direction = new Laya.Vector3(0, -0.8, -1);
        // directionLight.ambientColor = new Laya.Vector3(0.7, 0.6, 0.6);
        // directionLight.specularColor = new Laya.Vector3(2.0, 2.0, 1.6);
        // directionLight.diffuseColor = new Laya.Vector3(1, 1, 1);

        // var pointLight = scene.addChild(new Laya.PointLight()) as Laya.PointLight;
        // pointLight.ambientColor = new Laya.Vector3(0.8, 0.5, 0.5);
        // pointLight.specularColor = new Laya.Vector3(1.0, 1.0, 0.9);
        // pointLight.diffuseColor = new Laya.Vector3(1, 1, 1);
        // pointLight.transform.position = new Laya.Vector3(0, 0, -500);
        // pointLight.attenuation = new Laya.Vector3(0.0, 0.0, 3.0);
        // pointLight.range = 800.0;

        // this.effectSprite = scene.addChild(Laya.Sprite3D.load("../../res/threeDimen/skinModel/xcy/Xiaochouyu@Move.lh")) as Laya.Sprite3D;
        // this.effectSprite.once(Laya.Event.HIERARCHY_LOADED, this, (sprite3D) => {
        //     var rootAnimations:Laya.RigidAnimations = sprite3D.addComponent(Laya.RigidAnimations);
        //     this.effectSprite.transform.localScale = new Laya.Vector3(0.0001, 0.0001, 0.0001);
        //     rootAnimations.url = "../../res/threeDimen/skinModel/xcy/Xiaochouyu@Move.lrani";
        //     rootAnimations.player.play(0);
        // });
    }


    public addToStage(): void {
        AppControl.getInstance().addTo3D(this._camera);     
    }

    public removeFromStage(): void {
    }

    private _ray: Laya.Ray;
    /**
     *获取摄像机到屏幕点的射线
     */
    public getViewportPointToRay(point: Laya.Vector2): Laya.Ray {
        if (!this._ray)
            this._ray = new Laya.Ray(new Laya.Vector3(), new Laya.Vector3());
        this._camera.viewportPointToRay(point, this._ray);
        return this._ray;
    }
}