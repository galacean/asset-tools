[@alipay/antg-asset-tools](../README.md) / [Exports](../modules.md) / GlTFPreview

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

gltf/GlTFPreview.ts:35

## Accessors

### animationNames

• `get` **animationNames**(): `string`[]

Get the current animation names.

#### Returns

`string`[]

#### Defined in

gltf/GlTFPreview.ts:40

___

### duration

• `get` **duration**(): `number`

Get the current duration.

#### Returns

`number`

#### Defined in

gltf/GlTFPreview.ts:47

___

### frameTime

• `get` **frameTime**(): `number`

Get the current frame time.

#### Returns

`number`

#### Defined in

gltf/GlTFPreview.ts:54

___

### isPlaying

• `get` **isPlaying**(): `boolean`

Get the current playing state.

#### Returns

`boolean`

#### Defined in

gltf/GlTFPreview.ts:61

## Methods

### destroy

▸ **destroy**(): `void`

Destroy glTF preview

#### Returns

`void`

#### Defined in

gltf/GlTFPreview.ts:207

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

gltf/GlTFPreview.ts:218

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

gltf/GlTFPreview.ts:112

___

### pauseAnimation

▸ **pauseAnimation**(): `void`

Pause animation

#### Returns

`void`

#### Defined in

gltf/GlTFPreview.ts:200

___

### playAnimation

▸ **playAnimation**(): `void`

Play animation

#### Returns

`void`

#### Defined in

gltf/GlTFPreview.ts:190

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

gltf/GlTFPreview.ts:166

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

gltf/GlTFPreview.ts:179

___

### startPreview

▸ **startPreview**(): `void`

Start preview glTF asset

#### Returns

`void`

#### Defined in

gltf/GlTFPreview.ts:131

___

### stopPreview

▸ **stopPreview**(): `void`

Stop preview glTF asset

#### Returns

`void`

#### Defined in

gltf/GlTFPreview.ts:154

___

### getInstance

▸ `Static` **getInstance**(): [`GlTFPreview`](GlTFPreview.md)

#### Returns

[`GlTFPreview`](GlTFPreview.md)

#### Defined in

gltf/GlTFPreview.ts:25
