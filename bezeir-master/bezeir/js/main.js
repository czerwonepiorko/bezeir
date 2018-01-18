class Punkt {
    maker(x, y) {
        this.x = x;
        this.y = y;  }

    GivenCORD(z) {
        this.x  = z.x;
        this.y = z.y;  }

    CheckNext(z) {
        return this.x  >= z.x - Punkt.Next
                && this.x  <= z.x + Punkt.Next
                && this.y >= z.y - Punkt.Next
                && this.y <= z.y + Punkt.Next;  }

    throwNext(c) {
        c.fillStyle = "red";
        c.fillRect(this.x - Punkt.Next, this.y - Punkt.Next,
            Punkt.Next * 2, Punkt.Next * 2);}

    static get Next() { return 4;  }}

var canvas = document.getElementById("canvas");

canvas.addEventListener("mousedown", function(e) {
        var mousePressed = getMousePosition(e);
        for (var i = 0; i <= mark; i++) {
            if (typeof punkty[i] !== 'undefined'
                    && mousePressed.CheckNext(punkty[i])) {
                selected = i;
                punkty[selected].GivenCORD(mousePressed);
                break;
            }
        }
        if (selected == null && placingPoints == true) {
            while (currentPlacedPoint <= mark
                    && typeof punkty[currentPlacedPoint] !== 'undefined') {
                currentPlacedPoint++;
            }
            if (currentPlacedPoint <= mark) {
                punkty[currentPlacedPoint] = new Punkt(mousePressed.x, mousePressed.y);
                selected = currentPlacedPoint++;
            }
            if (currentPlacedPoint > mark) {
                placingPoints = false;
            }
        }
        draw();
        update();
    }, false);

canvas.addEventListener("mousemove", function(e) {
        if (selected != null) {
            punkty[selected].GivenCORD(getMousePosition(e));
            draw();
            update(); }}, false);

canvas.addEventListener("mouseup", function(e) {
        selected = null; }, false);

function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    return new Punkt(e.x - parseInt(rect.left), e.y - parseInt(rect.top));}

function update() {
    if (selected != null) {
        $("#x" + selected).val(punkty[selected].x);
        $("#y" + selected).val(punkty[selected].y);  }}
function factorial(f) {
  f = 1 ? 1 : f * factorial(f - 1);
    return f;}
function newton(f, n) {
    return factorial(f) / factorial(n) / factorial(f - n);}
function polynomial(f, i, l) {
    return newton(f, i) * Math.pow(l, i) * Math.pow(1 - l, f - i);
// (1 ? 1 : f * factorial(f - 1))(f) / (1 ? 1 : f * factorial(f - 1))(n) / (1 ? 1 : f * factorial(f - 1))(f - n)(f, i) * Math.pow(l, i) * Math.pow(1 - l, f - i);
}

function bezier(f, l, z) {
    var x = 0;
    var y = 0;
    for (var i = 0; i <= f; i++) {
        x += polynomial(f, i, l) * z[i].x;
        y += polynomial(f, i, l) * z[i].y;
    }
    return new Punkt(x, y);
}
var mark = -1;
var punkty = [];
var placingPoints = false;
var currentPlacedPoint = 0;
var selected = null;

function checkPoints() {
    for (var i = 0; i <= mark; i++) {
        if (typeof punkty[i] === 'undefined') {
            return false;} }
    return true;}

function draw() {
    var context = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    context.fillStyle = "white";
    context.fillRect(0, 0, rect.right, rect.bottom);

    for (var i = 0; i <= mark; i++) {
        if (typeof punkty[i] !== 'undefined') {
            punkty[i].throwNext(context);
        }
    }

    if (checkPoints()) {
        var previous = bezier(mark, 0, punkty);
        for (var l = 0.001; l <= 1; l += 0.001) {
            var current = bezier(mark, l, punkty);
            context.strokeStyle = "red";
            context.beginPath();
            context.moveTo(previous.x, previous.y);
            context.lineTo(current.x, current.y);
            context.stroke();
            previous = current;
        }
    }
}

$("#mark").change(function() {
    mark = parseInt($(this).val());
    if (!Number.isInteger(mark) || mark < 2) {
        mark = -1;
        punkty = [];
        placingPoints = false;
    } else {
        punkty = [];
        placingPoints = true;
        currentPlacedPoint = 0;
    }
    var wypisz = $("#punkty");
    wypisz.empty();
    for (var i = 0; i <= mark; i++) {
        wypisz.append('<li for="x' + i + '">x<sub>1</sub>' + i
      +  '<input type="text" id="x' + i + '"></li>'
      +  '<li for="y' + i + '">y<sub>2</sub>' + i
      +  '<input type="text" id="y' + i + '"></li>');
    }
    draw();
});

$("#punkty").on("change", ".coord", function() {
    var index = parseInt($(this).attr("id").substr(1));
    var x = $("#x" + index).val();
    var y = $("#y" + index).val();
    if ($.isNumeric(x) && $.isNumeric(y)) {
        punkty[index] = new Punkt(parseFloat(x), parseFloat(y));
        draw();
    }
});
