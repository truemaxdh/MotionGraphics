if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

function _balloon(cx, cy, r, dx, dy) {
  this.cx = cx;
  this.cy = cy;
  this.r = r;
  this.dx = dx;
  this.dy = dy;
  this.style = (Math.random() >= 0.5) ? "fill" : "stroke";
  this.getNewC = function(c) {
    return 80 + Math.random() * 176;
  }
  this.bgr = {r:this.getNewC(-1), g:this.getNewC(-1), b:this.getNewC(-1)};
}

motionGraphics.balloonsUp = function(el) {
  motionGraphics.resize = function() {
    var obj = this.balloonsUp;
    var cnv = obj.ctx.canvas;
    obj.w = cnv.width;
    obj.h = cnv.height;
  }
  
  console.log(el.style);
  
  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  cnv.width = cnv.style.width.replace("px","");
  cnv.height = cnv.style.height.replace("px","");
  el.appendChild(cnv);

  var obj = this.balloonsUp;
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.baloons = [];
  obj.cnt = Math.random() * 10 + 12;
  
  for (var i = 0; i < obj.cnt; i++) {
    var r = Math.min(obj.w, obj.h) / 20 * (1 + Math.random());
    obj.baloons.push( 
      new _balloon(
        Math.random() * obj.w, 
        obj.h + r,
        r,
        0,
        - (Math.random() * obj.h / 70 + 1) 
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

      for (var i = 0; i < obj.baloons.length; i++) {
        var b = obj.baloons[i];

        // draw
        obj.ctx.beginPath();
        if (b.style == "fill") {
          obj.ctx.fillStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx, b.cy, b.r, 0, 2 * Math.PI);

          obj.ctx.moveTo(b.cx, b.cy + b.r);
          obj.ctx.lineTo(b.cx - b.r / 5, b.cy + b.r * 1.2);
          obj.ctx.lineTo(b.cx + b.r / 5, b.cy + b.r * 1.2);
          obj.ctx.lineTo(b.cx, b.cy + b.r);
          obj.ctx.fill();
        } else {
          obj.ctx.strokeStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx, b.cy, b.r, 0, 2 * Math.PI);

          obj.ctx.moveTo(b.cx, b.cy + b.r);
          obj.ctx.lineTo(b.cx - b.r * 0.2, b.cy + b.r * 1.2);
          obj.ctx.lineTo(b.cx + b.r * 0.2, b.cy + b.r * 1.2);
          obj.ctx.lineTo(b.cx, b.cy + b.r);
          obj.ctx.stroke();
        }
        
        obj.ctx.beginPath();
        obj.ctx.strokeStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
        obj.ctx.moveTo(b.cx, b.cy + b.r * 1.2);
        obj.ctx.quadraticCurveTo(b.cx + b.r * 0.15, b.cy + b.r * 1.45, b.cx, b.cy + b.r * 1.7);
        obj.ctx.quadraticCurveTo(b.cx - b.r * 0.15, b.cy + b.r * 1.95, b.cx, b.cy + b.r * 2.2);
        obj.ctx.quadraticCurveTo(b.cx + b.r * 0.15, b.cy + b.r * 2.45, b.cx, b.cy + b.r * 2.7);
        obj.ctx.quadraticCurveTo(b.cx - b.r * 0.15, b.cy + b.r * 2.95, b.cx, b.cy + b.r * 3.2);
        obj.ctx.stroke();
        
        // collision
        b.cx += b.dx;
        b.cy += b.dy;
        
        if (b.cy < -100) {
          obj.baloons.splice(i--,1);
          var r = Math.min(obj.w, obj.h) / 20 * (1 + Math.random());
          obj.baloons.push( 
            new _balloon(
              Math.random() * obj.w, 
              obj.h + r,
              r,
              0,
              - (Math.random() * obj.h / 70 + 1) 
            )
          );
        }
      }
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
