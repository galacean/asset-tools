import type { JSONDocument } from "@gltf-transform/core";
import { BufferUtils } from "./buffer-utils";

/**
 * transform glTF to glB
 * @param jsonDoc - json document representing glTF
 * @returns Uint8Array representing glb
 */
export function transformGlTFtoGlB(jsonDoc: JSONDocument) {
  const { json, resources } = jsonDoc;
  const header = new Uint32Array([0x46546c67, 2, 12]);

  const jsonText = JSON.stringify(json);
  const jsonChunkData = BufferUtils.pad(BufferUtils.encodeText(jsonText), 0x20);
  const jsonChunkHeader = BufferUtils.toView(new Uint32Array([jsonChunkData.byteLength, 0x4e4f534a]));
  const jsonChunk = BufferUtils.concat([jsonChunkHeader, jsonChunkData]);
  header[header.length - 1] += jsonChunk.byteLength;

  let buffer: any = undefined;
  const buffers = json.buffers;
  if (buffers) buffer = buffers[0];

  let binBuffer: any = undefined;

  if (buffer) binBuffer = resources[buffer.uri];

  if (!binBuffer || !binBuffer.byteLength) {
    return BufferUtils.concat([BufferUtils.toView(header), jsonChunk]);
  }

  const binChunkData = BufferUtils.pad(binBuffer, 0x00);
  const binChunkHeader = BufferUtils.toView(new Uint32Array([binChunkData.byteLength, 0x004e4942]));
  const binChunk = BufferUtils.concat([binChunkHeader, binChunkData]);
  header[header.length - 1] += binChunk.byteLength;

  return BufferUtils.concat([BufferUtils.toView(header), jsonChunk, binChunk]);
}
