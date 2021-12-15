if (typeof motionGraphics === 'undefined' || !motionGraphics) {
    motionGraphics = {};
}

class objMapFPV extends gameobj {
    constructor(r) {
        super(r / 2, r / 2, r, 0, 0);
        this.spaceColor = "#0e1818";
        this.mapSize = new Vector2D(r, r);
        this.mapCanvas = document.createElement("canvas");
        this.mapCanvas.width = this.mapSize.v1 * 2;
        this.mapCanvas.height = this.mapSize.v2 * 2;
        this.rotate = 0;
        this.drawCanvas = document.createElement("canvas");        
        this.createMap();
        //document.body.appendChild(this.mapCanvas);
    }
    createMap() {
        const ctx = this.mapCanvas.getContext("2d");
        ctx.fillStyle = this.spaceColor;
        ctx.fillRect(0, 0, this.mapSize.v1, this.mapSize.v2);
        ctx.globalAlpha = 0.8;
        const objCnt = this.r * 0.05;
        for(let cnt = 0; cnt < objCnt; cnt++) {
            const cx = Math.random() * this.mapSize.v1;
            const cy = Math.random() * this.mapSize.v2;
            const r = Math.random() * 100;
            if ((cx - r) < 0 || (cx + r) > this.mapSize.v1 ||
                (cy - r) < 0 || (cy + r) > this.mapSize.v2) {
                cnt--;
            } else {
                ctx.beginPath();
                ctx.fillStyle = getRndColor(128, 128, 128, 128);
                ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.fill();    
            }
        }
        ctx.globalAlpha = 1;
        ctx.drawImage(this.mapCanvas, 0, 0, this.mapSize.v1, this.mapSize.v2,
          this.mapSize.v1, 0, this.mapSize.v1, this.mapSize.v2);     
        ctx.drawImage(this.mapCanvas, 0, 0, this.mapSize.v1, this.mapSize.v2,
          0, this.mapSize.v2, this.mapSize.v1, this.mapSize.v2);     
        ctx.drawImage(this.mapCanvas, 0, 0, this.mapSize.v1, this.mapSize.v2,
          this.mapSize.v1, this.mapSize.v2, this.mapSize.v1, this.mapSize.v2);
    }

    move(mainObj) {
        this.center.v1 = mainObj.center.v1;
        this.center.v2 = mainObj.center.v2;
        this.rotate = -mainObj.rotate;
    }

    render(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const maxWH = Math.max(w, h);
        const exW = maxWH * 1.5;
        const exH = maxWH * 1.5;
        const mExW = exW / 2;
        const mExH = exH / 2;
        let srcL = this.center.v1 - mExW;
        let srcT = this.center.v2 - mExH;
        if (srcL < 0) srcL += this.mapSize.v1;
        if (srcT < 0) srcT += this.mapSize.v2;
        
        this.drawCanvas.width = exW;
        this.drawCanvas.height = exH;
        const drawCtx = this.drawCanvas.getContext("2d");

        drawCtx.fillStyle=this.spaceColor;
        drawCtx.rect(0, 0, exW, exH);
        drawCtx.fill();
        
        drawCtx.save();
        drawCtx.translate(mExW, mExH);
        drawCtx.rotate(this.rotate - Math.PI / 2);
        drawCtx.drawImage(this.mapCanvas, srcL, srcT, exW, exH, -mExW, -mExH, exW, exH);
        drawCtx.restore();        

        ctx.drawImage(this.drawCanvas, w * 0.25, h * 0.25, w, h, 0, 0, w, h);
    }
}

class objRocketFPV extends gameobj {
    constructor(map) {
        super(map.center.v1, map.center.v2, 45, 0, 0);
        this.mapSize = map.mapSize;
        this.speed = 2;
        this.rotate = Math.PI * 1.5;
        this.targetRotate = this.rotate;
    }

    move() {
        const speed2D = new Vector2D(Math.cos(this.rotate) * this.speed, Math.sin(this.rotate) * this.speed);
        this.center.add(speed2D);
        if (this.center.v1 < 0) this.center.v1 += this.mapSize.v1;
        if (this.center.v1 >= this.mapSize.v1) this.center.v1 -= this.mapSize.v1;
        if (this.center.v2 < 0) this.center.v2 += this.mapSize.v2;
        if (this.center.v2 >= this.mapSize.v2) this.center.v2 -= this.mapSize.v2;
        this.rotate += (this.targetRotate - this.rotate) / 30;
        if (Math.random() < 0.01) {
            this.targetRotate = getRndInt(0, 2 * Math.PI);
        }
    }
    
    render(ctx) {
        const half_w = ctx.canvas.width / 2;
        const half_h = ctx.canvas.height / 2;
        ctx.beginPath();
        ctx.arc(half_w, half_h - this.r * 0.5, this.r * 0.5, 0, 2 * Math.PI);
        ctx.fillStyle = "orange";
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = "#9B870C";
        ctx.fillRect(half_w - this.r * 0.5, half_h - this.r * 0.5, this.r, this.r);

        ctx.beginPath();
        ctx.moveTo(half_w - this.r * 0.5, half_h + this.r * 0.5);
        ctx.lineTo(half_w - this.r, half_h + this.r);
        ctx.lineTo(half_w + this.r, half_h + this.r);
        ctx.lineTo(half_w + this.r * 0.5, half_h + this.r * 0.5);
        ctx.fillStyle = "olive";
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "yellowgreen";
        ctx.lineWidth = 3;
        ctx.moveTo(half_w - this.r * 0.5, half_h + this.r);
        ctx.lineTo(half_w - this.r * 0.5, half_h + this.r * 1.5);
        ctx.moveTo(half_w, half_h + this.r);
        ctx.lineTo(half_w, half_h + this.r * 1.8);
        ctx.moveTo(half_w + this.r * 0.5, half_h + this.r);
        ctx.lineTo(half_w + this.r * 0.5, half_h + this.r * 1.5);
        ctx.stroke(); 
    }
}

motionGraphics.FPVSpaceRocket = function(el) {
    let cnv = document.createElement("CANVAS");
    cnv.style.position = "relative";
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.id = "cnv";
    
    var positionInfo = el.getBoundingClientRect();
    cnv.width = positionInfo.width
    cnv.height = positionInfo.height;
    el.appendChild(cnv);

    let obj = this.FPVSpaceRocket;
    obj.objName = "FPVSpaceRocket";
    this.runningObj = obj;

    obj.ctx = cnv.getContext("2d");
    obj.w = cnv.width;
    obj.h = cnv.height;
    obj.lastTimeStamp = null;

    const map = new objMapFPV(1000);
    const copter = new objRocketFPV(map);
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
