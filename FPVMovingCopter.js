if (typeof motionGraphics === 'undefined' || !motionGraphics) {
    motionGraphics = {};
}

class objMapFPV extends gameobj {
    constructor(r) {
        super(r / 2, r / 2, r, 0, 0);
        this.forestColor = "#2b2";
        this.landColor = "#f0db66";
        this.mapSize = new Vector2D(r, r);
        this.mapCanvas = document.createElement("canvas");
        this.mapCanvas.width = this.mapSize.v1;
        this.mapCanvas.height = this.mapSize.v2;
        this.mapCtx = this.mapCanvas.getContext("2d");
        this.rotate = 0;
        this.createMap();
    }
    createMap() {
        const ctx = this.mapCtx;
        ctx.fillStyle = this.landColor;
        ctx.fillRect(0, 0, this.mapSize.v1, this.mapSize.v2);
        ctx.globalAlpha = 0.7;
        for(let i = 0; i < 25; i++) {
            const cx = Math.random() * this.mapSize.v1;
            const cy = Math.random() * this.mapSize.v2;
            const r = Math.random() * this.r * 0.1;
            ctx.beginPath();
            ctx.fillStyle = getRndColor(128, 128, 128, 128);
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.fill();
        }
        
    }

    move(mainObj) {
        this.center.v1 = mainObj.center.v1;
        this.center.v2 = mainObj.center.v2;
        this.rotate = -mainObj.rotate;
    }

    render(ctx) {
        const half_w = ctx.canvas.width / 2;
        const half_h = ctx.canvas.height / 2;
        const w = ctx.canvas.width * 1.5;
        const h = ctx.canvas.height * 1.5;
        const l = this.center.v1 - Math.floor(w * 0.75);
        const t = this.center.v2 - Math.floor(h * 0.75);
        const imgData = this.mapCtx.getImageData(l, t, w, h);
        ctx.save();
        ctx.translate(half_w, half_h);
        ctx.putImageData(imgData, -w / 2, -h / 2);
        ctx.restore();
    }
}

class objCopterFPV extends gameobj {
    constructor(map) {
        super(map.center.v1, map.center.v2, 45, 0, 0);
        this.mapSize = map.mapSize;
        this.speed = 1;
        this.rotate = 0;
        this.unitRotate = Math.PI / 12;
        this.propellerRot = 0;
    }

    move() {
        const speed2D = new Vector2D(Math.cos(this.rotate) * this.speed, Math.sin(this.rotate) * this.speed);
        this.center.add(speed2D);
        this.center.v1 = prune(this.center.v1, 0, this.mapSize.v1);
        this.center.v2 = prune(this.center.v2, 0, this.mapSize.v2);
        const rndNum = Math.random();
        if (rndNum < 0.05) {
            this.rotate -= this.unitRotate;
        } else if (rndNum >= 0.95) {
            this.rotate += this.unitRotate;
        }
        this.propellerRot += this.unitRotate;
        this.propellerRot %= Math.PI * 2;
    }
    
    render(ctx) {
        ctx.globalAlpha = 0.9;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(this.r / 2, 0);
        ctx.lineTo(-this.r, 0);
        ctx.strokeStyle = "rgba(120, 10, 10)";
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(this.r / 2, 0, this.r * 0.8, this.r * 0.6, 0, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(10, 140, 10)";
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = "rgba(10, 110, 10)";
        ctx.arc(-this.r, 0, this.r * 0.4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(-this.r, 0);
        ctx.lineTo(this.r, 0);
        ctx.moveTo(0, -this.r);
        ctx.lineTo(0, this.r);
        ctx.strokeStyle = "rgba(20, 20, 200)";
        ctx.stroke();
    }
}

motionGraphics.FPVMovingCopter = function(el) {
    let cnv = document.createElement("CANVAS");
    cnv.style.position = "relative";
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.id = "cnv";
    
    var positionInfo = el.getBoundingClientRect();
    cnv.width = positionInfo.width
    cnv.height = positionInfo.height;
    el.appendChild(cnv);

    let obj = this.FPVMovingCopter;
    obj.objName = "FPVMovingCopter";
    this.runningObj = obj;

    obj.ctx = cnv.getContext("2d");
    obj.w = cnv.width;
    obj.h = cnv.height;
    obj.lastTimeStamp = null;

    const map = new objMapFPV(1000);
    const copter = new objCopterFPV(map);
    obj.drawFrm = function(timeStamp) {
        if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
        if ((timeStamp - obj.lastTimeStamp) > 30) {
            obj.lastTimeStamp = timeStamp;
        
            map.render(obj.ctx);
            copter.render(obj.ctx);
            copter.move();
            map.move(copter);
        }
    
        if (motionGraphics.runningObj.objName == obj.objName) {
            requestAnimationFrame(obj.drawFrm);
        }
    }
    
    requestAnimationFrame(obj.drawFrm);
}
