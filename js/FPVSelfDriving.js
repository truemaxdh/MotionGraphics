if (typeof motionGraphics === 'undefined' || !motionGraphics) {
    motionGraphics = {};
}

class objCarFPV extends gameobj {
    constructor(ctx) {
        super(ctx.canvas.width / 2, ctx.canvas.height / 2, 25, 0, 0);
        this.maxSpeedV2 = 3.5;
        this.accel.v2 = 0.01;
        this.rotate = 0;
        this.unitRotate = Math.PI / 36;
    }

    move(ctx, road) {
        this.center.v2 = ctx.canvas.height / 2;
        this.speed.add(this.accel);
        this.center.v1 += this.speed.v1;
        if (this.speed.v2 > this.maxSpeedV2) {
            this.speed.v2 = this.maxSpeedV2;
        }

        if (this.speed.v2 < 0 || this.rotate > 0) {
            this.rotate += this.unitRotate;
            if (this.rotate >= 2 * Math.PI) {
                this.rotate = 0;
            }
        }

        let d1, d2;
        [d1, d2] = road.dists(this, ctx);
        let dSum = d1 + d2;
        if ((d1 / dSum) < 0.4) {
            this.accel.v1 = 1;
        } else if ((d2 / dSum) < 0.4) {
            this.accel.v1 = -1;
        }

        this.accel.v1 *= 0.8;
        this.speed.v1 *= 0.8;
    }
    
    render(ctx) {
        this.center.v2 = ctx.canvas.height / 2;
        ctx.save();
        ctx.translate(this.center.v1, this.center.v2);
        //ctx.rotate(this.rotate);    
        ctx.fillStyle = "purple";
        ctx.fillRect(this.r * -0.5, -this.r, this.r, this.r * 2);
        ctx.fillStyle = "black";
        ctx.fillRect(-this.r, -this.r, this.r * 0.4, this.r * 0.8);
        ctx.fillRect(-this.r, this.r, this.r * 0.4, this.r * -0.8);
        ctx.fillRect(this.r, -this.r, this.r * -0.4, this.r * 0.8);
        ctx.fillRect(this.r, this.r, this.r * -0.4, this.r * -0.8);
        ctx.restore();
        
        if (this.next != null) {
            this.next.render();
        }
    }
}

motionGraphics.FPVSelfDriving = function(el) {
    let cnv = document.createElement("CANVAS");
    cnv.style.position = "relative";
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.id = "cnv";
    
    var positionInfo = el.getBoundingClientRect();
    cnv.width = positionInfo.width
    cnv.height = positionInfo.height;
    el.appendChild(cnv);

    let obj = this.FPVSelfDriving;
    obj.objName = "FPVSelfDriving";
    this.runningObj = obj;

    obj.ctx = cnv.getContext("2d");
    obj.w = cnv.width;
    obj.h = cnv.height;
    obj.lastTimeStamp = null;

    const road = new objRoad(obj.ctx);
    const car = new objCarFPV(obj.ctx);
    
    obj.drawFrm = function(timeStamp) {
        if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
        if ((timeStamp - obj.lastTimeStamp) > 30) {
            obj.lastTimeStamp = timeStamp;
            obj.ctx.save();
            obj.ctx.translate(car.center.v1, car.center.v2);
            obj.ctx.rotate(-car.rotate);    
            obj.ctx.translate(-car.center.v1, -car.center.v2);
            road.render(obj.ctx);
            obj.ctx.restore();
            car.render(obj.ctx);
            
            road.move(obj.ctx);
            car.move(obj.ctx, road);
            road.collide(car, obj.ctx);
            road.speed.v2 = car.speed.v2;
        }
    
        if (motionGraphics.runningObj.objName == obj.objName) {
            requestAnimationFrame(obj.drawFrm);
        }
    }
    
    requestAnimationFrame(obj.drawFrm);
}
