const video = document.getElementById("video-input");
const canvas = document.getElementById("canvas-output");

(async () => {
	const stream = await navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false
	});

let src = new cv.Mat(video.height, video.width, cv.CV_8UC4)
let cap = new cv.VideoCapture(video);

if(!stream){
	src.delete();
	cap.delete();
	return;
}

video.srcObject = stream;
video.play();

const FPS = 30;

function processVideo(){
	cap.read(src);

	let gray = new cv.Mat();
	cv.cvtColor(src, gray, cv.COLOR_RGB2GRAY);

	let thresh = new cv.Mat();
	cv.threshold(gray, thresh, 80, 255, cv.THRESH_BINARY);

	let hierarchy = new cv.Mat();
	let countours = new cv.MatVector();

	cv.findContours(
		thresh,
		countours,
		hierarchy,
		cv.RETR_CCOMP,
		cv.CHAIN_APPROX_SIMPLE
	);

	for (let i = 0; i < countours.size(); i++){
		let color = new cv.Scalar(255,0, 0)
		cv.drawContours(src, countours, i, 
			color, 1, cv.LINE_8, hierarchy, 100);
	}

	cv.imshow("canvas-output", src);

	setTimeout(processVideo, 0);

}

setTimeout(processVideo, 0);

})();