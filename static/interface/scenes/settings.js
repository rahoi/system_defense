

import k from '../kaboom/kaboom.js';
import { SceneControls } from '../interface.js';
import { getColor, setColor } from '../../config/settings.js';

// ALL ICONS HAVE SAME SIZE (512p x 512p)
const iconWidth = 512;
const iconHeight = 512;

export function Settings() {
    this.init();

    // necessary to preserve `this` reference (check out arrow functions if unfamiliar)
    this.scene = (color) => { this.buildScene(color); };
};

Settings.prototype.init = function() {

    // TEST TEST TEST --> Meant as a template, not actual values

    this.params = {
        screenX: 0, // minimum x value relative to screenWidth
        screenY: 0, // minimum y value relative to screenHeight
        width: k.width(), // total screen width
        height: k.height(), // total screen height

        backdropColor: getColor(), // backdrop color (same as home scene)
        backdropOpacity: k.opacity(1), // opacity of backdrop

        xInnerOffsetRatio: 0.01, // distance from left/right-most objects to banner left/right boundary
        yInnerOffsetRatio: 0.02, // distance from top/bottom of objects to banner top/bottom

        // Based on Home Scene dimensions
        titleWidthRatio: 0.35, // ratio compared to the screen width
        titleHeightRatio: 0.07, // ratio compared to the screen height
        yTitleOffsetRatio: 0.5, // ratio of y-spacing from screen top based on title height

        subTitleWidthRatio: 0.25, // ratio compared to the screen width
        subTitleHeightRatio: 0.05, // ratio compared to the screen height
        yTitleOffsetRatio: 0.5, // ratio of y-spacing from screen top based on title height

        controlIconScale: 0.45, // used to resize the control icons (home, volume, settings...)
        constrolIconXSpacerRatio: 0.35, // spacing ratio based on scaled icon height
        controlIconOpacity: k.opacity(0.9), // opacity of control-enabled icons

        board: {
            // (Same as Home Scene Menu Box)
            backgroundColor: k.color(52, 149, 235), // background color of the menu box
            backgroundOpacity: k.opacity(0.5), // opacity of the menu box
        }
    };

    // Scaling factor for each icon (except the usfCSIcon)
    this.params['iconRatio'] = Math.min((this.params.width / iconWidth), 
                                        (this.params.height / iconHeight));
                
    // Calculated spacing for the banner's inner boundaries
    this.params['xInnerSpacer'] = this.params.xInnerOffsetRatio * this.params.width;
    this.params['yInnerSpacer'] = this.params.yInnerOffsetRatio * this.params.height;
    
    // Scaled icon sizes and spacing for the control-enabled icons
    this.params['controlIcons'] = { // icons with actions (home, volume, settings)
        width: iconWidth * this.params.iconRatio * this.params.controlIconScale, // scaled width based on above ratio
        height: iconHeight * this.params.iconRatio * this.params.controlIconScale // scaled height based on above ratio
    };

    this.params['controlIcons'].xSpacer = this.params.controlIcons.width * this.params.constrolIconXSpacerRatio;
    this.params['controlIcons'].ySpacer = (this.params.height / 2) - (this.params.controlIcons.height / 2);

    // Adjusted width/height for the title text
    this.params['titleWidth'] = this.params.width * this.params.titleWidthRatio;
    this.params['titleHeight'] = this.params.height * this.params.titleHeightRatio;

    // Calculated distance between top of title and top of screen
    this.params['yTitleSpacer'] = this.params.titleHeight * this.params.yTitleOffsetRatio;

    this.objects = {};
    this.objects['title'] = {
        width: this.params.width * this.params.titleWidthRatio,
        height: this.params.height * this.params.titleHeightRatio,
        x: ((this.params.width / 2) - (this.params.titleWidth / 2)),
        y: (this.params.screenY + this.params.yTitleSpacer)
    }

    this.objects['bgColor'] = {
      width: this.params.width * this.params.subTitleWidthRatio,
      height: this.params.height * this.params.subTitleHeightRatio,
      x: ((this.params.width / 2) - (this.params.titleWidth / 2)),
      y: (this.params.screenY + this.params.yTitleSpacer + 100)
    }

    this.objects['back'] = { 
        x: ((this.params.width + this.params.screenX) // right-most edge
                    - this.params.xInnerSpacer // offset
                    - (this.params.controlIcons.width + this.params.controlIcons.xSpacer)), // this icon + spacer
        y: (this.params.screenY + this.params.controlIcons.ySpacer + this.params.yInnerSpacer)
    }
};


