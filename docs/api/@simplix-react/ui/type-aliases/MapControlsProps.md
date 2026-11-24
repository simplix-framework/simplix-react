[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@simplix-react/ui](../README.md) / MapControlsProps

# Type Alias: MapControlsProps

> **MapControlsProps** = `object`

Defined in: [packages/ui/src/base/map/map.tsx:395](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L395)

Props for the [MapControls](../functions/MapControls.md) component.

## Properties

### className?

> `optional` **className**: `string`

Defined in: [packages/ui/src/base/map/map.tsx:407](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L407)

Additional CSS classes for the control group.

***

### compassPoints?

> `optional` **compassPoints**: [`GeoPoint`](GeoPoint.md)[]

Defined in: [packages/ui/src/base/map/map.tsx:413](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L413)

Points to fit when compass is clicked. When provided but empty, falls back to geolocation.

***

### onCompass()?

> `optional` **onCompass**: () => `void`

Defined in: [packages/ui/src/base/map/map.tsx:411](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L411)

Custom handler for compass button. Replaces default resetNorthPitch.

#### Returns

`void`

***

### onLocate()?

> `optional` **onLocate**: (`coords`) => `void`

Defined in: [packages/ui/src/base/map/map.tsx:409](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L409)

Callback with user coordinates when located.

#### Parameters

##### coords

###### latitude

`number`

###### longitude

`number`

#### Returns

`void`

***

### position?

> `optional` **position**: [`MapControlsPosition`](MapControlsPosition.md)

Defined in: [packages/ui/src/base/map/map.tsx:397](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L397)

Placement location for the controls.

***

### showCompass?

> `optional` **showCompass**: `boolean`

Defined in: [packages/ui/src/base/map/map.tsx:401](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L401)

Enable compass button to reset bearing.

***

### showFullscreen?

> `optional` **showFullscreen**: `boolean`

Defined in: [packages/ui/src/base/map/map.tsx:405](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L405)

Enable fullscreen toggle button.

***

### showLocate?

> `optional` **showLocate**: `boolean`

Defined in: [packages/ui/src/base/map/map.tsx:403](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L403)

Enable locate button for user's location.

***

### showZoom?

> `optional` **showZoom**: `boolean`

Defined in: [packages/ui/src/base/map/map.tsx:399](https://github.com/simplix-framework/simplix-react/blob/main/packages/ui/src/base/map/map.tsx#L399)

Enable zoom in/out buttons.
