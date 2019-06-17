const Color = new (function () {
  const that = this;
  /**
   * 0 ~ 1 사이의 값을 입력 받아 jet colormap의 RGB값을 반환한다.
   * 각각의 함수는 MatLab의 Jet 팔레트 설명에 따라 작성하였다.
   */
  this.matlabJet = function (relVal) {
    const greyVal = (relVal - 0.5) * 2;  // -1 ~ +1
    const r = that.red(greyVal);
    const g = that.green(greyVal);
    const b = that.blue(greyVal);

    const rHex = Util.dec2Hex256(r * 255);
    const gHex = Util.dec2Hex256(g * 255);
    const bHex = Util.dec2Hex256(b * 255);

    return '#' + rHex + gHex + bHex;
  }

  this.interpolate = function (val, y0, x0, y1, x1) {
    return (val - x0) * (y1 - y0) / (x1 - x0) + y0;
  }

  this.base = function (val) {
    if (val <= -0.75) return 0;
    else if (val <= -0.25) return that.interpolate(val, 0.0, -0.75, 1.0, -0.25);
    else if (val <= 0.25) return 1.0;
    else if (val <= 0.75) return that.interpolate(val, 1.0, 0.25, 0.0, 0.75);
    else return 0.0;
  }

  this.red = function (grey) {
    return that.base(grey - 0.5);
  }

  this.green = function (grey) {
    return that.base(grey);
  }

  this.blue = function (grey) {
    return that.base(grey + 0.5);
  }
});