Settings.prototype.buildScene = function(color) {
    // Backdrop color
    k.add([
        k.rect(this.params.width, this.params.height),
        k.pos(this.params.screenX, this.params.screenY),
        k.color(color),
        this.params.backdropOpacity,
    ]);

    // Title
    k.add([
        k.text('Settings', { size: this.objects.title.height, width: this.objects.title.width }),
        k.pos(this.objects.title.x - 150, this.objects.title.y),
    ]);

    // bgColor Title
    k.add([
      k.text('Background color', { size: this.objects.bgColor.height - 10}),
      k.pos(this.objects.bgColor.x - 150, this.objects.bgColor.y),
    ]);

    k.add([
      k.text('(Effective after back)', { size: this.objects.bgColor.height - 25}),
      k.pos(this.objects.bgColor.x - 150, this.objects.bgColor.y + 50),
    ]);
    
    // current color
    k.add([
      k.text('Current', { size: this.objects.bgColor.height - 20}),
      k.pos(this.objects.bgColor.x , this.objects.bgColor.y + 110),
      //k.color(0,0,100),
    ]);


    // RGB
    let [curRed, curGreen, curBlue] = getColor()
    let showColor = k.add([
      "colorBlock",
      k.outline(4),
      k.color(curRed, curGreen, curBlue),
      k.rect(30, 30),
      k.pos(this.objects.bgColor.x+this.objects.bgColor.width - 100, this.objects.bgColor.y + 110),
    ])

    // select color
    k.add([
      k.text('Select', { size: this.objects.bgColor.height - 20, width: this.objects.bgColor.width }),
      k.pos(this.objects.bgColor.x  , this.objects.bgColor.y + 200),
      //k.color(0,0,100),
    ]);    

    // color option
    let whiteBtn = k.add([
      "colorBtn",
      k.outline(4),
      k.color(255,255,255),
      k.rect(30, 30),
      k.area(),
      k.pos(this.objects.bgColor.x+this.objects.bgColor.width - 150, this.objects.bgColor.y + 200)      
    ])

    let blueBtn = k.add([
      "colorBtn",
      k.outline(4),
      k.color(180, 200,250),
      k.rect(30, 30),
      k.area(),
      k.pos(this.objects.bgColor.x+this.objects.bgColor.width - 100, this.objects.bgColor.y + 200)
    ])

    let greenBtn = k.add([
      "colorBtn",
      k.outline(4),
      k.color(255,192,203),
      k.rect(30, 30),
      k.area(),
      k.pos(this.objects.bgColor.x+this.objects.bgColor.width - 50, this.objects.bgColor.y + 200)
    ])

    k.clicks("colorBtn", (btn)=>{
        setColor([btn.color.r, btn.color.g, btn.color.b])
        k.destroyAll("colorBlock")
        showColor = k.add([
          "colorBlock",
          k.outline(4),
          k.color(btn.color.r, btn.color.g, btn.color.b),
          k.rect(30, 30),
          k.pos(this.objects.bgColor.x+this.objects.bgColor.width - 100, this.objects.bgColor.y + 100)
        ])
    })

    // Back button
    const backBtn = k.add([
      k.text('Back', { size: this.objects.title.height - 30}),
      k.pos(this.objects.title.x + 500, this.objects.title.y + 600),
      k.color(0,0,100),
      k.area(),
    ]);
    backBtn.clicks(SceneControls.goHome);
};

export default Settings;