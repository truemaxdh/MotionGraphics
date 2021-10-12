if (typeof motionGraphics === 'undefined' || !motionGraphics) {
  motionGraphics = {};
}

function _sun(ctx, w, h, cx, cy, r) {
  this.ctx = ctx;
  this.w = w;
  this.h = h;
  this.cx = cx;
  this.cy = cy;
  this.r = r;
  this.div = Math.floor(12 + 58 * Math.random()) * 2;
  this.bgr = {r:200, g:0, b:0};
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

function _tree(ctx, w, h, sx, sy) {
  this.ctx = ctx;
  this.w = w;
  this.h = h;
  this.sx = sx;
  this.sy = sy;
  this.curParams = [];
  this.nextParams = [[sx, sy, Math.PI * 270 / 180, 90, 0]];
  
  this.drawLeaf = function() {
    curParams.foreach(param=>{
      let cx = param[0];
      let cy = param[1];
      let rad = param[2];
      let len = param[3];
      let depth = param[4];
      
      let toX = cx + Math.cos(rad) * len;
      let toY = cy + Math.sin(rad) * len;
      let r = Math.random() * 20 + 5;
      let c0 = parseInt(Math.random() * 7);
      let c1 = parseInt(Math.random() * 7 + 9);
      let c2 = parseInt(Math.random() * 7);
      //console.log("#" + c0.toString(16) + c1.toString(16) + c2.toString(16));
      this.ctx.beginPath();
      this.ctx.arc(toX, toY, r, 0, 2 * Math.PI);
      this.ctx.strokeStyle="#aaa";
      this.ctx.lineWidth=2;
      this.ctx.fillStyle="#" + c0.toString(16) + c1.toString(16) + c2.toString(16);
      this.ctx.stroke();
      this.ctx.fill();
    });
  }
      
  this.drawLine = function() {
    curParams.foreach(param=>{
      let cx = param[0];
      let cy = param[1];
      let rad = param[2];
      let len = param[3];
      let depth = param[4];
      
      let fromDepth = 40 - 7 * (depth - 1);
      let toDepth = 40 - 7 * depth;
      let dDepth = (toDepth - fromDepth) / len;
      let toX, toY;
      for (let _len = 0; _len <= len; _len++) {
        toX = cx + Math.cos(rad) * _len;
        toY = cy + Math.sin(rad) * _len;
        let width = fromDepth + dDepth * _len;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(toX, toY);
        this.ctx.lineWidth = width;
        this.ctx.strokeStyle="#731100";
        this.ctx.stroke(); 
      }
      
      let depth1 = depth+1;
      if (depth < 6) {
        let rnd = Math.floor(Math.random() * 2);
        let len1 = len * ((rnd == 0) ? this.goldenRatio : 1);
        let len2 = len * ((rnd == 0) ? 1 : this.goldenRatio);
        let rad1 = rad - Math.PI * 20 / 180;
        let rad2 = rad + Math.PI * 20 / 180;
        
        nextParams.push([toX, toY, rad1, len1, depth1]);
        //var tmr = setTimeout(function() {drawLine(toX, toY, rad1, len1, depth1)}, tm);
        nextParams.push([toX, toY, rad2, len2, depth1]);
        //tmr = setTimeout(function() {drawLine(toX, toY, rad2, len2, depth1)}, tm);
      } else {
        this.drawLeaf();
      }
    });
  }
  
  this.drawFrm = function(timeStamp) {
    if (!this.lastTimeStamp) this.lastTimeStamp = timeStamp;
    if ((timeStamp - this.lastTimeStamp) > 200) {
      this.curParams = this.nextParams;
      this.nextParams = [];
      this.drawLine();
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
  obj.sun = new _sun(obj.ctx, obj.w, obj.h, obj.w * Math.random(), obj.h * Math.random(), 50 + (Math.min(cnv.width, cnv.height) * 0.5 - 50) * Math.random());
  obj.tree = new _tree(obj.ctx, obj.w, obj.h, obj.w * Math.random(), obj.h * Math.random());
  obj.frmCount = 0;
  
  obj.drawFrm = function(timeStamp) {
    if (obj.frmCount < 500)
      obj.sun.drawFrm(timeStamp);
    else
      obj.tree.drawFrm(timeStamp);
    obj.frmCount++;
    requestAnimationFrame(obj.drawFrm);
  }
  
  obj.drawFrm();
}
