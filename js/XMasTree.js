if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

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

function _snow(cx_per, cy_per, r_per, dy_per) {
  this.cx_per = cx_per;
  this.cy_per = cy_per;
  this.r_per = r_per;
  this.dy_per = dy_per;
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
      //obj.ctx.fillStyle = "bisque";
      var grd = obj.ctx.createLinearGradient(0, 0, 0, dh * 20);
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
        obj.ctx.lineTo(dw * 50 - dw * 3.5 * (i + 3), dh * 8.5 * (4 + i * 2));
        obj.ctx.lineTo(dw * 50 + dw * 3.5 * (i + 3), dh * 8.5 * (4 + i * 2));
      }
      obj.ctx.fill();
            
      if (obj.lights.length < 45) {
        var xy = [Math.random() * obj.w, Math.random() * obj.h];
        var p = obj.ctx.getImageData(xy[0], xy[1], 1, 1).data;
        console.log(p);
        if (p.join() == [34, 139, 34, 255].join()) {
          var r = Math.min(dw, dh) * (1 + Math.random());
          obj.lights.push( 
            new _light(xy[0], xy[1], r)
          );
        }
      }
      
      for (var i = 0; i < obj.lights.length; i++) {
        var b = obj.lights[i];

        // draw
        obj.ctx.beginPath();
        if (b.style == "fill") {
          obj.ctx.fillStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx_per * dx, b.cy_per * dy, b.r_per * Math.min(dw, dh), 0, 2 * Math.PI);
          obj.ctx.fill();
        } else {
          obj.ctx.strokeStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.arc(b.cx_per * dx, b.cy_per * dy, b.r_per * Math.min(dw, dh), 0, 2 * Math.PI);
          obj.ctx.stroke();
        }
        
        if (Math.random() < 0.05) {
          b.style = (b.style == "fill") ? "stroke" : "fill";
        }
      }
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
