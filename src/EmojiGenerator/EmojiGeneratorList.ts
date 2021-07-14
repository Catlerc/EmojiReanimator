import {
  Just,
  LinearGenerator,
  Reverse,
  RotationGenerator,
  Shake,
  TurnGenerator,
  TurnGeneratorFlex
} from "./FrameGenerator.js"
import {FlipHorizontal, FlipVertical} from "./ImagePreprocess.js"
import {EmojiGenerator} from "./EmojiGenerator.js"
import {Option} from "../Utils/Option.js"

export class EmojiGeneratorList {
  static allGenerators: Map<string, EmojiGenerator> = new Map([
    new EmojiGenerator("rotation", RotationGenerator, 0),
    new EmojiGenerator("shake", Shake, 0),
    new EmojiGenerator("just", Just, 0),
    new EmojiGenerator("dr", TurnGeneratorFlex, 270),
    new EmojiGenerator("du", LinearGenerator, 270),
    new EmojiGenerator("ld", TurnGeneratorFlex, 0),
    new EmojiGenerator("lr", LinearGenerator, 0),
    new EmojiGenerator("rl", LinearGenerator, 180),
    new EmojiGenerator("ru", TurnGeneratorFlex, 180),
    new EmojiGenerator("ud", LinearGenerator, 90),
    new EmojiGenerator("ul", TurnGeneratorFlex, 90),
    new EmojiGenerator("dl", Reverse(TurnGeneratorFlex), 0, [FlipHorizontal, FlipVertical]),
    new EmojiGenerator("lu", Reverse(TurnGeneratorFlex), 90, [FlipHorizontal, FlipVertical]),
    new EmojiGenerator("rd", Reverse(TurnGeneratorFlex), 270, [FlipHorizontal, FlipVertical]),
    new EmojiGenerator("ur", Reverse(TurnGeneratorFlex), 180, [FlipHorizontal, FlipVertical])
  ].map(renderer => [renderer.namePrefix, renderer]))

  static anotherRotationGenerators: Map<string, EmojiGenerator> = new Map([
    new EmojiGenerator("ld", TurnGenerator, 0),
    new EmojiGenerator("ul", TurnGenerator, 90),
    new EmojiGenerator("ru", TurnGenerator, 180),
    new EmojiGenerator("dr", TurnGenerator, 270),
    new EmojiGenerator("dl", Reverse(TurnGenerator), 0, [FlipHorizontal, FlipVertical]),
    new EmojiGenerator("lu", Reverse(TurnGenerator), 90, [FlipHorizontal, FlipVertical]),
    new EmojiGenerator("ur", Reverse(TurnGenerator), 180, [FlipHorizontal, FlipVertical]),
    new EmojiGenerator("rd", Reverse(TurnGenerator), 270, [FlipHorizontal, FlipVertical])
  ].map(renderer => [renderer.namePrefix, renderer]))

  constructor(
    private anotherRotation: boolean,
    private animationReverse: boolean,
    private flipHorizontal: boolean,
    private flipVertical: boolean
  ) {
  }

  getGenerator(name: string): EmojiGenerator {
    let resultEmojiGenerator: EmojiGenerator
    if (this.anotherRotation) {
      resultEmojiGenerator = Option.fromValue(EmojiGeneratorList.anotherRotationGenerators.get(name)).getOrElse(EmojiGeneratorList.allGenerators.get(name))
    } else {
      resultEmojiGenerator = Option.fromValue(EmojiGeneratorList.allGenerators.get(name)).getOrElse(EmojiGeneratorList.anotherRotationGenerators.get(name))
    }
    if (this.animationReverse) resultEmojiGenerator = new EmojiGenerator(
      resultEmojiGenerator.namePrefix,
      Reverse(resultEmojiGenerator.frameGenerator),
      resultEmojiGenerator.rotation,
      resultEmojiGenerator.preprocess
    )
    if (this.flipHorizontal) {
      const preprocess = [...resultEmojiGenerator.preprocess]
      preprocess.push(FlipHorizontal)
      resultEmojiGenerator = new EmojiGenerator(
        resultEmojiGenerator.namePrefix,
        resultEmojiGenerator.frameGenerator,
        resultEmojiGenerator.rotation,
        preprocess
      )
    }
    if (this.flipVertical) {
      const preprocess = [...resultEmojiGenerator.preprocess]
      preprocess.push(FlipVertical)
      resultEmojiGenerator = new EmojiGenerator(
        resultEmojiGenerator.namePrefix,
        resultEmojiGenerator.frameGenerator,
        resultEmojiGenerator.rotation,
        preprocess
      )
    }
    return resultEmojiGenerator
  }
}