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
  this.div = getRndInt(12, 88);
  this.bgr = {r:190, g:50, b:50};
  this.lastTimeStamp = null;
    
  this.drawFrm = function(timeStamp) {
    if (!this.lastTimeStamp) this.lastTimeStamp = timeStamp;
    if ((timeStamp - this.lastTimeStamp) > 150) {
      this.lastTimeStamp = timeStamp;
      this.ctx.fillStyle = "DeepSkyBlue";
      this.ctx.fillRect(0, 0, this.w, this.h);
      this.bgr.b = prune(getRndInt(this.bgr.b - 4, 9));
      this.bgr.g = prune(getRndInt(this.bgr.g - 4, 9));
      this.bgr.r = prune(getRndInt(this.bgr.r - 4, 9));
            
      this.ctx.fillStyle = getRGBStr(this.bgr.r, this.bgr.g, this.bgr.b);
      this.ctx.beginPath();
    
      for (var i = 0; i < this.div; i++) {
        var rad = i * 2 * Math.PI / this.div;
        var tmp_r = getRndInt(this.r - 2, 5);
        var x = this.cx + tmp_r * Math.cos(rad);
        var y = this.cy + tmp_r * Math.sin(rad);

        // draw
        if (i == 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.fill();
    }
  }
}

function _land(ctx, w, h) {
  this.ctx = ctx;
  this.w = w;
  this.h = h;
  this.landHeight = h * 0.7;
  this.lastTimeStamp = null;
    
  this.drawFrm = function(timeStamp) {
    this.lastTimeStamp = timeStamp;
    this.ctx.fillStyle = "#CFAB3C";
    this.ctx.fillRect(0, this.landHeight, this.w, this.h);
  }
}
function _tree(ctx, w, h, sx, sy) {
  this.ctx = ctx;
  this.w = w;
  this.h = h;
  this.sx = sx;
  this.sy = sy;
  this.curParams = [];
  this.nextParams = [[sx, sy, Math.PI * 270 / 180, getRndInt(50, 13), 0]];
  this.goldenRatio = 1 / 1.618;
  this.maxDepth = getRndInt(3, 3);
  this.rootWidth = getRndInt(25, 6);
  this.branchColor = getRndColor(110, 24, 0, 48);
  this.drawLeaf = function(param) {
    let cx = param[0];
    let cy = param[1];
    let rad = param[2];
    let len = param[3];
    let depth = param[4];

    let toX = cx + Math.cos(rad) * len;
    let toY = cy + Math.sin(rad) * len;
    let r = Math.random() * 10 + 3;
    this.ctx.beginPath();
    this.ctx.arc(toX, toY, r, 0, 2 * Math.PI);
    this.ctx.strokeStyle="#aaa";
    this.ctx.lineWidth=2;
    this.ctx.fillStyle=getRndColor(0, 125, 0, 64);
    this.ctx.stroke();
    this.ctx.fill();
  }
      
  this.drawLine = function(param) {
    let cx = param[0];
    let cy = param[1];
    let rad = param[2];
    let len = param[3];
    let depth = param[4];

    let fromDepth = this.rootWidth - (this.rootWidth / this.maxDepth) * (depth - 1) + 2;
    let toDepth = this.rootWidth - (this.rootWidth / this.maxDepth) * depth + 2;
    let toX, toY;
    for (let _len = 0; _len <= len; _len++) {
      toX = cx + Math.cos(rad) * _len;
      toY = cy + Math.sin(rad) * _len;
      let width = fromDepth + (toDepth - fromDepth) * _len / len;
      this.ctx.beginPath();
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(toX, toY);
      this.ctx.lineWidth = width;
      this.ctx.strokeStyle = this.branchColor;
      this.ctx.stroke(); 
    }

    let depth1 = depth+1;
    if (depth < 6) {
      let rnd = getRndInt(0, 2);
      let len1 = len * ((rnd == 0) ? this.goldenRatio : 1);
      let len2 = len * ((rnd == 0) ? 1 : this.goldenRatio);
      let rad1 = rad - Math.PI * 15 / 180;
      let rad2 = rad + Math.PI * 15 / 180;

      this.nextParams.push([toX, toY, rad1, len1, depth1]);
      this.nextParams.push([toX, toY, rad2, len2, depth1]);
    } else {
      this.drawLeaf([toX, toY, rad, len, depth]);
    }    
  }
  
  this.drawFrm = function(timeStamp) {
    if (!this.lastTimeStamp) this.lastTimeStamp = timeStamp;
    if ((timeStamp - this.lastTimeStamp) > 200 & this.nextParams.length > 0) {
      this.lastTimeStamp = timeStamp;
      this.curParams = this.nextParams;
      this.nextParams = [];
      this.curParams.forEach(param=>{
        this.drawLine(param);
      });
    }
    return (this.nextParams.length == 0);
  }
}

motionGraphics.landscape = function(el) {
  console.log(el.style);
  
  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  
  var positionInfo = el.getBoundingClientRect();
  cnv.width = positionInfo.width
  cnv.height = positionInfo.height;
  el.appendChild(cnv);

  let obj = this.landscape;
  obj.objName = "landscape";
  this.runningObj = obj;
  
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.sun = new _sun(obj.ctx, obj.w, obj.h, getRndInt(0, obj.w), getRndInt(0, obj.h * 0.3), getRndInt(35, Math.min(cnv.width, cnv.height) * 0.3));
  obj.land = new _land(obj.ctx, obj.w, obj.h);
  obj.tree = new _tree(obj.ctx, obj.w, obj.h, getRndInt(0, obj.w), getRndInt(obj.h * 0.75, obj.h * 0.25));
  obj.treeCnt = 1;
  obj.treeMax = getRndInt(5, 15);
  obj.frmCount = 0;
  
  obj.drawFrm = function(timeStamp) {
    if (obj.frmCount < 250) {
      obj.sun.drawFrm(timeStamp);
      obj.land.drawFrm(timeStamp);
    } 
    else {
      let isFinished = obj.tree.drawFrm(timeStamp);
      if (isFinished && obj.treeCnt < obj.treeMax) {
        obj.tree = new _tree(obj.ctx, obj.w, obj.h, getRndInt(0, obj.w), getRndInt(obj.h * 0.75, obj.h * 0.25));
        obj.treeCnt++;
      }        
    }
    obj.frmCount++;
    if (motionGraphics.runningObj.objName == obj.objName)
      requestAnimationFrame(obj.drawFrm);
  }
  
  obj.drawFrm();
}
