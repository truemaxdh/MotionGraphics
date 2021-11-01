if (typeof motionGraphics === 'undefined' || !motionGraphics) {
    motionGraphics = {};
}

class Ship{
    constructor(cx, cy) {
        this.maxSpeed = getRndInt(1, 5);
        this.numOfirections = getRndInt(4, 12);
        this.r = getRndInt(20, 15);;

        this.center = new Vector2D(cx, cy);
        this.unitRotation = 2 * Math.PI / this.numOfirections;
        this.direction = getRndInt(0, this.numOfirections) * this.unitRotation;
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
        let checked = false;
        let dist = thisNewCenter.calcDist(othereNewCenter);
        let minDist = this.r + other.r;
        if (dist <= minDist) {
            this.rotate();
            other.rotate();
            checked = true;
        }
        return checked;
    }

    hitTheWall(w, h) {
        let newCenter = this.center.clone();
        newCenter.add(this.speed());
        if (newCenter.v1 < 0 || newCenter.v1 >= w || 
            newCenter.v2 < 0 || newCenter.v2 >= h) {
                this.rotate();
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.ellipse(this.center.v1, this.center.v2, this.r, this.r / 3, this.direction, 0, 2 * Math.PI);
        ctx.fillStyle = "#ddd";
        ctx.fill();
    }
}

motionGraphics.autonomousShips = function(el) {
    let cnv = document.createElement("CANVAS");
    cnv.style.position = "relative";
    cnv.style.width = el.style.width;
    cnv.style.height = el.style.height;
    cnv.id = "cnv";
    
    var positionInfo = el.getBoundingClientRect();
    cnv.width = positionInfo.width
    cnv.height = positionInfo.height;
    el.appendChild(cnv);

    
    let obj = this.autonomousShips;
    obj.objName = "autonomousShips";
    this.runningObj = obj;
    
    obj.ctx = cnv.getContext("2d");
    obj.w = cnv.width;
    obj.h = cnv.height;
    obj.lastTimeStamp = null;
    obj.ships = [];
    obj.cnt = getRndInt(10, 5);
    for (var i = 0; i < obj.cnt; i++) {
        obj.ships.push(new Ship(getRndInt(0, obj.w), getRndInt(0, obj.h)));
    }

    obj.drawFrm = function(timeStamp) {
        if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
        if ((timeStamp - obj.lastTimeStamp) > 30) {
            obj.lastTimeStamp = timeStamp;
            
            // clear
            obj.ctx.beginPath();
            obj.ctx.fillStyle="black";
            obj.ctx.rect(0, 0, obj.w, obj.h);
            obj.ctx.fill();

            let checked = [];
            for (var i = 0; i < obj.ships.length; i++) {
                var ship = obj.ships[i];

                // draw
                ship.draw(obj.ctx);

                // collision
                for (var j = i + 1; j < obj.ships.length; j++) {
                    if (ship.collide(obj.ships[j])) {
                        checked.push(j);
                    }
                }
                
                ship.hitTheWall(obj.w, obj.h);
                ship.move();
            }
        }
        
        if (motionGraphics.runningObj.objName == obj.objName)
            requestAnimationFrame(obj.drawFrm);
    }
    obj.drawFrm();
}