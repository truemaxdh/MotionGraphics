if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

function _sun(w, h, cx, cy, countdown) {
  this.w = w;
  this.h = h;
  this.cx = cx;
  this.cy = cy;
  this.countdown = countdown;
  this.div = Math.floor(12 + 58 * Math.random()) * 2;
  this.bgr = {r:255, g:0, b:0};
  this.lastTimeStamp = null;
  
  this.getNewC = function(c) {
    c += Math.random() * 3 - 1;
    if (c < 0) c = 0;
    if (c > 255) c = 255;
    return c;
  }
  
  this.drawFrm = function(timeStamp) {
    var obj = this;
    if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
    if ((timeStamp - obj.lastTimeStamp) > 150) {
      obj.lastTimeStamp = timeStamp;
      obj.ctx.fillStyle = "DeepSkyBlue";
      obj.ctx.fillRect(0, 0, obj.w, obj.h);
      obj.bgr.b = obj.getNewC(obj.bgr.b);
      obj.bgr.g = obj.getNewC(obj.bgr.g);
      obj.bgr.r = obj.getNewC(obj.bgr.r);

      obj.ctx.fillStyle = "rgb(" + obj.bgr.r + "," + obj.bgr.g + "," + obj.bgr.b + ")";
      obj.ctx.beginPath();
    
      for (var i = 0; i < obj.div; i++) {
        var rad = i * 2 * Math.PI / obj.div;
        var tmp_r = obj.r - (Math.random() * 5 - 2);
        var x = obj.cx + tmp_r * Math.cos(rad);
        var y = obj.cy + tmp_r * Math.sin(rad);

        // draw
        if (i == 0) {
          obj.ctx.moveTo(x, y);
        } else {
          obj.ctx.lineTo(x, y);
        }
      }
      obj.ctx.fill();
    }
  }
}

motionGraphics.landscape = function(el) {
  console.log(el.style);
  
  motionGraphics.runningObj = this.landscape;
  
  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  
  var positionInfo = el.getBoundingClientRect();
  cnv.width = positionInfo.width
  cnv.height = positionInfo.height;
  el.appendChild(cnv);

  var obj = this.landscape;
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.sun = new _sun(obj.w, obj.h, obj.w * Math.random(), obj.h * Math.random());
  //obj.mountain = new Mountain();
  //obj.trees = [];
  
  obj.drawFrm = function(timeStamp) {
    obj.sun.drawFrm(timeStamp);
  }
  
  requestAnimationFrame(obj.drawFrm);
}
