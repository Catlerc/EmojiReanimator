/*!
 * gifdecode.js v1.0.0
 * https://github.com/markbuild/gifdecode.js
 * Copyright 2017, Mark Li
 * Licence: Unlicense <http://unlicense.org>
 */
function GifFile(_buffer) {
  this.decArray = new Uint8Array(_buffer);
  this.signature = String.fromCharCode(this.decArray[0]) + String.fromCharCode(this.decArray[1]) + String.fromCharCode(this.decArray[2]); // Should always be "GIF"
  this.version = String.fromCharCode(this.decArray[3]) + String.fromCharCode(this.decArray[4]) + String.fromCharCode(this.decArray[5]); //89a or 87a
  this.init();
};

GifFile.prototype.init = function () {
  this.canvasWidth = this.decArray[6]+this.decArray[7]*256;
  this.canvasHeight = this.decArray[8]+this.decArray[9]*256;
  if(this.decArray[10]<128) { // No global color table
    this.hasGlobalColorTable = false;
    this.globalColorTableSize = 0;
    this.backgroundColorIndex = 0;
  } else {
    this.hasGlobalColorTable = true;
    this.backgroundColorIndex = this.decArray[11];
    this.globalColorTableSize = Math.pow(2,(this.decArray[10]%8)+1);
  }
  var index=13+this.globalColorTableSize*3;
  var trailer = false;
  this.frames = [];
  this.structureBlocks = [];
  this.globalColorTable = this.getGlobalColorTable();
  var delayTime = 0;
  var transparentColorIndex = null;
  var transparentColorFlag = 0;
  var disposalMethod = 2;
  var previousDisposalMethod = 2;
  var pixelColors = [];
  var previousPixelColors;
  do {
    if(this.decArray[index]=='44'){ //Image Descriptor
      this.structureBlocks.push(44);
      var imageLeft= this.decArray[index+1]+this.decArray[index+2]*256;
      var imageTop= this.decArray[index+3]+this.decArray[index+4]*256;
      var imageWidth= this.decArray[index+5]+this.decArray[index+6]*256;
      var imageHeight= this.decArray[index+7]+this.decArray[index+8]*256;
      var colorTable;
      if(this.decArray[index+9]<128) { // No local color table
        var localColorTable = [];
        colorTable =  this.globalColorTable.concat();
        index+=10;
      } else {
        this.structureBlocks.push(45);
        var localColorTableSize = Math.pow(2,(this.decArray[index+9]%8)+1);
        var localColorTable = this.getLocalColorTable(index+10,localColorTableSize).concat();
        colorTable = localColorTable;
        index += localColorTableSize*3+10;
      }
      if(transparentColorFlag) {
        colorTable[transparentColorIndex] =  colorTable[transparentColorIndex].replace("rgb","rgba").replace(")",",0)");
      }
      //Image data block
      this.structureBlocks.push(46);
      var lzwMiniCodeSize = this.decArray[index];
      index++;
      var byteStream=[];
      do {
        var subBlockSize = this.decArray[index];
        if(subBlockSize==undefined) {
          return;
        }
        for(var i=1;i<=subBlockSize;i++) {
          byteStream.push(this.decArray[index+i]);
        }
        index+=subBlockSize+1;
      } while (this.decArray[index]!=0); // Block Terminator is 0x00
      var indexStream = this.lzwDecode(byteStream,lzwMiniCodeSize);
      for(var h=0;h<imageHeight;h++){
        for(var w=0;w<imageWidth;w++){
          if(!indexStream[h*imageWidth+w]) {
            indexStream[h*imageWidth+w]=this.backgroundColorIndex;
          }
          if(colorTable[indexStream[h*imageWidth+w]].indexOf("rgba")>=0 && previousDisposalMethod!=2) {
            continue;
          }
          pixelColors[(imageTop+h)*this.canvasWidth+imageLeft+w] = colorTable[indexStream[h*imageWidth+w]];
        }
      }
      this.frames.push({"pixelColors":pixelColors.concat(),"delayTime":delayTime});
      switch(disposalMethod) {
        case 0: // This image were not animated
          break;
        case 1: // Leave the image in place and draw the next image on top of it
          break;
        case 2: // The canvas should be restored to the background color
          pixelColors = [];
          break;
        case 3: // Restore the canvas to its previous state before the current image was drawn
          pixelColors = previousPixelColors;
          break;
      }
      previousPixelColors = pixelColors.concat();
      previousDisposalMethod = disposalMethod;
      index++;
    } else if(this.decArray[index]==59) { //0x3B
      trailer = true;
    } else {
      this.extensionType = this.decArray[index+1];
      this.structureBlocks.push(this.extensionType);
      switch (this.extensionType) {
        case 249: //Graphics Control Extension
          transparentColorFlag = this.decArray[index+3]%2;
          disposalMethod = (this.decArray[index+3]>>2)%8;
          delayTime = (this.decArray[index+4]+this.decArray[index+5]*256)*0.01;
          transparentColorIndex = this.decArray[index+6];
          index+=8;
          break;
        case 255: //Application Extension
          index+=this.decArray[index+14]+11;
          do {
            var subBlockSize = this.decArray[index];
            index+=subBlockSize+1;
          } while (this.decArray[index]!=0);
          index++;
          break;
        case 254: //Comment Extension
          index+=2;
          do {
            var subBlockSize = this.decArray[index];
            if(subBlockSize==0){
              return;
            }
            index+=subBlockSize+1;
          } while (this.decArray[index]!=0);
          index++;
          break;
        case 1: // Plain Text Extension
          return;
          break;
      }
    }
  } while(!trailer);
}

