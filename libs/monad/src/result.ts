/* eslint-disable @typescript-eslint/no-unused-vars */
abstract class BaseResult<T, E> {
  abstract readonly type: "Ok" | "Err"

  isOk(): this is Ok<T, E> {
    return this.type === "Ok"
  }

  isErr(): this is Err<T, E> {
    return this.type === "Err"
  }
}

export class Ok<T, E> extends BaseResult<T, E> {
  static create<T, E>(value: T): Ok<T, E> {
    return new Ok<T, E>(value)
  }

  readonly type = "Ok" as const

  private constructor(private readonly value: T) {
    super()
  }

  andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
    return fn(this.value)
  }

  map<U>(fn: (val: T) => U): Result<U, E> {
    return new Ok(fn(this.value))
  }

  mapOrElse<U>(fn: (value: T) => U, _fne: (value: E) => U): U {
    return fn(this.value)
  }

  orElse<U>(_fn: (err: E) => Result<U, E>): Result<U | T, E> {
    return new Ok(this.value)
  }

  unwrap(): T {
    return this.value
  }
}

export class Err<T, E> extends BaseResult<T, E> {
  static create<T, E>(value: E): Err<T, E> {
    return new Err<T, E>(value)
  }

  readonly type = "Err" as const

  private constructor(private readonly value: E) {
    super()
  }

  andThen<U>(_fn: (val: T) => Result<U, E>): Result<U, E> {
    return new Err(this.value)
  }

  map<U>(_fn: (val: T) => U): Result<U, E> {
    return new Err<U, E>(this.value)
  }

  mapOrElse<U>(_fn: (value: T) => U, fne: (value: E) => U): U {
    return fne(this.value)
  }

  orElse<U>(fn: (err: E) => Result<U, E>): Result<U | T, E> {
    return fn(this.value)
  }

  unwrapErr(): E {
    return this.value
  }
}

export type Result<T, E> = Ok<T, E> | Err<T, E>

export const ok = Ok.create
export const err = Err.create

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { None, Some, Option } from "./option"

// export interface MatchResult<T, E, U> {
//   ok: (val: T) => U
//   err: (val: E) => U
// }

// export interface Result<T, E> {
//   _type: string
//   isOk(): this is Ok<T, E>
//   isErr(): this is Err<T, E>
//   ok(): Option<T>
//   err(): Option<E>
//   unwrapOr(optb: T): T
//   unwrapOrElse(fn: (err: E) => T): T
//   match<U>(fn: MatchResult<T, E, U>): U
//   map<U>(fn: (val: T) => U): Result<U, E>
//   mapErr<U>(fn: (err: E) => U): Result<T, U>
//   andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>
//   orElse<U>(fn: (err: E) => Result<U, E>): Result<T, E> | Result<U, E>
// }

// export interface Ok<T, E> extends Result<T, E> {
//   unwrap(): T
//   unwrapOr(optb: T): T
//   unwrapOrElse(fn: (err: E) => T): T
//   match<U>(fn: MatchResult<T, never, U>): U
//   map<U>(fn: (val: T) => U): Ok<U, never>
//   mapErr<U>(fn: (err: E) => U): Ok<T, never>
//   andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E>
//   orElse<U>(fn: (err: E) => Result<U, E>): Result<T, E>
// }

// export interface Err<T, E> extends Result<T, E> {
//   unwrapOr(optb: T): T
//   unwrapOrElse(fn: (err: E) => T): T
//   unwrapErr(): E
//   match<U>(fn: MatchResult<never, E, U>): U
//   map<U>(fn: (val: T) => U): Err<never, E>
//   mapErr<U>(fn: (err: E) => U): Err<never, U>
//   andThen<U>(fn: (val: T) => Result<U, E>): Err<never, E>
//   orElse<U>(fn: (err: E) => Result<U, E>): Result<U, E>
// }

// export class OkImpl<T, E> implements Ok<T, E> {
//   static create<T, E>(value: T): Ok<T, E> {
//     return new OkImpl(value)
//   }
//   readonly _type = "Ok" as const
//   private constructor(readonly value: T) {}

//   isOk(): this is Ok<T, E> {
//     return true
//   }

//   isErr(): this is Err<T, E> {
//     return !this.isOk()
//   }

//   ok(): Option<T> {
//     return Some(this.value)
//   }

//   err(): Option<E> {
//     return None()
//   }

//   unwrap(): T {
//     return this.value
//   }

//   unwrapOr(_optb: T): T {
//     return this.value
//   }

//   unwrapOrElse(_fn: (err: E) => T): T {
//     return this.value
//   }

//   match<U>(matchObject: MatchResult<T, never, U>): U {
//     return matchObject.ok(this.value)
//   }

//   map<U>(fn: (val: T) => U): Ok<U, never> {
//     return new OkImpl(fn(this.value))
//   }

//   mapErr<U>(_fn: (err: E) => U): Ok<T, never> {
//     return new OkImpl(this.value)
//   }

//   andThen<U>(fn: (val: T) => Result<U, E>): Result<U, E> {
//     return fn(this.value)
//   }

//   orElse<U>(_fn: (err: E) => Result<U, E>): Result<T, E> {
//     return new OkImpl(this.value)
//   }
// }

// export class ErrImpl<T, E> implements Err<T, E> {
//   static create<T, E>(err: E): Err<T, E> {
//     return new ErrImpl(err)
//   }

//   readonly _type = "Error" as const
//   private constructor(readonly value: E) {}

//   isOk(): this is Ok<T, E> {
//     return false
//   }

//   isErr(): this is Err<T, E> {
//     return !this.isOk()
//   }

//   ok(): Option<T> {
//     return None()
//   }

//   err(): Option<E> {
//     return Some(this.value)
//   }

//   unwrapOr(optb: T): T {
//     return optb
//   }

//   unwrapOrElse(fn: (err: E) => T): T {
//     return fn(this.value)
//   }

//   unwrapErr(): E {
//     return this.value
//   }

//   match<U>(matchObject: MatchResult<T, E, U>): U {
//     return matchObject.err(this.value)
//   }

//   map<U>(_fn: (val: T) => U): Err<never, E> {
//     return new ErrImpl(this.value)
//   }

//   mapErr<U>(fn: (err: E) => U): Err<never, U> {
//     return new ErrImpl(fn(this.value))
//   }

//   andThen<U>(_fn: (val: T) => Result<U, E>): Err<never, E> {
//     return new ErrImpl(this.value)
//   }

//   orElse<U>(fn: (err: E) => Result<U, E>): Result<U, E> {
//     return fn(this.value)
//   }
// }

// export const Ok = OkImpl.create

// export const Err = ErrImpl.create
