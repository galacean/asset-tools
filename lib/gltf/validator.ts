import validator, { type ValidationOptions, type ValidationReport } from 'gltf-validator';
import { Document } from '@gltf-transform/core';
import { getIOinstance, parse } from './parser.js';

/**
 * gltf validator
 * https://github.com/KhronosGroup/glTF-Validator
 */
export async function validate(gltf: string, options?: ValidationOptions, IOoptions?: { extensions?: any[] }): Promise<ValidationReport | null>;
export async function validate(gltf: Uint8Array, options?: ValidationOptions, IOoptions?: { extensions?: any[] }): Promise<ValidationReport | null>;
export async function validate(gltf: Document, options?: ValidationOptions, IOoptions?: { extensions?: any[] }): Promise<ValidationReport | null>;
export async function validate(gltf: string | Uint8Array | Document, options?: ValidationOptions, IOoptions?: { extensions?: any[] }) {
  let report: ValidationReport | null = null;
  if (typeof gltf === 'string') {
    const jsonDocument = await parse(gltf, 'json');
    report = await validator.validateString(JSON.stringify(jsonDocument.json));
  } else if (gltf instanceof Document) {
    const io = getIOinstance();
    io.registerExtensions(IOoptions?.extensions || []);
    const jsonDocument = await io.writeJSON(gltf);
    report = await validator.validateString(JSON.stringify(jsonDocument.json));
  } else if (gltf instanceof Uint8Array) {
    report = await validator.validateBytes(gltf, options);
  }
  return report;
}