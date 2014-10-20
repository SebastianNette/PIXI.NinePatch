PIXI.NinePatch
================

Rendering 9Patch containers on a PIXI stage.

Demo: http://mokgames.com/playground/ninepatch/

#### How to use ####
Simply load the pixi.ninepatch.js file after your pixi.js file.
```
<script src="pixi.js"></script>
<script src="pixi.ninepatch.js"></script>
```

#### Creating a 9 Patch Container ####
```javascript
var ninepatch = new PIXI.NinePatch(width, height, image, useFrames);
stage.addChild(ninepatch);
```

__width:__ The width of your 9Patch container.

__height:__ The height of your 9Patch container.

__image:__ The name of the used image. Use an asterisk for the the coutning number.

__useFrames:__ If true, PIXI.Sprite.fromFrame will be used. If false then PIXI.Sprite.fromFrame will be used.

```javascript
var ninepatch = new PIXI.NinePatch(100, 30, "img/yellow_button_0*.png", false);
stage.addChild(ninepatch);
```

The asterik in the file name will be replaced with the numbers 1 to 9.

```
[ 
  1, 2, 3,
  4, 5, 6,
  7, 8, 9
]
```

#### Adding content to the container ####

```javascript

var ninepatch = new PIXI.NinePatch(100, 30, "img/yellow_button_0*.png", false);
stage.addChild(ninepatch);

ninepatch.body.addChild(sprite);
```
