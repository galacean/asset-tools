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