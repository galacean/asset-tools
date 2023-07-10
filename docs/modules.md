[@galacean/asset-tools](README.md) / Exports

# @galacean/asset-tools

## Table of contents

### Classes

- [GlTFPreview](classes/GlTFPreview.md)

### Type Aliases

- [ImageTransformOptions](modules.md#imagetransformoptions)

### Functions

- [transformGlTFtoGlB](modules.md#transformgltftoglb)
- [transformImageByAftsUrl](modules.md#transformimagebyaftsurl)

## Type Aliases

### ImageTransformOptions

Ƭ **ImageTransformOptions**: `Object`

图片转换

#### Type declaration

| Name | Type |
| :------ | :------ |
| `format?` | ``"webp"`` \| ``"jpeg"`` \| ``"png"`` |
| `height?` | `number` |
| `mode?` | ``"cover"`` \| ``"contain"`` \| ``"fill"`` \| ``"inside"`` |
| `quality?` | `number` |
| `width?` | `number` |

#### Defined in

[image/transformer.ts:4](https://github.com/ant-galaxy/antg-asset-tools/blob/b12745a/src/image/transformer.ts#L4)

## Functions

### transformGlTFtoGlB

▸ **transformGlTFtoGlB**(`jsonDoc`): `Blob`

transform glTF to glB

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsonDoc` | `JSONDocument` | json document representing glTF |

#### Returns

`Blob`

Uint8Array representing glb

#### Defined in

[gltf/transformer.ts:38](https://github.com/ant-galaxy/antg-asset-tools/blob/b12745a/src/gltf/transformer.ts#L38)

___

### transformImageByAftsUrl

▸ **transformImageByAftsUrl**(`imageUrl`, `options`): `string`

图片转换方法
通过 afts url 参数实现

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `imageUrl` | `string` | 图片 url |
| `options` | [`ImageTransformOptions`](modules.md#imagetransformoptions) |  |

#### Returns

`string`

#### Defined in

[image/transformer.ts:25](https://github.com/ant-galaxy/antg-asset-tools/blob/b12745a/src/image/transformer.ts#L25)
