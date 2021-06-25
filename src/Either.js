var Left = (function () {
    function Left(value) {
        this.right = undefined;
        this.isLeft = true;
        this.isRight = false;
        this.left = value;
    }
    Left.prototype.mapLeft = function (func) {
        return new Left(func(this.left));
    };
    Left.prototype.mapRight = function (func) {
        return new Left(this.left);
    };
    return Left;
}());
export { Left };
var Right = (function () {
    function Right(value) {
        this.left = undefined;
        this.isLeft = false;
        this.isRight = true;
        this.right = value;
    }
    Right.prototype.mapLeft = function (func) {
        return new Right(this.right);
    };
    Right.prototype.mapRight = function (func) {
        return new Right(func(this.right));
    };
    return Right;
}());
export { Right };
//# sourceMappingURL=Either.js.map