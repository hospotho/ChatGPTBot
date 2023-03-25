export class logStack {
  private static _instance: logStack
  logs: Array<string>
  maxSize: number

  private constructor(_size: number) {
    this.logs = []
    this.maxSize = _size
  }

  public static getLogger(_size: number = 50) {
    return this._instance || (this._instance = new this(_size))
  }

  log(str: string) {
    if (this.logs.length === this.maxSize) this.logs.shift()
    this.logs.push(str)
    console.log(str)
  }
  getLog(size: number) {
    return this.logs.slice(Math.max(this.logs.length - size, 0))
  }
  clear() {
    this.logs = []
  }
}
