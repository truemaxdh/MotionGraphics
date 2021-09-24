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

function _tree = function(ctx, w, h, cx, cy) {
  this.ctx = ctx;
  this.w = w;
  this.h = h;
  this.cx = cx;
  this.cy = cy;
  this.rad0 = Math.PI * 270 / 180;
  this.len0 = 90;
  this.depth0 = 0;
  
  this.drawLeaf = function(x, y, rad, len) {
    var toX = x + Math.cos(rad) * len;
    var toY = y + Math.sin(rad) * len;
    var r = Math.random() * 20 + 5;
    var c0 = parseInt(Math.random() * 7);
    var c1 = parseInt(Math.random() * 7 + 9);
    var c2 = parseInt(Math.random() * 7);
    ctx.beginPath();
    ctx.arc(toX, toY, r, 0, 2 * Math.PI);
    ctx.strokeStyle="#aaa";
    ctx.lineWidth=2;
    ctx.fillStyle="#" + c0.toString(16) + c1.toString(16) + c2.toString(16);
    ctx.stroke();
    ctx.fill();
  }
      
  this.drawLine = function(x, y, rad, len) {
    var depth = this.depth;
    var fromDepth = 40 - 7 * (depth - 1);
    var toDepth = 40 - 7 * depth;
    var dDepth = (toDepth - fromDepth) / len;
    for (var _len = 0; _len <= len; _len++) {
      var toX = x + Math.cos(rad) * _len;
      var toY = y + Math.sin(rad) * _len;
      var width = fromDepth + dDepth * _len;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(toX, toY);
      ctx.lineWidth = width;
      ctx.strokeStyle="#731100";
      ctx.stroke();  
    }
    
    this.depth++;
  }
  
  this.drawFrm = function(timeStamp) {
    if (!obj.lastTimeStamp) obj.lastTimeStamp = timeStamp;
    if ((timeStamp - obj.lastTimeStamp) > 200) {
      var depth = this.depth;
      if (depth < 6) {
        var goldenRatio = 1 / 1.618;
        var rnd = Math.floor(Math.random() * 2);
        var len1 = len * ((rnd == 0) ? goldenRatio : 1);
        var len2 = len * ((rnd == 0) ? 1 : goldenRatio);
        var rad1 = rad - Math.PI * 20 / 180;
        drawLine(toX, toY, rad1, len1, depth1);

        var rad2 = rad + Math.PI * 20 / 180;
        drawLine(toX, toY, rad2, len2, depth1);
      } else {
        drawLeaf(x, y, rad, len, depth);
      }
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
  obj.sun = new _sun(obj.ctx, obj.w, obj.h, obj.w * Math.random(), obj.h * Math.random(), 50 + (Math.min(cnv.width, cnv.height) - 50) * Math.random());
  obj.tree = new _tree(obj.ctx, obj.w, obj.h, obj.w * Math.random(), obj.h * Math.random());
  //obj.mountain = new Mountain();
  //obj.trees = [];
  obj.frmCount = 0;
  
  obj.drawFrm = function(timeStamp) {
    if (obj.frmCount < 500)
      obj.sun.drawFrm(timeStamp);
    else
      obj.tree.drawFrm(timeStamp);
    requestAnimationFrame(obj.drawFrm);
  }
  
  obj.drawFrm();
}
