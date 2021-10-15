if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

function _hanguel(consonant, cx, cy, r, dx, dy, style) {
  this.consonant = consonant;
  this.center = new Vector2D(cx, cy);
  this.r = r;
  this.m = r * r;
  this.speed = new Vector2D(dx, dy);
  this.style = style;
  this.bgr = {r:getRndInt(10, 246), g:getRndInt(10, 246), b:getRndInt(10, 246)};
  this.rotateAngle = 0;
  
  this.dist = function(other) {
    let c1 = this.center;
    let c2 = other.center;
    return Math.sqrt((c2.v1 - c1.v1) * (c2.v1 - c1.v1) + (c2.v2 - c1.v2) * (c2.v2 - c1.v2));
  }
  
  this.move = function() {
    this.center.add(this.speed);
  }
  
  this.collide = function(other) {
    // collision check
    if (this.dist(other) <= (this.r + other.r)) {
      // mirroring
      let refAngle = this.center.clone().subtract(other.center).theta();
      this.speed.multiply1D(-1);
      other.speed.multiply1D(-1);
      this.rotateAngle += 2 * (refAngle - this.speed.theta());
      other.rotateAngle += 2 * (Math.PI + refAngle - other.speed.theta());
    }
  }
  
  this.hitTheWall = function(w, h) {
    let newCenter = this.center.clone();
    newCenter.add(this.speed);
    if (newCenter.v1 < 0 || newCenter.v1 >= w) this.speed.v1 *= -1;
    if (newCenter.v2 < 0 || newCenter.v2 >= h) this.speed.v2 *= -1;
  }
}

motionGraphics.hanguelBounce = function(el) {
  console.log(el.style);
  
  motionGraphics.runningObj = this.hanguelBounce;

  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  
  var positionInfo = el.getBoundingClientRect();
  cnv.width = positionInfo.width
  cnv.height = positionInfo.height;
  el.appendChild(cnv);

  var obj = this.hanguelBounce;
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.hanguels = [];
  //obj.cnt = Math.random() * 12 + 3;
  obj.cnt = 4;
  
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
        for (var j = i + 1; j < obj.hanguels.length; j++) {
          b.collide(obj.hanguels[j]);
        }
        
        b.speed.rotate(b.rotateAngle);
        b.rotateAngle = 0;
        b.hitTheWall(obj.w, obj.h);
        b.move();
      }
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
