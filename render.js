var file;

onmessage = e => {
    var src = e.data;

    file = new XMLHttpRequest();

    file.open("GET", src, true);
    file.responseType = "arraybuffer";
    file.onload = fileLoaded;
    file.send();
}

function fileLoaded() {
    var responseData = file.response;
    var dataView = new DataView(responseData);

    var width = dataView.getInt32(2, true);
    var height = dataView.getInt32(6, true);
    var stripCount = dataView.getInt32(10, true);

    var imageData = new ImageData(width, height);

    var offset = 14, off = 0, x = 0;

    for (let y = 0; y < stripCount; y++)
    {
        var length = dataView.getInt32(offset, true);
        offset += 4;

        var r, g, b, a;

        if (length > 0) {

            r = dataView.getUint8(offset);
            g = dataView.getUint8(offset + 1);
            b = dataView.getUint8(offset + 2);
            a = dataView.getUint8(offset + 3);

            for (x; x < off + length; x++)
            {
                imageData.data[x * 4] = r;
                imageData.data[x * 4 + 1] = g;
                imageData.data[x * 4 + 2] = b;
                imageData.data[x * 4 + 3] = a;
            }

            offset += 4;
        
        } else {
            let len = Math.abs(length);
            for (x; x < off + len; x++)
            {
                r = dataView.getUint8(offset);
                g = dataView.getUint8(offset + 1);
                b = dataView.getUint8(offset + 2);
                a = dataView.getUint8(offset + 3);

                imageData.data[x * 4] = r;
                imageData.data[x * 4 + 1] = g;
                imageData.data[x * 4 + 2] = b;
                imageData.data[x * 4 + 3] = a;

                offset += 4;
            }
        }

        off = x;
    }

    postMessage(imageData);
}