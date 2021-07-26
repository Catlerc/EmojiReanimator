import { Option } from "./Utils/Option.js";
var FileName = (function () {
    function FileName(name, extension) {
        this.name = name;
        this.extension = extension;
    }
    FileName.fromBlobAndUrl = function (blob, url) {
        var regex = /.+\/?([^.]+)/;
        var maybeMatches = Option.fromValue(url.match(regex));
        var maybeName = maybeMatches.flatMap(function (matcher) { return Option.fromValue(matcher[1]); });
        return maybeName.map(function (name) { return new FileName(name, blob.type.split('/')[1]); });
    };
    FileName.fromUrl = function (url) {
        var regex = /.+\/?([^.]+)\.?(.+)?/;
        var matches = url.match(regex);
        var maybeName = Option.fromValue(matches[1]);
        var maybeExtension = Option.fromValue(matches[2]);
        return maybeName.flatMap(function (name) { return maybeExtension.map(function (extension) { return new FileName(name, extension); }); });
    };
    FileName.blobExtension = function (blob) {
        return blob.type.split('/')[1];
    };
    return FileName;
}());
export { FileName };
//# sourceMappingURL=FileName.js.map