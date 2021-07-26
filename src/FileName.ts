import {Option} from "./Utils/Option.js"

export class FileName {
  private constructor(public name: string, public extension: string) {
  }

  static fromBlobAndUrl(blob: Blob, url: string): Option<FileName> {
    const regex = /.+\/?([^.]+)/
    const maybeMatches = Option.fromValue(url.match(regex))
    const maybeName = maybeMatches.flatMap(matcher => Option.fromValue(matcher[1]))

    return maybeName.map(name => new FileName(name, blob.type.split('/')[1]))
  }

  static fromUrl(url: string): Option<FileName> {
    const regex = /.+\/?([^.]+)\.?(.+)?/
    const matches = url.match(regex)
    const maybeName = Option.fromValue(matches[1])
    const maybeExtension = Option.fromValue(matches[2])
    return maybeName.flatMap(name => maybeExtension.map(extension => new FileName(name, extension)))
  }

  static blobExtension(blob: Blob) {
    return blob.type.split('/')[1]
  }
}