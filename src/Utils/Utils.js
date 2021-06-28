var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { fabric } from "../Vendor.js";
var Utils = (function () {
    function Utils() {
    }
    Utils.arrayBufferToUrl = function (imageBuffer, type) {
        var blob = new Blob([imageBuffer], { type: "image/" + type.toString() });
        var urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(blob);
    };
    Utils.createCanvas = function (width, height) {
        var renderer = document.createElement("canvas");
        renderer.width = width;
        renderer.height = height;
        return new fabric.Canvas(renderer);
    };
    Utils.imageDataToDataUrl = function (imageData) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    };
    Utils.imageBlobToDataUrl = function (imageBlob) {
        var urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(imageBlob);
    };
    Utils.fabricImageFromDataUrl = function (imageUrl) {
        return new Promise(function (resolve) { return fabric.Image.fromURL(imageUrl, resolve); });
    };
    Utils.fold = function (array, init, reducer) {
        var acc = init;
        for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
            var x = array_1[_i];
            acc = reducer(acc, x);
        }
        return acc;
    };
    Utils.asyncFold = function (array, init, reducer) {
        return __awaiter(this, void 0, void 0, function () {
            var acc, _i, array_2, x;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acc = init;
                        _i = 0, array_2 = array;
                        _a.label = 1;
                    case 1:
                        if (!(_i < array_2.length)) return [3, 4];
                        x = array_2[_i];
                        return [4, reducer(acc, x)];
                    case 2:
                        acc = _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, acc];
                }
            });
        });
    };
    return Utils;
}());
export { Utils };
//# sourceMappingURL=Utils.js.map