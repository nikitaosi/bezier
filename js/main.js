var renderer = PIXI.autoDetectRenderer({width: 800, height: 600, antialias: true});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var texture = PIXI.Texture.from('img/dot.png');

renderer.backgroundColor = 0xACD0CA;

/*Объявление точек*/
var dotOne = new PIXI.Sprite(texture);
var dotTwo = new PIXI.Sprite(texture);
var dotThree = new PIXI.Sprite(texture);
var dotFour = new PIXI.Sprite(texture);
var dotFive = new PIXI.Sprite(texture);
var dotSix = new PIXI.Sprite(texture);

createDot(Math.floor(Math.random() * 790 + 5), Math.floor(Math.random() * 295 + 305), dotOne);
createDot(Math.floor(Math.random() * 790 + 5), Math.floor(Math.random() * 295 + 305), dotTwo);
createDot(Math.floor(Math.random() * 790 + 5), Math.floor(Math.random() * 295 + 305), dotThree);
createDot(Math.floor(Math.random() * 790 + 5), Math.floor(Math.random() * 295 + 305), dotFour);
createDot(Math.floor(Math.random() * 790 + 5), Math.floor(Math.random() * 295), dotFive);
createDot(Math.floor(Math.random() * 790 + 5), Math.floor(Math.random() * 295), dotSix);

/*Кривая Безье по двум точкам*/
let bezierTwo = new PIXI.Graphics();
bezierTwo.lineStyle(5, 0xFFFFFF, 1);
bezierTwo.moveTo(dotFive.position.x, dotFive.position.y);
bezierTwo.lineTo(dotSix.position.x, dotSix.position.y);
stage.addChild(bezierTwo);

/* Разделитель холста */
var line = new PIXI.Graphics();
line.lineStyle(2, 0x111111, 1);
line.moveTo(0, 300);
line.lineTo(800, 300);
stage.addChild(line);

/*Кривая Безье по четырём точкам*/
let bezierFour = new PIXI.Graphics();
bezierFour.lineStyle(5, 0xFFFFFF, 1);
bezierFour.moveTo(dotOne.position.x, dotOne.position.y);
bezierFour.bezierCurveTo(dotTwo.position.x, dotTwo.position.y,
dotThree.position.x, dotThree.position.y,
dotFour.position.x, dotFour.position.y);
stage.addChild(bezierFour);

/*Объявление зон, за которые нельзя переместить точки*/
var limits = {
top: 5,
left: 5,
right: 795,
bottom: 595,
};

function createDot(x, y, dot)
{
    dot.interactive = true;
    dot.buttonMode = true;
    dot.anchor.set(0.5);
    dot.scale.set(1.5);
    dot
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    dot.position.x = x;
    dot.position.y = y;

    stage.addChild(dot);
}

requestAnimationFrame(render);

function render() {

    /*Каждый кадр стираем кривую и отрисовываем заново для новых точек*/
    bezierTwo.clear();
    bezierTwo.lineStyle(5, 0xFFFFFF, 1);
    bezierTwo.moveTo(dotFive.position.x, dotFive.position.y);
    bezierTwo.lineTo(dotSix.position.x, dotSix.position.y);

    bezierFour.clear();
    bezierFour.lineStyle(5, 0xFFFFFF, 1);
    bezierFour.moveTo(dotOne.position.x, dotOne.position.y);
    bezierFour.bezierCurveTo(dotTwo.position.x, dotTwo.position.y,
        dotThree.position.x, dotThree.position.y,
        dotFour.position.x, dotFour.position.y);

    renderer.render(stage);
    requestAnimationFrame(render);
}

function onDragStart(event)
{
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;

        /*Ограничиваем область перетаскивания*/
        if (this.position.x > limits.right) {
            this.position.x = limits.right;
        } else if (this.position.x < limits.left) {
            this.position.x = limits.left;
        }
        if (this.position.y > limits.bottom/2-5 && (this == dotFive || this == dotSix)) {
            this.position.y = limits.bottom/2-5;
        } else if (this.position.y < limits.top) {
            this.position.y = limits.top;
        } else if (this.position.y > limits.bottom) {
            this.position.y = limits.bottom;
        } else if (this.position.y < limits.bottom/2+10 && (this == dotOne || this == dotTwo || this == dotThree || this == dotFour)) {
            this.position.y = limits.bottom/2+10;
        }
        }
    }
