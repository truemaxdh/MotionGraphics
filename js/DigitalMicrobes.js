if (typeof motionGraphics === 'undefined' || !motionGraphics) {
    motionGraphics = {};
}

class Microbe{
    constructor(cx, cy) {
        this.maxSpeed = getRndInt(1, 5);
        this.r = getRndInt(12, 25);
        this.color = getRndColor(0, 0, 0, 255);
        this.center = new Vector2D(cx, cy);
        this.unitRotation = Math.PI / getRndInt(2, 18);
        this.direction = this.unitRotation * getRndInt(0, 36);
    }

    dist(other) {
        let c1 = this.center;
        let c2 = other.center;
        return Math.hypot(c2.v1 - c1.v1, c2.v2 - c1.v2);
    }
    
    speed() {
        return new Vector2D(
            this.maxSpeed * Math.cos(this.direction),
            this.maxSpeed * Math.sin(this.direction)
        );
    }

    move() {
        this.center.add(this.speed());
    }
  
    rotate() {
        this.direction += this.unitRotation;
        if (this.direction >= (2 * Math.PI)) {
            this.direction = 0;
        }
    }

    collide(other) {
        let thisNewCenter = this.center.clone().add(this.speed());
        let othereNewCenter = other.center.clone().add(other.speed());
        
        // collision check
        let collided = false;
        let dist = thisNewCenter.calcDist(othereNewCenter);
        let minDist = this.r + other.r;
        if (dist <= minDist) {
            //this.rotate();
            //other.rotate();
            roughlySeparate(this, other, minDist);
            collided = true;
        }
        return collided;
    }

    hitTheWall(w, h) {
        let rotateFlag = false;
        if (this.center.v1 < this.r) {
            this.center.v1 = this.r;
            rotateFlag = true;
        }
        
        if (this.center.v1 > (w - this.r)) {
            this.center.v1 = w - this.r;
            rotateFlag = true;
        }
        
        if (this.center.v2 < this.r) {
            this.center.v2 = this.r;
            rotateFlag = true;
        }
        
        if (this.center.v2 > (h - this.r)) {
            this.center.v2 = h - this.r;
            rotateFlag = true;
        }

        if (rotateFlag) this.rotate();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.ellipse(this.center.v1, this.center.v2, this.r, this.r / 3, this.direction, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

motionGraphics.digitalMicrobes = function(el) {
    let cnv = document.createElement("CANVAS");
    cnv.style.position = "relative";
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.id = "cnv";
    
    var positionInfo = el.getBoundingClientRect();
    cnv.width = positionInfo.width
    cnv.height = positionInfo.height;
    el.appendChild(cnv);

    
    let obj = this.digitalMicrobes;
    obj.objName = "digitalMicrobes";
    this.runningObj = obj;
    
    obj.ctx = cnv.getContext("2d");
    obj.w = cnv.width;
    obj.h = cnv.height;
    obj.lastTimeStamp = null;
    obj.microbes = [];
    obj.cnt = getRndInt(10, 15);
    for (var i = 0; i < obj.cnt; i++) {
        obj.microbes.push(new Microbe(getRndInt(0, obj.w), getRndInt(0, obj.h)));
    }

    obj.drawFrm = function(timeStamp) {
        if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
        if ((timeStamp - obj.lastTimeStamp) > 30) {
            obj.lastTimeStamp = timeStamp;
            
            // clear
            obj.ctx.beginPath();
            //obj.ctx.fillStyle="black";
            obj.ctx.fillStyle="rgba(0, 0, 0, 0.5)";
            obj.ctx.rect(0, 0, obj.w, obj.h);
            obj.ctx.fill();

            let rotateChecked = [];
            for (var i = 0; i < obj.microbes.length; i++) {
                var microbe = obj.microbes[i];

                // draw
                microbe.draw(obj.ctx);

                // check collision and rotate
                if (rotateChecked.indexOf(i) >= 0) {
                    microbe.rotate();
                } else {
                    // collision check
                    for (var j = i + 1; j < obj.microbes.length; j++) {
                        if (microbe.collide(obj.microbes[j])) {
                            microbe.rotate();
                            rotateChecked.push(j);
                        }
                    }
                }

                microbe.move();
                microbe.hitTheWall(obj.w, obj.h);
            }
        }
        
        if (motionGraphics.runningObj.objName == obj.objName)
            requestAnimationFrame(obj.drawFrm);
    }
    obj.drawFrm();
}