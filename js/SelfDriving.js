if (typeof motionGraphics === 'undefined' || !motionGraphics) {
    motionGraphics = {};
}

class gameobj {
    constructor(cx, cy, r, dx, dy) {
        this.center = new Vector2D(cx, cy);
        this.r = r;
        this.m = r * r;
        this.speed = new Vector2D(dx, dy);
        this.accel = new Vector2D(0, 0);
        this.prev = null;
        this.next = null;
    }
    
    move() {
        this.speed.add(this.accel);
        this.hitTheWall();
        this.center.add(this.speed);
        if (this.next != null) {
            this.next.move();
        }
    }

    hitTheWall() {
        let newCenter = this.center.clone();
        newCenter.add(this.speed);
        if ((newCenter.v1 - this.r) < 0 && this.speed.v1 < 0 || 
            (newCenter.v1 + this.r) > gameCanvas.w && this.speed.v1 > 0) {
                this.speed.v1 *= -1;
            }
            
        if ((newCenter.v2 - this.r) < 0 && this.speed.v2 < 0 || 
            (newCenter.v2 + this.r) > gameCanvas.h && this.speed.v2 > 0) {
                this.speed.v2 *= -1;
            }
    }

    draw() {
        if (this.next != null) {
            this.next.render();
        }
    }

    collide(other) {
        return this.center.calcDist(other.center) < (this.r + other.r);
    }
}

class objRoad extends gameobj {
    constructor() {
        super(0, 0, 1000, 0, 0);
        this.forestColor = "#2b2";
        this.landColor = "#f0db66";
        this.runningLength = 0;
        this.vWidth = 45;
        this.vHeight = 60;
        this.vRoadWidth = this.vWidth / 2;
        this.length = 1000;
        this.ctx;
        this.lBound;
        this.initBoundaries();
    }
    initBoundaries() {
        this.lBound = [];
        let nextLBound = (this.vWidth - this.vRoadWidth) / 2;
        for(let i = 0; i < this.length; i++) {
            this.lBound.push(nextLBound);
            nextLBound = prune(nextLBound + getRndInt(-1, 3), 1, this.vWidth - this.vRoadWidth - 2);
        }
    }

    move() {
        this.runningLength += this.speed.v2;
        if (this.runningLength >= this.length) {
            this.vRoadWidth--;
            this.initBoundaries();
            this.runningLength = 0;
        }
    }

    draw(ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;
        const stepX = w / this.vWidth;
        const stepY = h / this.vHeight;

        ctx.fillStyle = this.forestColor;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = this.landColor;
        for(let i = 0; i < (this.vHeight - 1); i++) {
            const vIndex = Math.floor(this.length - this.runningLength - this.vHeight + i);
            const x1 = this.lBound[vIndex] * stepX;
            const x2 = x1 + this.vRoadWidth * stepX;

            const vIndex_1 = vIndex + 1;
            const x1_1 = this.lBound[vIndex_1] * stepX;
            const x2_1 = x1_1 + this.vRoadWidth * stepX;

            ctx.beginPath();
            ctx.moveTo(x1, Math.floor(i * stepY));
            ctx.lineTo(x2, Math.floor(i * stepY));
            ctx.lineTo(x2_1, Math.floor((i + 1) * stepY));
            ctx.lineTo(x1_1, Math.floor((i + 1) * stepY));
            ctx.fill();
        }
    }
    
    collide(other, ctx) {
        let d1, d2;
        [d1, d2] = this.dists(other, ctx);
        if (other.r > d1) {
            other.center.v1 += other.r - d1;
            other.speed.v2 *= -0.15;
        }
        if (other.r > d2) {
            other.center.v1 -= other.r - d2;
            other.speed.v2 *= -0.15;
        }
    }

    dists(other, ctx) {
        const stepX = ctx.canvas.width / this.vWidth;
        const stepY = ctx.canvas.height / this.vHeight;
        const vIndex = Math.floor(
            this.length - this.runningLength - this.vHeight + other.center.v2 / stepY) - 1;
        const x1 = this.lBound[vIndex] * stepX;
        const x2 = x1 + this.vRoadWidth * stepX; 
        return [other.center.v1 - x1, x2 - other.center.v1];
    }
}

class objCar extends gameobj {
    constructor(ctx) {
        super(ctx.canvas.width / 2, ctx.canvas.height * 0.8, 25, 0, 0);
        this.maxSpeedV2 = 3.5;
        this.accel.v2 = 0.01;
        this.rotate = 0;
        this.unitRotate = Math.PI / 6;
    }

    move(ctx, road) {
        this.center.v2 = ctx.canvas.height * 0.8;
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
    
    draw(ctx) {
        this.center.v2 = ctx.canvas.height * 0.8;
        ctx.save();
        ctx.translate(this.center.v1, this.center.v2);
        ctx.rotate(this.rotate);    
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

motionGraphics.selfDriving = function(el) {
    let cnv = document.createElement("CANVAS");
    cnv.style.position = "relative";
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.id = "cnv";
    
    var positionInfo = el.getBoundingClientRect();
    cnv.width = positionInfo.width
    cnv.height = positionInfo.height;
    el.appendChild(cnv);

    let obj = this.selfDriving;
    obj.objName = "selfDriving";
    this.runningObj = obj;

    obj.ctx = cnv.getContext("2d");
    obj.w = cnv.width;
    obj.h = cnv.height;
    obj.lastTimeStamp = null;

    const road = new objRoad(obj.ctx);
    const car = new objCar(obj.ctx);
    obj.drawFrm = function(timeStamp) {
        if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
        if ((timeStamp - obj.lastTimeStamp) > 30) {
            obj.lastTimeStamp = timeStamp;
        
            road.draw(obj.ctx);
            car.draw(obj.ctx);
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
