interface EitherPart<L, R> {
    left: L
    right: R

    isLeft: boolean
    isRight: boolean

    mapLeft<B>(func: (left: L) => B): EitherPart<B, R>

    mapRight<B>(func: (right: R) => B): EitherPart<L, B>
}



export class Left<L, R> implements EitherPart<L, R> {
    left: L
    right: R = undefined

    isLeft: boolean = true
    isRight: boolean = false

    constructor(value: L) {
        this.left = value
    }

    mapLeft<B>(func: (left: L) => B): EitherPart<B, R> {
        return new Left(func(this.left))
    }

    mapRight<B>(func: (right: R) => B): EitherPart<L, B> {
        return new Left(this.left)
    }
}

export class Right<L, R> implements EitherPart<L, R> {
    left: L = undefined
    right: R

    isLeft: boolean = false
    isRight: boolean = true

    constructor(value: R) {
        this.right = value
    }

    mapLeft<B>(func: (left: L) => B): EitherPart<B, R> {
        return new Right(this.right)
    }

    mapRight<B>(func: (right: R) => B): EitherPart<L, B> {
        return new Right(func(this.right))
    }
}

export type Either<L, R> = Left<L, R> | Right<L, R>