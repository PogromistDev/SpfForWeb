var img = document.querySelectorAll("img[src$='.spf']");

for (let item of img) {

	var worker = new Worker("render.js");

	worker.onmessage = function(e) {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		var imgData = e.data;

		canvas.width = imgData.width;
		canvas.height = imgData.height;

		context.putImageData(imgData, 0, 0);

		var imm = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

		item.src = imm;

		delete imgData;
		delete canvas;

		this.terminate();
	}

	worker.postMessage(item.src);
}