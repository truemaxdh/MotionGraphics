let fullScreen = false;
let canvasRect = null;
function toggleFullScreen() {
  const el = document.getElementById("board");
  const obj = motionGraphics.runningObj;
  const cnv = obj.ctx.canvas;
  if (canvasRect == null) {
    canvasRect = cnv.getBoundingClientRect();
  }
  let w, h;
  if (fullScreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
    w = canvasRect.width;
    h = canvasRect.height;
    fullScreen = false;
  } else {
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) { /* Safari */
      el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) { /* IE11 */
      el.msRequestFullscreen();
    }      
    w = screen.width;
    h = screen.height;
    fullScreen = true;
  }
  cnv.style.width = w + "px";
  cnv.style.height = h + "px";
  cnv.width = cnv.style.width.replace("px","");
  cnv.height = cnv.style.height.replace("px","");
  obj.w = cnv.width;
  obj.h = cnv.height;
}
