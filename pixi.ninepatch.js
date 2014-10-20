/**
* The MIT License (MIT)

* Copyright (c) 2014 Sebastian Nette

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* 
*
*/

/**
 * PIXI NinePatch Container
 * Copyright (c) 2014, Sebastian Nette
 * http://www.mokgames.com/
 */
(function(undefined) {
  
    /**
     * A NinePatchContainer is a collection of 9 Sprites. 4 corner Sprites, 4 side Sprites and 1 Sprite for the content.
     *
     * @class NinePatch
     * @extends DisplayObjectContainer
     * @constructor
     */
    PIXI.NinePatch = function( width, height, image, useFrames, scaleMode )
    {

        PIXI.DisplayObjectContainer.call(this);

        this.scaleMode = scaleMode || PIXI.NinePatch.scaleModes.NINEPATCH;
        
        this.targetWidth = width;
        this.targetHeight = height;
        
        this.loaded = 0;

        this.updateCallback = null;
        this.readyCallback = null;

        var method = useFrames ? 'fromFrame' : 'fromImage';

        // texture update bind
        this.onTextureUpdateBind = this.onTextureUpdate.bind(this);

        // add images
        for(var i = 0; i < 9; i++)
        {
            this.addChild( PIXI.Sprite[method]( image.replace('*', i+1) ) );
            if(!this.children[i].texture.baseTexture.hasLoaded)
            {
                this.children[i].texture.on( 'update', this.onTextureUpdateBind );
            }
            else
            {
                this.loaded++;
            }
        }

        // set anchors
        this.children[2].anchor.set(1, 0);
        this.children[5].anchor.set(1, 0);
        this.children[6].anchor.set(0, 1);
        this.children[7].anchor.set(0, 1);
        this.children[8].anchor.set(1, 1);

        // quick access
        this.head = this.children[1];
        this.body = this.children[4];

        // hide the group if textures aren't ready yet
        if(this.loaded < 9)
        {
            this.alpha = 0;
        }
        else
        {
            this.update();
        }
    };

    // constructor
    PIXI.NinePatch.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
    PIXI.NinePatch.prototype.constructor = PIXI.NinePatch;

    // NinePatch scale modes.
    PIXI.NinePatch.scaleModes = {
        DEFAULT: 1,
        NINEPATCH: 2
    };

    /**
     * The width of the NinePatchContainer, setting this will actually modify the scale to achieve the value set
     *
     * @property width
     * @type Number
     */
    Object.defineProperty(PIXI.NinePatch.prototype, 'width', {
        get: function() {
            if(this.scaleMode === PIXI.NinePatch.scaleModes.DEFAULT)
            {
                return this.scale.x * this.getLocalBounds().width;
            }
            else
            {
                return this.scale.x * this.targetWidth;
            }
        },
        set: function(value) {

            if(this.scaleMode === PIXI.NinePatch.scaleModes.DEFAULT)
            {
                var width = this.getLocalBounds().width;

                if(width !== 0)
                {
                    this.scale.x = value / ( width/this.scale.x );
                }
                else
                {
                    this.scale.x = 1;
                }

                
                this._width = value;
            }
            else
            {
                this.update( value, this.targetHeight );
            }
        }
    });

    /**
     * The height of the NinePatch, setting this will actually modify the scale to achieve the value set
     *
     * @property height
     * @type Number
     */
    Object.defineProperty(PIXI.NinePatch.prototype, 'height', {
        get: function() {

            if(this.scaleMode === PIXI.NinePatch.scaleModes.DEFAULT)
            {
                return  this.scale.y * this.getLocalBounds().height;
            }
            else
            {
                return this.scale.y * this.targetHeight;
            }
        },
        set: function(value) {

            if(this.scaleMode === PIXI.NinePatch.scaleModes.DEFAULT)
            {
                var height = this.getLocalBounds().height;

                if(height !== 0)
                {
                    this.scale.y = value / ( height/this.scale.y );
                }
                else
                {
                    this.scale.y = 1;
                }

                this._height = value;
            }
            else
            {
                this.update( this.targetWidth, value );
            }
        }
    });

    /**
     * Sets the update callback.
     *
     * @method onUpdate
     * @param callback {Function}
     * @return {NinePatch} The NinePatch container.
     */
    PIXI.NinePatch.prototype.onUpdate = function( callback )
    {
        this.updateCallback = callback;
        
        return this;
    };

    /**
     * Sets the ready callback.
     *
     * @method onReady
     * @param callback {Function}
     * @return {NinePatch} The NinePatch container.
     */
    PIXI.NinePatch.prototype.onReady = function( callback )
    {
        if(this.loaded === 9)
        {
            callback();
        }
        else
        {
            this.readyCallback = callback;
        }

        return this;
    };

    /**
     * Updates the container dimensions and aligns the sprites.
     *
     * @method update
     * @param width {Number} The containers width.
     * @param height {Number} The containers height.
     */
    PIXI.NinePatch.prototype.update = function( width, height )
    {

        // update width if supplied
        if(width !== undefined)
        {
            this.targetWidth = width;
        }

        // update height if supplied
        if(height !== undefined)
        {
            this.targetHeight = height;
        }

        // check if images loaded
        if(this.loaded !== 9) return;

        var child;

        // top middle
        child = this.children[1];
        child.position.set(this.children[0].width, 0);
        child.width = this.targetWidth - child.x - this.children[2].width;

        // top right
        child = this.children[2];
        child.position.set(this.targetWidth, 0);

        // middle left
        child = this.children[3];
        child.position.set(0, this.children[0].height);
        child.height = this.targetHeight - child.y - this.children[6].height;

        // middle
        child = this.children[4];
        child.position.set(this.children[1].x, this.children[3].y);
        child.height = this.children[3].height;
        child.width = this.children[1].width;

        // middle right
        child = this.children[5];
        child.position.set(this.targetWidth, this.children[3].y);
        child.height = this.children[3].height;

        // bottom left
        child = this.children[6];
        child.position.set(0, this.targetHeight);

        // bottom middle
        child = this.children[7];
        child.position.set(this.children[1].x, this.targetHeight);
        child.width = this.children[1].width;

        // bottom right
        child = this.children[8];
        child.position.set(this.targetWidth, this.targetHeight);

        // fire custom callback
        if(this.updateCallback)
        {
            this.updateCallback();
        }
    };

    /**
     * Used to check if all images have been loaded.
     *
     * @method onTextureUpdate
     */
    PIXI.NinePatch.prototype.onTextureUpdate = function()
    {
        if(++this.loaded === 9)
        {
            this.alpha = 1;
            this.update();

            // check for ready callback
            if(this.readyCallback)
            {
                this.readyCallback();
                this.readyCallback = null;
            }
        }
    };

})();
