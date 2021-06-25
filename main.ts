import {fabric} from "./Vendor.js"
import {createEmoji, createEmojiDynamic} from "./Emoji.js"
import {Image} from "./Image/Image.js";
import {AnimatedImage} from "./Image/AnimatedImage";

fabric.Object.prototype.transparentCorners = false

var input = document.getElementById('file-input')
// @ts-ignore
input.addEventListener('change', (event: any) => {
    const fileList = event.target.files
    const file: File = fileList.item(0)
    const reader = new FileReader()
    reader.onloadend = async () => {
        const image = await Image.fromImage(reader.result as ArrayBuffer, file.name.split('.').pop())
        createEmojiDynamic(
            {
                width: 64,
                height: 64,
                fps: 60,
                length: 1
            },
            image.right as AnimatedImage, //???
            async (canvas, relativeImage, time, timeNormalized) => {
                let image = await relativeImage.getFabricImage(time)
                const clone = await image.copy()

                image.setPos(timeNormalized + relativeImage.width / 2, 0.5)
                clone.setPos((timeNormalized - 1) + relativeImage.width / 2, 0.5)

                canvas.add(image.underlying)
                canvas.add(clone.underlying)

            }
        ).then(emoji => {
                const output = <HTMLImageElement>document.getElementById('output')
                output.src = URL.createObjectURL(emoji)
            }
        )


    }
    reader.readAsArrayBuffer(file)

})
