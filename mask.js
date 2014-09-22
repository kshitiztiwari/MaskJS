(function(undefined) {
    "use strict";

    var srcImg, maskImg, srcCanvas, maskCanvas, srcContext, maskContext;
    srcCanvas = maskCanvas = document.createElement('canvas');
    srcContext = srcCanvas.getContext('2d');
    maskContext = maskCanvas.getContext('2d');

    var Util = {};
    Util.extend = function(out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }
        return out;
    };

    if (window.console === undefined) {
        window.console = {};
        console.log = function() {};
    }

    window.Mask = (function() {
        Mask.about = {
            version: "1.0.0",
            date: "09/17/2014"
        };

        function imgReady(srcI, maskI, id, c) {
            var height, width, srcImgData, maskImgData, maskData, dataLength, srcData, brightness;

            height = srcI.height;
            width = srcI.width;

            srcCanvas.height = height;
            maskCanvas.height = height;

            srcCanvas.width = width;
            maskCanvas.width = width;

            srcContext.drawImage(srcI, 0, 0);
            srcData = srcContext.getImageData(0, 0, width, height);
            srcImgData = srcData.data;

            maskContext.drawImage(maskI, 0, 0);
            maskData = maskContext.getImageData(0, 0, width, height);
            maskImgData = maskData.data;

            dataLength = maskImgData.length;

            if (c == 1) {
                for (var i = 0, temp = 0, maskAlphaCorrection = 1, srcAlphaCorrection = 1, data = 0; i < dataLength; i += 4) {
                    maskAlphaCorrection = (maskImgData[i + 3] / 255);
                    srcAlphaCorrection = (srcImgData[i + 3] / 255);
                    srcImgData[i + 3] = maskImgData[i] * maskAlphaCorrection * srcAlphaCorrection;
                }
            } else {
                for (var i = 0, temp = 0, maskAlphaCorrection = 1, srcAlphaCorrection = 1, data = 0; i < dataLength; i += 4) {
                    brightness = 0.2126 * maskImgData[i] + 0.7152 * maskImgData[i + 1] + 0.0722 * maskImgData[i + 2];
                    maskAlphaCorrection = (maskImgData[i + 3] / 255);
                    srcAlphaCorrection = (srcImgData[i + 3] / 255);
                    srcImgData[i + 3] = brightness * maskAlphaCorrection * srcAlphaCorrection;
                }
            }

            srcContext.putImageData(srcData, 0, 0);

            //document.getElementById("canvas").appendChild( srcCanvas );
            id.parentElement.replaceChild(srcCanvas, id);
            console.log("done");
        }

        function Mask(opt) {
            var options, s, i;

            options = {
                confidence: 1
            }

            if (opt !== undefined) {
                Util.extend(options, opt);
            } else {
                throw ("Options not provided.");
            }

            if (!!!options.id) {
                throw ("No ID provided");
            }

            if (!!!options.mask) {
                throw ("Mask source not provided");
            }

            try {
                console.log("try");
                i = document.getElementById(options.id);
                s = i.src;
            } catch (e) {
                console.log("Problem with image source. Aborting!!", e.message);
                return;
            }

            srcImg = new Image;
            maskImg = new Image;

            srcImg.onerror = function(e) {
                throw ("Error loading source image");
            }

            maskImg.onerror = function(e) {
                throw ("Error loading mask image");
            }

            srcImg.onload = function() {
                console.log("Source Image loaded \nLoading Mask image");
                maskImg.crossOrigin = "anonymous";
                maskImg.src = options.mask;
            }

            maskImg.onload = function() {
                console.log("Both Images loaded");
                imgReady(srcImg, maskImg, i, options.confidence);
            }

            srcImg.src = s;
        }
        return Mask;
    })();
})();