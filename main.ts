
import {fabric} from "./Vendor.js"
import {createEmoji} from "./Emoji.js"
import {AnimatedImage} from "./AnimatedImage.js"
fabric.Object.prototype.transparentCorners = false

var input = document.getElementById('file-input')
// @ts-ignore
input.addEventListener('change', (event: any) => {
    const fileList = event.target.files
    const file: File = fileList.item(0)
    const reader = new FileReader()
    reader.onloadend = () => {

        // @ts-ignore
        globalThis.test = AnimatedImage.fromImage(reader.result, file.name.split('.').pop()).then(console.log)
        // @ts-ignore

        // createEmoji(
        //     {
        //         width: 128,
        //         height: 128,
        //         fps: 20,
        //         length: 1
        //     },
        //     reader.result.toString(),
        //     async (canvas, relativeImage, t) => {
        //
        //         relativeImage.setPos(t + relativeImage.width / 2, 0.5)
        //         const clone = await relativeImage.copy()
        //         clone.setPos((t - 1) + relativeImage.width / 2, 0.5)
        //
        //     }
        // ).then(emoji => {
        //         const output = <HTMLImageElement>document.getElementById('output')
        //         output.src = URL.createObjectURL(emoji)
        //     }
        // )


    }
    reader.readAsArrayBuffer(file)

})


