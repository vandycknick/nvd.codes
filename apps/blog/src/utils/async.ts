/* eslint-disable @typescript-eslint/no-explicit-any */
class HttpError extends Error {
  constructor(public statusCode: number, public msg: string) {
    super(msg)
  }
}

const fetchJSON = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }
  const data = await response.json()
  return data
}

type Resolver<T> = (value: T | PromiseLike<T>) => void
type Rejector<T> = (reason?: T) => void

class Deferred<T> implements Promise<T> {
  private _resolveSelf: Resolver<T> = Promise.resolve
  private _rejectSelf: Rejector<T> = Promise.reject
  private _promise: Promise<T>

  public constructor() {
    this._promise = new Promise<T>((resolve, reject): void => {
      this._resolveSelf = resolve
      this._rejectSelf = reject
    })
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): Promise<TResult1 | TResult2> {
    return this._promise.then(onfulfilled, onrejected)
  }

  public catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null,
  ): Promise<T | TResult> {
    return this._promise.catch(onrejected)
  }

  public finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    return this._promise.finally(onfinally)
  }

  public resolve(val: T): void {
    this._resolveSelf(val)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public reject(reason: any): void {
    this._rejectSelf(reason)
  }

  public [Symbol.toStringTag]: "Promise" = "Promise"
}

export { fetchJSON, Deferred }
