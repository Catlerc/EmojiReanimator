import {Option} from "./Utils/Option.js"

export class BlobFetcher {
  static async justFetch(url: string): Promise<Option<Blob>> {
    return fetch(url)
      .then(response => response.blob())
      .then(Option.some)
      .catch(_ => Option.none<Blob>())
  }

  static async proxyFetch(url: string): Promise<Option<Blob>> {
    const request: Request = new Request("https://cors-anywhere.herokuapp.com/" + url, {
      headers: [["Origin", "*"]]
    })
    return fetch(request)
      .then(response => response.blob())
      .then(Option.some)
      .catch(_ => Option.none<Blob>())
  }

  static async fetch(url: string): Promise<Option<Blob>> {
    const maybeBlob = await this.justFetch(url)
    return maybeBlob.orElse(await this.proxyFetch(url))
  }
}