const Util = new function () {
    /**
     * Change Decimal Number to Hexadecimal (within 0 ~ 255)
     * @param dec
     * @returns {string}
     */
    this.dec2Hex256 = function (dec) {
        return (dec <= 16 ? '0' : '' ) + Math.floor(dec).toString(16);
    };

    /**
     * Change from [min, max] to [0, 1]
     * @param val
     * @param min
     * @param max
     */
    this.getRelativeVal = function (val, min, max) {
        return (val - min) / (max - min);
    };

    /**
     * Change from [0, 1] to [min, max]
     * @param ratio
     * @param min
     * @param max
     * @returns {*}
     */
    this.getAbsoluteVal = function (ratio, min, max) {
        return (max - min) * ratio + min;
    };

    this.getTime = function () {
        return new Date().getTime();
    };

    this.getTimeDiffFrom = function (fromTime) {
        const toTime = new Date().getTime();
        return (toTime - fromTime) / 1000; // milli second
    };

    this.equalElemInArray = function (_arr1, _arr2) {
        if (!Array.isArray(_arr1) || !Array.isArray(_arr2) || _arr1.length !== _arr2.length)
            return false;

        let arr1 = _arr1.concat().sort();
        let arr2 = _arr2.concat().sort();

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i])
                return false;
        }

        return true;
    };

    this.downloadJson = function (obj) {
        let strObj = JSON.stringify(obj);
        let blob = new Blob([strObj], { type: "text/plain;charset=utf-8" });
        // saveAs(blob, filename+".json");
    };

    return this;
};