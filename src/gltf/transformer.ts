import type { JSONDocument, GLTF } from "@gltf-transform/core";

function alignedLength(value: number) {
  const alignValue = 4;
  if (value == 0) {
    return value;
  }
  const multiple = value % alignValue;
  if (multiple === 0) {
    return value;
  }
  return value + (alignValue - multiple);
}

function getMimeType(filename: string) {
  const gltfMimeTypes: Record<string, string[]> = {
    "image/png": ["png"],
    "image/jpeg": ["jpg", "jpeg"],
    "text/plain": ["glsl", "vert", "vs", "frag", "fs", "txt"],
    "image/vnd-ms.dds": ["dds"]
  };
  for (let mimeType in gltfMimeTypes) {
    for (let extensionIndex in gltfMimeTypes[mimeType]) {
      let extension = gltfMimeTypes[mimeType][extensionIndex];
      if (filename.toLowerCase().endsWith("." + extension)) {
        return mimeType;
      }
    }
  }
  return "application/octet-stream";
}

/**
 * transform glTF to glB
 * @param jsonDoc - json document representing glTF
 * @returns Uint8Array representing glb
 */
export function transformGlTFtoGlB(jsonDoc: JSONDocument) {
  const gltf = jsonDoc.json;
  const outputBuffers: ArrayBuffer[] = [];
  const bufferMap = new Map();
  let bufferOffset = 0;

  function dataFromUri(buffer: GLTF.IBuffer | GLTF.IImage) {
    if (buffer.uri === undefined) {
      return undefined;
    } else {
      return jsonDoc.resources[buffer.uri];
    }
  }

  const buffers = gltf.buffers ?? [];
  buffers.forEach(function (buffer, bufferIndex) {
    const data = dataFromUri(buffer);
    if (data !== undefined) {
      outputBuffers.push(data);
      delete buffer.uri;
      buffer.byteLength = data.byteLength;
      bufferMap.set(bufferIndex, bufferOffset);
      bufferOffset += alignedLength(data.byteLength);
    }
  });

  let bufferIndex = buffers.length;
  const images = gltf.images || [];
  images.forEach(function (image) {
    const data = dataFromUri(image);
    if (data === undefined) {
      delete image["uri"];
      return;
    }
    const bufferView = {
      buffer: 0,
      byteOffset: bufferOffset,
      byteLength: data.byteLength
    };
    bufferMap.set(bufferIndex, bufferOffset);
    bufferIndex++;
    bufferOffset += alignedLength(data.byteLength);
    const bufferViews = gltf.bufferViews ?? [];
    let bufferViewIndex = bufferViews.length;
    bufferViews.push(bufferView);
    outputBuffers.push(data);
    image["bufferView"] = bufferViewIndex;
    image["mimeType"] = getMimeType(image.uri!);
    delete image["uri"];
  });

  const Binary = {
    Magic: 0x46546c67
  };

  for (let _i = 0, _a = gltf.bufferViews!; _i < _a.length; _i++) {
    const bufferView = _a[_i];
    if (bufferView.byteOffset === undefined) {
      bufferView.byteOffset = 0;
    } else {
      bufferView.byteOffset = bufferView.byteOffset + bufferMap.get(bufferView.buffer);
    }
    bufferView.buffer = 0;
  }
  const binBufferSize = bufferOffset;
  gltf.buffers = [
    {
      byteLength: binBufferSize
    }
  ];

  const enc = new TextEncoder();
  const jsonBuffer = enc.encode(JSON.stringify(gltf));
  const jsonAlignedLength = alignedLength(jsonBuffer.length);
  let padding;
  if (jsonAlignedLength !== jsonBuffer.length) {
    padding = jsonAlignedLength - jsonBuffer.length;
  }
  const totalSize =
    12 + // file header: magic + version + length
    8 + // json chunk header: json length + type
    jsonAlignedLength +
    8 + // bin chunk header: chunk length + type
    binBufferSize;
  const finalBuffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(finalBuffer);
  let bufIndex = 0;
  dataView.setUint32(bufIndex, Binary.Magic, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, 2, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, totalSize, true);
  bufIndex += 4;
  // JSON
  dataView.setUint32(bufIndex, jsonAlignedLength, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, 0x4e4f534a, true);
  bufIndex += 4;

  for (let j = 0; j < jsonBuffer.length; j++) {
    dataView.setUint8(bufIndex, jsonBuffer[j]);
    bufIndex++;
  }
  if (padding !== undefined) {
    for (let j = 0; j < padding; j++) {
      dataView.setUint8(bufIndex, 0x20);
      bufIndex++;
    }
  }

  // BIN
  dataView.setUint32(bufIndex, binBufferSize, true);
  bufIndex += 4;
  dataView.setUint32(bufIndex, 0x004e4942, true);
  bufIndex += 4;
  for (let i = 0; i < outputBuffers.length; i++) {
    const bufOffset = bufIndex + bufferMap.get(i);
    const buf = new Uint8Array(outputBuffers[i]);
    let thisBufIndex = bufOffset;
    for (let j = 0; j < buf.byteLength; j++) {
      dataView.setUint8(thisBufIndex, buf[j]);
      thisBufIndex++;
    }
  }
  return new Blob([finalBuffer], { type: "model/json-binary" });
}
