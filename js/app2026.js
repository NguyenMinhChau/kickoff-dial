const ENDPOINT_BACKEND =
	'https://icdpmobile.fpt.net/v1/icdp-backend-mobile/ct-tat-nien';
// ! VARIABLE
var PROGRAM_ID = '';
var USER_NAME = '';
var PASSWORD = '';
var PRIZE = null;
var PRIZE_DATA = null;
var MY_CHART = null;

const URL_BACKGROUND_HEADER_FORM =
	'https://sf-static.upanhlaylink.com/img/image_20250826bb2383fa4c5c3fb975fc6130ddee0961.jpg';
const URL_BACKGROUND = 'url(../../../assets/og/YEP_HCM_2026.png)';

let MAX_REEL_ITEMS = 111; // ! THỜI GIAN CỦA VÒNG QUAY
const CONFETTI_COLORS = [
	'#26ccff',
	'#a25afd',
	'#ff5e7e',
	'#88ff5a',
	'#fcff42',
	'#ffa62d',
	'#ff36ff',
];

const start = () => {
	const drawButton = document.getElementById('draw-button');
	const elementResult = document.getElementById('name-persion-lucky');
	const confettiCanvas = document.getElementById('confetti-canvas');

	let confettiAnimationId;

	if (
		!(
			drawButton &&
			elementResult &&
			confettiCanvas
		)
	) {
		console.error('One or more Element ID is invalid. This is possibly a bug.');
		return;
	}

	if (!(confettiCanvas instanceof HTMLCanvasElement)) {
		console.error(
			'Confetti canvas is not an instance of Canvas. This is possibly a bug.',
		);
		return;
	}
	/** Confetti animation instance */
	const customConfetti = confetti.create(confettiCanvas, {
		resize: true,
		useWorker: true,
	});

	const confettiAnimation = () => {
		const windowWidth =
			window.innerWidth ||
			document.documentElement.clientWidth ||
			document.getElementsByTagName('body')[0].clientWidth;
		const confettiScale = Math.max(0.5, Math.min(1, windowWidth / 1100));

		customConfetti({
			particleCount: 1,
			gravity: 0.8,
			spread: 90,
			origin: { y: 0.6 },
			colors: [
				CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
			],
			scalar: confettiScale,
		});

		confettiAnimationId = window.requestAnimationFrame(confettiAnimation);
	};

	drawButton.addEventListener('click', async (e) => {
		console.log(1111);
		confettiAnimation();

		elementResult.classList.remove('hiddenElement');
	});
	
};

document.addEventListener('DOMContentLoaded', () => {
	start();
});
