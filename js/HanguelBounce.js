if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

function _hanguel(consonant, cx, cy, r, dx, dy, style) {
  this.consonant = consonant;
  this.center = new Vector2D(cx, cy);
  this.r = r;
  this.speed = new Vector2D(dx, dy);
  this.style = style;
  this.bgr = {r:getRndInt(10, 246), g:getRndInt(10, 246), b:getRndInt(10, 246)};
  this.move = function() {
    this.center.add(this.speed);
  }
  
  this.collide = function(han1) {
    let distVector = this.center.clone();
    distVector.subtract(han1.center);
    
    // collision check
    if (distVector.magnitude() <= (this.r + han1.r)) {
      let distUV1 = Vector2D.Create(distVector.unitVector());
      let distUV2 = Vector2D.Create(distVector.unitVector());
      let thisSpeed = this.speed.magnitude();
      let han1Speed = han1.speed.magnitude();
      this.speed.add(distUV1.multiply1D(han1Speed));
      han1.speed.subtract(distUV2.multiply1D(thisSpeed));  
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
  obj.cnt = Math.random() * 10 + 12;
  
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
          var b2 = obj.hanguels[j];
          var nCx1 = b.center.v1 + b.speed.v1;
          var nCy1 = b.center.v2 + b.speed.v2;
          var nCx2 = b2.center.v1 + b2.speed.v1;
          var nCy2 = b2.center.v2 + b2.speed.v2;
          var d_sqr = (nCx2 - nCx1)*(nCx2 - nCx1) + (nCy2 - nCy1)*(nCy2 - nCy1);
          var d_chk = (b.r + b2.r)*(b.r + b2.r); 
          if (d_sqr < d_chk) {
            var tmp = b.speed.v1 + 0;
            b.speed.v1 = b2.speed.v1;
            b2.speed.v1 = tmp;
            tmp = b.speed.v2 + 0;
            b.speed.v2 = b2.speed.v2;
            b2.speed.v2 = tmp;
            let tmpBgr = b.bgr;
            b.bgr = b2.bgr;
            b2.bgr = tmpBgr;
            b.style = (Math.random() >= 0.5) ? "fill" : "stroke";
            b2.style = (Math.random() >= 0.5) ? "fill" : "stroke"
          }
          if (d_sqr < (d_chk / 4)) {
            if (b.center.v1 < b2.center.v1)  {
              b.center.v1 -= b.r; 
              b2.center.v1 += b2.r;
            } else {
              b2.center.v1 -= b2.r;
               b.center.v1 += b.r;
            }   
          }
        }
        if ((b.center.v1 + b.speed.v1) < 0 || (b.center.v1 + b.speed.v1) >=  obj.w) b.speed.v1 *= -1;
        if ((b.center.v2 + b.speed.v2) < 0 || (b.center.v2 + b.speed.v2) >=  obj.h) b.speed.v2 *= -1;
        b.center.v1 += b.speed.v1;
        b.center.v2 += b.speed.v2;
      }
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