GifFile.prototype.getGlobalColorTable = function () {
  var colortable = [];
  for(var i=0;i<this.globalColorTableSize;i++) {
    colortable.push("rgb("+this.decArray[13+i*3]+","+this.decArray[14+i*3]+","+this.decArray[15+i*3]+")");
  }
  return colortable;
};
GifFile.prototype.getLocalColorTable = function (_index,_size) {
  var colortable = [];
  for(var i=0;i<_size;i++) {
    colortable.push("rgb("+this.decArray[_index+i*3]+","+this.decArray[_index+1+i*3]+","+this.decArray[_index+2+i*3]+")");
  }
  return colortable;
};
GifFile.prototype.lzwDecode = function (_byteStream,_lzwMiniCodeSize) {
  var indexStream = [];
  var byteindex = 0;
  var bits = 0;
  var bitStack = 0;

  var MAX_CODE = 4095; // GIF format specifies a maximum code of #4095 (this happens to be the largest 12-bit number)
  var codeTable =[];
  var codeBefore = -1;
  var singleIndexCode = 0;
  var code;
  var codeStack = [];
  var clearCode = 1 << _lzwMiniCodeSize;
  var EOI = clearCode + 1;
  var code_size = _lzwMiniCodeSize + 1;
  var code_mask = (1 << code_size) - 1;
  var nextAvailableCode = clearCode + 2;
  var top = 0;
  var code_tmp;

  for (code = 0; code < clearCode; code++) { // Initialize the code table
    codeTable[code]=[0,code]; // [codeBefore, singleIndexCode]
  }

  while(1) {
    if (bits < code_size) {
      bitStack += _byteStream[byteindex] << bits;
      byteindex++;
      bits += 8;
      continue;
    }
    // Get new code.
    code = bitStack & code_mask;
    bitStack >>= code_size;
    bits -= code_size;
    // EOI Code
    if ((code > nextAvailableCode) || (code == EOI)) {
      break;
    }
    // Clear Code
    if (code == clearCode) {
      code_size = _lzwMiniCodeSize + 1;
      code_mask = (1 << code_size) - 1;
      nextAvailableCode = clearCode + 2;
      codeBefore= -1;
      continue;
    }
    if (codeBefore == -1) {
      codeStack[top++] = codeTable[code][1];
      codeBefore = code;
      singleIndexCode= code;
      continue;
    }
    code_tmp = code;
    if (code == nextAvailableCode) {
      code = codeBefore;
      codeStack[top++] = singleIndexCode;
    }
    while (code > clearCode) {
      codeStack[top++] = codeTable[code][1];
      code = codeTable[code][0];
    }
    singleIndexCode = codeTable[code][1] & 0xff; // Max single index code is #255
    codeStack[top++] = singleIndexCode;

    // Add a row for index buffer + K into code table
    if(nextAvailableCode <= MAX_CODE) {
      codeTable[nextAvailableCode] = [codeBefore,singleIndexCode]; //?
      nextAvailableCode++;
      if (((nextAvailableCode & code_mask) === 0) && (nextAvailableCode <= MAX_CODE)) {
        code_size++;
        code_mask = (1 << code_size) - 1;
      }
    }
    codeBefore= code_tmp;
    while(top>0){
      top--;
      indexStream.push(codeStack[top]);
    }
  }

  return indexStream;
}
GifFile.prototype.getExtensionTypeName = function (_e) {
  switch (_e) {
    case 249: //0xF9
      return "<span style='background:#CFCB9D'>Graphics Control Extension</span>";
      break;
    case 255://0xFF
      return "<span style='background:#CAC9A9'>Application Extension</span>";
      break;
    case 254: //0xFE
      return "<span style='background:#CDCCAC'>Comment Extension</span>";
      break;
    case 1: //0x01
      return "<span style='background:#B5B499'>Plain Text Extension</span>";
      break;
    case 44://0x2C
      return "<span style='background:#B9C7D1'>Image Descriptor</span>";
      break;
    case 45:
      return "<span style='background:#DCDCDC'>Local Color Table</span>";
      break;
    case 46:
      return "<span style='background:#BBB1B1'>Image Data</span><br>";
      break;
  }
}
GifFile.prototype.getStructure = function () {
  var info="<span style='background:#DDD08C'>Header</span> - <span style='background:#A5B3B2'>Logical Screen Descriptor</span>";
  info += this.hasGlobalColorTable?" - <span style='background:#D8D8D8'>Global Color Table</span><br>":"<br>";
  for(var i in this.structureBlocks) {
    info+=" - "+this.getExtensionTypeName(this.structureBlocks[i]);
  }
  info+= "- <span style='background:#F6E89B'>Trailer</span>";
  return info;
}