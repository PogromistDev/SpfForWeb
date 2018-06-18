var img = document.querySelectorAll("img[src$='.spf']");

function SPF(width, height, stripCount)
{
    this.width = width;
    this.height = height;
    this.stripCount = stripCount;
}

img.forEach(function(item)
{
    render(item);
});

function render(item)
{
    var file = new XMLHttpRequest();

    file.open("GET", item.src, true);
    file.responseType = "arraybuffer";
    file.send();
    file.onload = function(data)
    {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    var responseData, dataView;
    var image;

    responseData = file.response;
    dataView = new DataView(responseData);

    image = new SPF(dataView.getInt32(2, true), dataView.getInt32(6, true), dataView.getInt32(10, true))

    canvas.width = image.width;
    canvas.height = image.height;

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var offset = 14, off = 0, x = 0;

    for (var y = 0; y < image.stripCount; y++)
    {
        var length = dataView.getInt32(offset, true);
        offset += 4;

        var r, g, b, t;
        r = dataView.getUint8(offset);
        g = dataView.getUint8(offset + 1);
        b = dataView.getUint8(offset + 2);
        t = dataView.getUint8(offset + 3);

        for (x; x < off + length; x++)
        {
            //xx = x % canvas.width;
            //yy = x / canvas.width;

            imageData.data[x * 4] = r;
            imageData.data[x * 4 + 1] = g;
            imageData.data[x * 4 + 2] = b;
            imageData.data[x * 4 + 3] = 255;
        }

        offset += 4;
        off = x;
    }

    context.putImageData(imageData, 0, 0);

    delete imageData;
    delete canvas;

    var imm = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    item.src = imm;
    //window.open(imm, "_blank");
    }
}