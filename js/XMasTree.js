if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

function _light(cx, cy, r) {
  this.cx = cx;
  this.cy = cy;
  this.r = r;
  this.style = (Math.random() >= 0.5) ? "fill" : "stroke";
  this.getNewC = function(c) {
    return 80 + Math.random() * 176;
  }
  this.bgr = {r:this.getNewC(-1), g:this.getNewC(-1), b:this.getNewC(-1)};
}

motionGraphics.xMasTree = function(el) {
  console.log(el.style);
  
  motionGraphics.runningObj = this.xMasTree;
  
  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  cnv.width = cnv.style.width.replace("px","");
  cnv.height = cnv.style.height.replace("px","");
  el.appendChild(cnv);

  var obj = this.xMasTree;
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.lights = [];
  obj.cnt = Math.random() * 10 + 12;
  console.log(obj.w);
  for (var i = 0; i < obj.cnt; i++) {
    var r = Math.min(obj.w, obj.h) / 50 * (1 + Math.random());
    obj.lights.push( 
      new _balloon(
        Math.random() * obj.w, 
        Math.random() * obj.h,
        r
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
      
      obj.ctx.beginPath();
      obj.ctx.fillStyle = "ForestGreen";
      var dw = obj.w / 100;
      var dh = obj.h / 100;
      for (var i = 0; i < 3; i++) {
        obj.ctx.moveTo(dw * 50, dh * 8 * (1 + i * 2));
        obj.ctx.lineTo(dw * 50 - dw * 3 * (i + 3), dh * 8 * (4 + i * 2));
        obj.ctx.lineTo(dw * 50 + dw * 3 * (i + 3), dh * 8 * (4 + i * 2));
      }
      obj.ctx.fill();
      
      obj.ctx.beginPath();
      obj.ctx.fillStyle = "Brown";
      obj.ctx.rect(obj.w / 2 - obj.w / 20, obj.h / 15 * (3 * 3 + 1), obj.w / 10, obj.h / 15 * 3);
      obj.ctx.fill();
      
      for (var i = 0; i < obj.lights.length; i++) {
        var b = obj.lights[i];

        // draw
        obj.ctx.beginPath();
        if (b.style == "fill") {
          obj.ctx.fillStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx, b.cy, b.r, 0, 2 * Math.PI);
          obj.ctx.fill();
        } else {
          obj.ctx.strokeStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx, b.cy, b.r, 0, 2 * Math.PI);
          obj.ctx.stroke();
        }
        
        if (Math.random() < 0.1) {
          b.style = (b.style == "fill") ? "stroke" : "fill";
        }
      }
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
