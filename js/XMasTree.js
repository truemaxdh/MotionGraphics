if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

// light
function _light(cx_per, cy_per, r_per) {
  this.cx_per = cx_per;
  this.cy_per = cy_per;
  this.r_per = r_per;
  this.style = (Math.random() >= 0.5) ? "fill" : "stroke";
  this.getNewC = function(c) {
    return 80 + Math.random() * 176;
  }
  this.bgr = {r:this.getNewC(-1), g:this.getNewC(-1), b:this.getNewC(-1)};
}

// snow
function _snow(cx, cy, r, dy) {
  this.cx = cx;
  this.cy = cy;
  this.r = r;
  this.dy = dy;
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
  obj.snows = [];
  obj.cnt = Math.random() * 10 + 12;
  
  obj.drawFrm = function(timeStamp) {
    if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
    if ((timeStamp - obj.lastTimeStamp) > 30) {
      obj.lastTimeStamp = timeStamp;
      
      // clear
      obj.ctx.beginPath();
      obj.ctx.fillStyle="black";
      obj.ctx.rect(0, 0, obj.w, obj.h);
      obj.ctx.fill();
            
      var dw = obj.w / 100;
      var dh = obj.h / 100;
      
      obj.ctx.beginPath();
      var grd = obj.ctx.createLinearGradient(0, dh * 60, 0, dh * 100);
      grd.addColorStop(0, "bisque");
      grd.addColorStop(1, "Tan");
      obj.ctx.fillStyle = grd;
      obj.ctx.rect(0, dh * 80, dw * 100, dh * 20);
      obj.ctx.fill();
      
      obj.ctx.beginPath();
      obj.ctx.fillStyle = "Brown";
      obj.ctx.rect(dw * 50 - dw * 4, dh * 65, dw * 8, dh * 25);
      obj.ctx.fill();
      
      obj.ctx.beginPath();
      obj.ctx.fillStyle = "ForestGreen";
      for (var i = 0; i < 3; i++) {
        obj.ctx.moveTo(dw * 50, dh * 8.5 * (1 + i * 2));
        obj.ctx.lineTo(dw * 50 - dh * 4.5 * (i + 3), dh * 8.5 * (4 + i * 2));
        obj.ctx.lineTo(dw * 50 + dh * 4.5 * (i + 3), dh * 8.5 * (4 + i * 2));
      }
      obj.ctx.fill();
            
      if (obj.lights.length < 60) {
        var xy_per = [Math.random() * 100, Math.random() * 100];
        var p = obj.ctx.getImageData(xy_per[0] * dw, xy_per[1] * dh, 1, 1).data;
        console.log(p);
        if (p.join() == [34, 139, 34, 255].join()) {
          var r = 0.6 + Math.random();
          obj.lights.push( 
            new _light(xy_per[0], xy_per[1], r)
          );
        }
      }
      
      for (var i = 0; i < obj.lights.length; i++) {
        var b = obj.lights[i];

        // draw
        obj.ctx.beginPath();
        obj.ctx.lineWidth = 1 + Math.random() * Math.min(dw, dh) * 0.5;
        obj.ctx.strokeStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
        obj.ctx.arc(b.cx_per * dw, b.cy_per * dh, b.r_per * Math.min(dw, dh), 0, 2 * Math.PI);
        obj.ctx.stroke();
        if (b.style == "fill") {
          obj.ctx.beginPath();
          obj.ctx.fillStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx_per * dw, b.cy_per * dh, b.r_per * Math.min(dw, dh), 0, 2 * Math.PI);
          obj.ctx.fill();
        } 
        
        if (Math.random() < 0.08) {
          b.style = (b.style == "fill") ? "stroke" : "fill";
        }
      }
      
      obj.ctx.globalCompositeOperation = "lighter";
      obj.ctx.strokeStyle="#ccc";
      for (var i = 0; i < obj.snows.length; i++) {
        var b = obj.snows[i];
        obj.ctx.lineWidth = b.r * 0.7;
        for (var j = 0; j < 3; j++) {        
          obj.ctx.beginPath();
          var rad = j * Math.PI / 3;
          obj.ctx.moveTo(b.cx - Math.cos(rad) * b.r, b.cy - Math.sin(rad) * b.r);
          obj.ctx.lineTo(b.cx + Math.cos(rad) * b.r, b.cy + Math.sin(rad) * b.r);
          obj.ctx.stroke();
        }
        b.cy += b.dy;
        if (b.cy > obj.h) {
          obj.snows.splice(i--, 1);
        }
      }
      
      if (obj.snows.length < 100 && Math.random() < 0.2) {
      obj.snows.push( 
        new _snow(
          Math.random() * obj.w, 
          0,
          Math.min(obj.w, obj.h) * (Math.random() * 0.015 + 0.005),
          (obj.h * 0.005 + Math.random() * obj.h * 0.02)
        )
      );
      //console.log(obj.snows);
    }  
      obj.ctx.globalCompositeOperation = "source-over";
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
