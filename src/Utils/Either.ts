abstract class EitherPart<L, R> {
  left: L
  right: R

  isLeft: boolean
  isRight: boolean

  abstract mapLeft<B>(func: (left: L) => B): EitherPart<B, R>

  abstract mapRight<B>(func: (right: R) => B): EitherPart<L, B>

  fold<B>(ifLeft: (left: L) => B, ifRight: (right: R) => B) {
    if (this.isLeft)
      return ifLeft(this.left)
    else
      return ifRight(this.right)
  }
}


export class Left<L, R> extends EitherPart<L, R> {
  left: L
  right: R = undefined

  isLeft: boolean = true
  isRight: boolean = false

  constructor(value: L) {
    super()
    this.left = value
  }

  mapLeft<B>(func: (left: L) => B): EitherPart<B, R> {
    return new Left(func(this.left))
  }

  mapRight<B>(func: (right: R) => B): EitherPart<L, B> {
    return new Left(this.left)
  }
}

export class Right<L, R> extends EitherPart<L, R> {
  left: L = undefined
  right: R

  isLeft: boolean = false
  isRight: boolean = true

  constructor(value: R) {
    super()
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