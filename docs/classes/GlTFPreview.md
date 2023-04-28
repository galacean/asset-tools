[@galacean/asset-tools](../README.md) / [Exports](../modules.md) / GlTFPreview

# Class: GlTFPreview

## Table of contents

### Properties

- [canvas](GlTFPreview.md#canvas)

### Accessors

- [animationNames](GlTFPreview.md#animationnames)
- [duration](GlTFPreview.md#duration)
- [frameTime](GlTFPreview.md#frametime)
- [isPlaying](GlTFPreview.md#isplaying)

### Methods

- [destroy](GlTFPreview.md#destroy)
- [getSnapshot](GlTFPreview.md#getsnapshot)
- [loadAsset](GlTFPreview.md#loadasset)
- [pauseAnimation](GlTFPreview.md#pauseanimation)
- [playAnimation](GlTFPreview.md#playanimation)
- [selectAnimation](GlTFPreview.md#selectanimation)
- [setFrameTime](GlTFPreview.md#setframetime)
- [startPreview](GlTFPreview.md#startpreview)
- [stopPreview](GlTFPreview.md#stoppreview)
- [getInstance](GlTFPreview.md#getinstance)

## Properties

### canvas

• `Readonly` **canvas**: `HTMLCanvasElement`

Get the current canvas element.

#### Defined in

[gltf/GlTFPreview.ts:35](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L35)

## Accessors

### animationNames

• `get` **animationNames**(): `string`[]

Get the current animation names.

#### Returns

`string`[]

#### Defined in

[gltf/GlTFPreview.ts:40](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L40)

___

### duration

• `get` **duration**(): `number`

Get the current duration.

#### Returns

`number`

#### Defined in

[gltf/GlTFPreview.ts:47](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L47)

___

### frameTime

• `get` **frameTime**(): `number`

Get the current frame time.

#### Returns

`number`

#### Defined in

[gltf/GlTFPreview.ts:54](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L54)

___

### isPlaying

• `get` **isPlaying**(): `boolean`

Get the current playing state.

#### Returns

`boolean`

#### Defined in

[gltf/GlTFPreview.ts:61](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L61)

## Methods

### destroy

▸ **destroy**(): `void`

Destroy glTF preview

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:208](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L208)

___

### getSnapshot

▸ **getSnapshot**(`width?`, `height?`): `Promise`<`unknown`\>

Get snapshot of the glTF

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `width` | `number` | `500` | snapshot width |
| `height` | `number` | `500` | snapshot height |

#### Returns

`Promise`<`unknown`\>

- promise of snapshot base64 url

#### Defined in

[gltf/GlTFPreview.ts:219](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L219)

___

### loadAsset

▸ **loadAsset**(`glTFAsset`): `Promise`<`void`\>

Load glTF asset

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `glTFAsset` | `string` \| `Blob` | glTF asset url or blob |

#### Returns

`Promise`<`void`\>

async promise

#### Defined in

[gltf/GlTFPreview.ts:113](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L113)

___

### pauseAnimation

▸ **pauseAnimation**(): `void`

Pause animation

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:201](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L201)

___

### playAnimation

▸ **playAnimation**(): `void`

Play animation

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:191](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L191)

___

### selectAnimation

▸ **selectAnimation**(`index`): `void`

Select animation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | animation index |

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:167](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L167)

___

### setFrameTime

▸ **setFrameTime**(`frameTime`): `void`

Set frame time

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `frameTime` | `number` | frame time |

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:180](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L180)

___

### startPreview

▸ **startPreview**(): `void`

Start preview glTF asset

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:132](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L132)

___

### stopPreview

▸ **stopPreview**(): `void`

Stop preview glTF asset

#### Returns

`void`

#### Defined in

[gltf/GlTFPreview.ts:155](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L155)

___

### getInstance

▸ `Static` **getInstance**(): [`GlTFPreview`](GlTFPreview.md)

#### Returns

[`GlTFPreview`](GlTFPreview.md)

#### Defined in

[gltf/GlTFPreview.ts:25](https://github.com/ant-galaxy/antg-asset-tools/blob/ba75335/src/gltf/GlTFPreview.ts#L25)
