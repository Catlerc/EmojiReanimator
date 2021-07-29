import {Option} from "./Utils/Option.js"

export class BlobFetcher {
  static async fetch(url: string): Promise<Option<Blob>> {
    return fetch(url)
      .then(response => response.blob())
      .then(Option.some)
      .catch(_ => Option.none<Blob>())
  }
}