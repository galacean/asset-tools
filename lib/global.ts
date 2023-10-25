
// /**
//  * Returns a version string.
//  * @returns {string}
//  */
// exports.version = () => validator.version();

// /**
//  * Returns an array of supported extensions names.
//  * @returns {string[]}
//  */
// exports.supportedExtensions = () => validator.supportedExtensions();

// /**
//  * Validates an asset from bytes.
//  * @param {Uint8Array} data - Byte array containing glTF or GLB data.
//  * @param {ValidationOptions} options - Object with validation options.
//  * @returns {Promise} Promise with validation result in object form.
//  */
// exports.validateBytes = (data, options) => validator.validateBytes(data, options);

// /**
//  * Validates an asset from JSON string.
//  * @param {string} json - String containing glTF JSON.
//  * @param {ValidationOptions} options - Object with validation options.
//  * @returns {Promise} Promise with validation result in object form.
//  */
// exports.validateString = (json, options) => validator.validateString(json, options);

// /**
//  @typedef {Object} ValidationOptions
//  @property {string} uri - Absolute or relative asset URI that will be copied to validation report.
//  @property {ExternalResourceFunction} externalResourceFunction - Function for loading external resources. If omitted, external resources are not validated.
//  @property {boolean} writeTimestamp - Set to `false` to omit timestamp from the validation report. Default is `true`.
//  @property {number} maxIssues - Max number of reported issues. Use `0` for unlimited output.
//  @property {string[]} ignoredIssues - Array of ignored issue codes.
//  @property {Object} severityOverrides - Object with overridden severities for issue codes.
//  */

// /**
//  * @callback ExternalResourceFunction
//  * @param {string} uri - Relative URI of the external resource.
//  * @returns {Promise} - Promise with Uint8Array data.
//  */

/*
// report example:
{
  mimeType: 'model/gltf+json',
  validatorVersion: '2.0.0-dev.3.9',
  validatedAt: '2023-07-25T09:05:51.107Z',
  issues: {
    numErrors: 2,
    numWarnings: 15,
    numInfos: 18,
    numHints: 0,
    messages: [
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object], [Object],
      [Object], [Object], [Object]
    ],
    truncated: false
  },
  info: {
    version: '2.0',
    generator: 'glTF-Transform v3.4.8',
    extensionsUsed: [ 'KHR_lights_punctual', 'KHR_materials_unlit' ],
    resources: [ [Object], [Object] ],
    animationCount: 3,
    materialCount: 5,
    hasMorphTargets: false,
    hasSkins: true,
    hasTextures: true,
    hasDefaultScene: true,
    drawCallCount: 10,
    totalVertexCount: 8152,
    totalTriangleCount: 12872,
    maxUVs: 1,
    maxInfluences: 4,
    maxAttributes: 6
  }
}
*/

declare module 'gltf-validator' {

  export type ValidationOptions = {
    uri?: string;
    externalResourceFunction?: (url: string) => Promise<Uint8Array>;
    writeTimestamp?: boolean;
    maxIssues?: number;
    ignoredIssues?: string[];
    severityOverrides?: {
      [key: string]: string;
    };
  };

  export type ValidationReport = {
    mimeType: string;
    validatorVersion: string;
    validatedAt: string;
    issues: {
      numErrors: number;
      numWarnings: number;
      numInfos: number;
      numHints: number;
      messages: any[];
      truncated: boolean;
    };
    info: {
      version: string;
      generator: string;
      extensionsUsed: string[];
      resources: any[];
      animationCount: number;
      materialCount: number;
      hasMorphTargets: boolean;
      hasSkins: boolean;
      hasTextures: boolean;
      hasDefaultScene: boolean;
      drawCallCount: number;
      totalVertexCount: number;
      totalTriangleCount: number;
      maxUVs: number;
      maxInfluences: number;
      maxAttributes: number;
    };
  };  

  export function version(): string;
  export function supportedExtensions(): string[];
  export function validateBytes(data: Uint8Array, options?: ValidationOptions): Promise<any>;
  export function validateString(json: string, options?: ValidationOptions): Promise<any>;
}