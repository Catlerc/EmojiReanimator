export type Milliseconds = number
export type Seconds = number
export type DataUrl = string

export enum ImageType {
  gif,
  png,
  jpeg,
  jpg
}

export enum StaticImageType {
  png,
  jpeg,
  jpg
}

export interface KeyValuePair<K, V> {
  key: K
  value: V
}

