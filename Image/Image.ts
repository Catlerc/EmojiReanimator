import {RelativeImage} from "../RelativeImage"
import {GifFile} from "../Vendor.js"
import {Either, Left, Right} from "../Either.js";
import {ImageType, Milliseconds, Seconds, StaticImageType, Utils} from "../Domain.js";
import {AnimatedImage} from "./AnimatedImage.js";
import {StaticImage} from "./StaticImage.js";


export interface Frame {
    image: ImageData
    delay: Seconds
}


export abstract class Image {
    type: ImageType
    width: number
    height: number

    abstract frameByTime(time: Seconds): Frame

    static async fromImage(imageBuffer: ArrayBuffer, extension: string): Promise<Either<Error, Image>> {
        if (extension == "gif")
            return new Right(AnimatedImage.fromGIF(imageBuffer))
        if (extension in StaticImageType)
            return new Right(await StaticImage.fromStaticImage(imageBuffer, extension as unknown as StaticImageType))

        return new Left(new Error(`unsupported file extension '${extension}'`))
    }
}


