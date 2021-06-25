import {fabric} from "./Vendor.js"
import {createEmoji} from "./Emoji.js"
import {AnimatedImage} from "./AnimatedImage.js";



fabric.Object.prototype.transparentCorners = false

var input = document.getElementById('file-input')
// @ts-ignore
input.addEventListener('change', (event: any) => {
    const fileList = event.target.files
    const file: File = fileList.item(0)
    const reader = new FileReader()
    reader.onloadend = async () => {
        const fileExtension = file.name.split('.').pop()
        const image = await AnimatedImage.fromImage(reader.result as ArrayBuffer, fileExtension)
        createEmoji(
            {
                width: 64,
                height: 64
            },
            image.right,
            async (canvas, image, time) => {
                const clone = await image.copy()

                image.setPos(time + 0.5, 0.5)
                clone.setPos((time - 1) + 0.5, 0.5)

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
