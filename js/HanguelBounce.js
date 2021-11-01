if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

class _hanguel {
  constructor(consonant, cx, cy, r, dx, dy, style) {
    this.consonant = consonant;
    this.center = new Vector2D(cx, cy);
    this.r = r;
    this.m = r * r;
    this.speed = new Vector2D(dx, dy);
    this.style = style;
    this.bgr = {r:getRndInt(10, 246), g:getRndInt(10, 246), b:getRndInt(10, 246)};
    this.rotateAngle = 0;
  }

  dist(other) {
    let c1 = this.center;
    let c2 = other.center;
    return Math.hypot(c2.v1 - c1.v1, c2.v2 - c1.v2);
  }
  
  move() {
    this.center.add(this.speed);
  }
  
  
  collide(other) {
    // collision check
    let checked = false;
    let dist = this.dist(other);
    let minDist = this.r + other.r;
    if (dist <= minDist) {
      let newVelocityX = elasticCollision([this.m, other.m], [this.speed.v1, other.speed.v1]);
      let newVelocityY = elasticCollision([this.m, other.m], [this.speed.v2, other.speed.v2]);
      this.speed = new Vector2D(newVelocityX[0], newVelocityY[0]);
      other.speed = new Vector2D(newVelocityX[1], newVelocityY[1]);
      checked = true;

      // split
      let halfDiff = (minDist - dist) / 2;
      if (this.center.v1 < other.center.v1) {
        this.center.v1 -= halfDiff;
        other.center.v1 += halfDiff;
      } else {
        this.center.v1 += halfDiff;
        other.center.v1 -= halfDiff;
      }
      
      if (this.center.v2 < other.center.v2) {
        this.center.v2 -= halfDiff;
        other.center.v2 += halfDiff;
      } else {
        this.center.v2 += halfDiff;
        other.center.v2 -= halfDiff;
      }
    }
    return checked;
  }
  
  hitTheWall(w, h) {
    let newCenter = this.center.clone();
    newCenter.add(this.speed);
    if (newCenter.v1 < 0 || newCenter.v1 >= w) this.speed.v1 *= -1;
    if (newCenter.v2 < 0 || newCenter.v2 >= h) this.speed.v2 *= -1;
  }
}

motionGraphics.hanguelBounce = function(el) {
  console.log(el.style);
  
  let cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  
  var positionInfo = el.getBoundingClientRect();
  cnv.width = positionInfo.width
  cnv.height = positionInfo.height;
  el.appendChild(cnv);

  let obj = this.hanguelBounce;
  obj.objName = "hanguelBounce";
  this.runningObj = obj;
  
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.hanguels = [];
  obj.cnt = Math.random() * 10 + 5;
  
  for (var i = 0; i < obj.cnt; i++) {
    obj.hanguels.push( 
      new _hanguel(
        "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ"[Math.floor(Math.random() * 14)],
        Math.random() * obj.w, 
        Math.random() * obj.h,
        Math.min(obj.w, obj.h) / 20 * (1 + Math.random()),
        (Math.random() - 0.5) * Math.min(obj.w, obj.h) / 20,
        (Math.random() - 0.5) * Math.min(obj.w, obj.h) / 20,
        (Math.random() >= 0.5) ? "fill" : "stroke"
      )
    );
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
      for (var i = 0; i < obj.hanguels.length; i++) {
        var b = obj.hanguels[i];

        // draw
        obj.ctx.beginPath();
        obj.ctx.shadowBlur = 5;
        obj.ctx.shadowColor = "white";
        if (b.style == "fill") {
          obj.ctx.fillStyle = getRGBStr(b.bgr.r, b.bgr.g, b.bgr.b);
          obj.ctx.font = (2 * b.r) + "px Comic Sans MS";
          obj.ctx.textAlign = "center";
          obj.ctx.fillText(b.consonant, b.center.v1, b.center.v2);
        } else {
          obj.ctx.strokeStyle = getRGBStr(b.bgr.r, b.bgr.g, b.bgr.b);
          obj.ctx.font = (2 * b.r) + "px Comic Sans MS";
          obj.ctx.textAlign = "center";
          obj.ctx.strokeText(b.consonant, b.center.v1, b.center.v2);
        }

        // collision
        if (checked.indexOf(i) < 0) {
          for (var j = i + 1; j < obj.hanguels.length; j++) {
            if (b.collide(obj.hanguels[j])) {
              checked.push(j);
            }
          }  
        }        
        
        b.speed.rotate(b.rotateAngle);
        b.rotateAngle = 0;
        b.hitTheWall(obj.w, obj.h);
        b.move();
      }
    }
    if (motionGraphics.runningObj.objName == obj.objName)
      requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
