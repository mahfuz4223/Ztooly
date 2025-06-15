
interface EXIFData {
  [key: string]: any;
}

export const extractEXIFData = async (file: File): Promise<EXIFData> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        resolve(getBasicFileInfo(file));
        return;
      }

      try {
        const dataView = new DataView(arrayBuffer);
        const exifData = parseEXIFData(dataView, file);
        resolve(exifData);
      } catch (error) {
        console.error('EXIF parsing error:', error);
        resolve(getBasicFileInfo(file));
      }
    };

    reader.onerror = () => {
      resolve(getBasicFileInfo(file));
    };

    reader.readAsArrayBuffer(file);
  });
};

const getBasicFileInfo = (file: File): EXIFData => {
  return {
    'File Name': file.name,
    'File Size': `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    'MIME Type': file.type,
    'Last Modified': new Date(file.lastModified).toLocaleString(),
  };
};

const parseEXIFData = (dataView: DataView, file: File): EXIFData => {
  const exifData: EXIFData = getBasicFileInfo(file);

  // Check for JPEG format
  if (dataView.getUint16(0) !== 0xFFD8) {
    return exifData;
  }

  let offset = 2;
  let marker;
  
  // Look for APP1 marker (0xFFE1) which contains EXIF
  while (offset < dataView.byteLength) {
    marker = dataView.getUint16(offset);
    
    if (marker === 0xFFE1) {
      const segmentLength = dataView.getUint16(offset + 2);
      const exifHeader = new Array(4);
      
      for (let i = 0; i < 4; i++) {
        exifHeader[i] = dataView.getUint8(offset + 4 + i);
      }
      
      // Check for "Exif" header
      if (exifHeader[0] === 0x45 && exifHeader[1] === 0x78 && 
          exifHeader[2] === 0x69 && exifHeader[3] === 0x66) {
        
        const tiffOffset = offset + 10;
        parseIFD(dataView, tiffOffset, exifData);
        break;
      }
    }
    
    if (marker === 0xFFDA) break; // Start of scan
    
    const segmentLength = dataView.getUint16(offset + 2);
    offset += 2 + segmentLength;
  }

  return exifData;
};

const parseIFD = (dataView: DataView, baseOffset: number, exifData: EXIFData) => {
  try {
    // Check TIFF header
    const byteOrder = dataView.getUint16(baseOffset);
    const isLittleEndian = byteOrder === 0x4949;
    
    const read16 = (offset: number) => dataView.getUint16(offset, isLittleEndian);
    const read32 = (offset: number) => dataView.getUint32(offset, isLittleEndian);

    const ifdOffset = read32(baseOffset + 4);
    const numEntries = read16(baseOffset + ifdOffset);

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = baseOffset + ifdOffset + 2 + (i * 12);
      const tag = read16(entryOffset);
      const type = read16(entryOffset + 2);
      const count = read32(entryOffset + 4);
      let value = read32(entryOffset + 8);

      // Handle different data types
      if (type === 2 && count > 4) { // ASCII string
        value = baseOffset + value;
      }

      const tagInfo = getTagInfo(tag, type, count, value, dataView, baseOffset, isLittleEndian);
      if (tagInfo) {
        exifData[tagInfo.name] = tagInfo.value;
      }
    }
  } catch (error) {
    console.error('IFD parsing error:', error);
  }
};

const getTagInfo = (tag: number, type: number, count: number, value: number, 
                   dataView: DataView, baseOffset: number, isLittleEndian: boolean) => {
  const read16 = (offset: number) => dataView.getUint16(offset, isLittleEndian);
  const read32 = (offset: number) => dataView.getUint32(offset, isLittleEndian);

  const tags: { [key: number]: string } = {
    0x010F: 'Camera Make',
    0x0110: 'Camera Model',
    0x0112: 'Orientation',
    0x011A: 'X Resolution',
    0x011B: 'Y Resolution',
    0x0128: 'Resolution Unit',
    0x0131: 'Software',
    0x0132: 'Date and Time',
    0x013B: 'Artist',
    0x013E: 'White Point',
    0x013F: 'Primary Chromaticities',
    0x0211: 'YCbCr Coefficients',
    0x0213: 'YCbCr Positioning',
    0x0214: 'Reference Black White',
    0x8298: 'Copyright',
    0x829A: 'Exposure Time',
    0x829D: 'F-Number',
    0x8822: 'Exposure Program',
    0x8827: 'ISO Speed',
    0x9000: 'EXIF Version',
    0x9003: 'Date Original',
    0x9004: 'Date Digitized',
    0x9201: 'Shutter Speed',
    0x9202: 'Aperture',
    0x9207: 'Metering Mode',
    0x9208: 'Light Source',
    0x9209: 'Flash',
    0x920A: 'Focal Length',
    0x927C: 'Maker Note',
    0x9286: 'User Comment',
    0xA000: 'FlashPix Version',
    0xA001: 'Color Space',
    0xA002: 'Image Width',
    0xA003: 'Image Height',
    0xA005: 'Interoperability Offset',
    0xA20E: 'Focal Plane X Resolution',
    0xA20F: 'Focal Plane Y Resolution',
    0xA210: 'Focal Plane Resolution Unit',
    0xA215: 'Exposure Index',
    0xA217: 'Sensing Method',
    0xA300: 'File Source',
    0xA301: 'Scene Type',
  };

  const tagName = tags[tag];
  if (!tagName) return null;

  let tagValue: any = value;

  try {
    // Handle different data types
    switch (type) {
      case 2: // ASCII string
        if (count > 4) {
          let str = '';
          for (let i = 0; i < count - 1; i++) {
            const char = dataView.getUint8(value + i);
            if (char === 0) break;
            str += String.fromCharCode(char);
          }
          tagValue = str;
        }
        break;
      case 3: // Short
        if (count === 1) {
          tagValue = value & 0xFFFF;
        }
        break;
      case 4: // Long
        tagValue = value;
        break;
      case 5: // Rational
        if (count > 0) {
          const numerator = read32(value);
          const denominator = read32(value + 4);
          if (denominator === 0) {
            tagValue = 0;
          } else {
            tagValue = numerator / denominator;
            // Format specific tags
            if (tag === 0x829A) { // Exposure time
              tagValue = denominator === 1 ? `${numerator}s` : `1/${Math.round(denominator/numerator)}s`;
            } else if (tag === 0x829D) { // F-number
              tagValue = `f/${(numerator/denominator).toFixed(1)}`;
            } else if (tag === 0x920A) { // Focal length
              tagValue = `${(numerator/denominator).toFixed(0)}mm`;
            }
          }
        }
        break;
    }

    // Format specific values
    if (tag === 0x0112) { // Orientation
      const orientations = ['', 'Normal', 'Horizontal flip', '180° rotation', 
                           'Vertical flip', '90° CCW + horizontal flip', '90° CW', 
                           '90° CW + horizontal flip', '90° CCW'];
      tagValue = orientations[value] || `Unknown (${value})`;
    } else if (tag === 0x9209) { // Flash
      const flashModes = ['No Flash', 'Flash fired', 'Flash off', 'Auto'];
      tagValue = flashModes[value] || `Flash mode ${value}`;
    } else if (tag === 0xA001) { // Color space
      tagValue = value === 1 ? 'sRGB' : value === 65535 ? 'Uncalibrated' : `Unknown (${value})`;
    }

    return { name: tagName, value: tagValue };
  } catch (error) {
    console.error(`Error parsing tag ${tag}:`, error);
    return null;
  }
};
