const Color = new (function () {
  const that = this;

  this.matplotlibJet = function (relVal) {
    const idx = Math.floor(relVal * 255);
    const r = Data.jetArr[idx][0];
    const g = Data.jetArr[idx][1];
    const b = Data.jetArr[idx][2];

    const rHex = Util.dec2Hex256(r * 255);
    const gHex = Util.dec2Hex256(g * 255);
    const bHex = Util.dec2Hex256(b * 255);

    return '#' + rHex + gHex + bHex;
  }


  /** 
   * Get Red, Green and Blue values [0~255] from color string such as 'rgb({r}, {g}, {b})' or '#F0E357'
   * @param colorString: string
   * @returns {{r: number, g: number, b:number}}: object
   */
  this.getRGB = function (colorString) {
    let r, g, b;
    if (colorString[0] === '#') {
      const rHex = colorString.slice(1, 3);
      const gHex = colorString.slice(3, 5);
      const bHex = colorString.slice(5, 7);
      r = Util.hex256toDec(rHex);
      g = Util.hex256toDec(gHex);
      b = Util.hex256toDec(bHex);
    } else if (colorString.slice(0, 4) === 'rgb(') {
      const colorNumbers = colorString.replace('rgb(', '').replace(')', '');
      const colorArr = colorNumbers.split(', ');
      r = parseInt(colorArr[0]);
      g = parseInt(colorArr[1]);
      b = parseInt(colorArr[2]);
    }
    return { r, g, b };
  }

  /** 
   * Article Title : arious colour spaces and colour space conversion algorithms.
   * Authors : Nishad, P. M., and R. Manicka Chezian
   * Journal : Journal of Global Research in Computer Science 4.1
   * Year : 2013
   * page : 44-48
   * https://pdfs.semanticscholar.org/bfcb/102f146009b8de3d61aecf1bce27311278f5.pdf
   * @param {{r: number, g: number, b:number}}: object
   * @returns {luminance}: number
   */
  this.getLuminance = function (rgb) {
    const k = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return Math.round(0.859 * k) + 16;
  }

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
