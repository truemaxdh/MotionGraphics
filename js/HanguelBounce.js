if (typeof motionGraphics === 'undefined' || !specialEffects) {
  motionGraphics = {};
}

function _bubble(consonant, cx, cy, r, dx, dy, style) {
  this.consonant = consonant;
  this.cx = cx;
  this.cy = cy;
  this.r = r;
  this.dx = dx;
  this.dy = dy;
  this.style = style;
  this.getNewC = function(c) {
    if (c == -1)
      return Math.random() * 256;
    c += Math.random() * 5 - 2;
    if (c < 127) c = 127;
    if (c > 255) c = 255;
    return c;
  }
  this.bgr = {r:this.getNewC(-1), g:this.getNewC(-1), b:this.getNewC(-1)};
}

motionGraphics.hanguelBounce = function(el) {
  console.log(el.style);

  var cnv = document.createElement("CANVAS");
  cnv.style.position = "relative";
  cnv.style.width = el.style.width;
  cnv.style.height = el.style.height;
  cnv.id = "cnv";
  cnv.width = cnv.style.width.replace("px","");
  cnv.height = cnv.style.height.replace("px","");
  el.appendChild(cnv);

  var obj = this.hanguelBounce;
  obj.ctx = cnv.getContext("2d");
  obj.w = cnv.width;
  obj.h = cnv.height;
  obj.lastTimeStamp = null;
  obj.bubbles = [];
  obj.cnt = Math.random() * 10 + 12;
  
  for (var i = 0; i < obj.cnt; i++) {
    obj.bubbles.push( 
      new _bubble(
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

      for (var i = 0; i < obj.bubbles.length; i++) {
        var b = obj.bubbles[i];

        // draw
        obj.ctx.beginPath();
        //obj.ctx.globalAlpha = 0.8;
        obj.ctx.shadowBlur = 5;
        obj.ctx.shadowColor = "white";
        //obj.ctx.lineWidth = 3;
        //obj.ctx.arc(b.cx, b.cy, b.r, 0, 2 * Math.PI);
        //obj.ctx.stroke();
        //obj.ctx.fillStyle = "red";
        if (b.style == "fill") {
          obj.ctx.fillStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.font = (2 * b.r) + "px Comic Sans MS";
          obj.ctx.textAlign = "center";
          obj.ctx.fillText(b.consonant, b.cx, b.cy);
        } else {
          obj.ctx.strokeStyle = "rgb(" + b.bgr.r + "," + b.bgr.g + "," + b.bgr.b + ")";
          obj.ctx.font = (2 * b.r) + "px Comic Sans MS";
          obj.ctx.textAlign = "center";
          obj.ctx.strokeText(b.consonant, b.cx, b.cy);
        }

        // collision
        for (var j = i + 1; j < obj.bubbles.length; j++) {
          var b2 = obj.bubbles[j];
          var nCx1 = b.cx + b.dx;
          var nCy1 = b.cy + b.dy;
          var nCx2 = b2.cx + b2.dx;
          var nCy2 = b2.cy + b2.dy;
          var d_sqr = (nCx2 - nCx1)*(nCx2 - nCx1) + (nCy2 - nCy1)*(nCy2 - nCy1);
          var d_chk = (b.r + b2.r)*(b.r + b2.r); 
          if (d_sqr < d_chk) {
            var tmp = b.dx + 0;
            b.dx = b2.dx;
            b2.dx = tmp;
            tmp = b.dy + 0;
            b.dy = b2.dy;
            b2.dy = tmp;
            b.bgr = {r:b.getNewC(b.bgr.r), g:b.getNewC(b.bgr.g), b:b.getNewC(b.bgr.b)};
            b2.bgr = {r:b2.getNewC(b2.bgr.r), g:b2.getNewC(b2.bgr.g), b:b2.getNewC(b2.bgr.b)};
            b.style = (Math.random() >= 0.5) ? "fill" : "stroke";
            b2.style = (Math.random() >= 0.5) ? "fill" : "stroke"
          }
          if (d_sqr < (d_chk / 4)) {
            if (b.cx < b2.cx)  {b.cx -= b.r; b2.cx += b2.r;} else {b2.cx -= b2.r; b.cx += b.r;}   
          }
        }
        if ((b.cx + b.dx) < 0 || (b.cx + b.dx) >=  obj.w) b.dx *= -1;
        if ((b.cy + b.dy) < 0 || (b.cy + b.dy) >=  obj.h) b.dy *= -1;
        b.cx += b.dx;
        b.cy += b.dy;
      }
    }
    
    requestAnimationFrame(obj.drawFrm);
  }
  obj.drawFrm();  
}
