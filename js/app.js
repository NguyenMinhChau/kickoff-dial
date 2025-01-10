// Initialize slot machine
(() => {
	const drawButton = document.getElementById('draw-button');
	const fullscreenButton = document.getElementById('fullscreen-button');
	const settingsButton = document.getElementById('settings-button');
	const settingsWrapper = document.getElementById('settings');
	const settingsContent = document.getElementById('settings-panel');
	const settingsSaveButton = document.getElementById('settings-save');
	const settingsCloseButton = document.getElementById('settings-close');
	const sunburstSvg = document.getElementById('sunburst');
	const confettiCanvas = document.getElementById('confetti-canvas');
	const nameListTextArea = document.getElementById('name-list');
	const removeNameFromListCheckbox =
		document.getElementById('remove-from-list');
	const enableSoundCheckbox = document.getElementById('enable-sound');

	const elementLoading = document.getElementById('middle');
	const elementResult = document.getElementById('name-persion-lucky');
	let optionsMuteSound = false;

	// Graceful exit if necessary elements are not found
	if (
		!(
			drawButton &&
			fullscreenButton &&
			settingsButton &&
			settingsWrapper &&
			settingsContent &&
			settingsSaveButton &&
			settingsCloseButton &&
			sunburstSvg &&
			confettiCanvas &&
			nameListTextArea &&
			removeNameFromListCheckbox &&
			enableSoundCheckbox &&
			elementLoading &&
			elementResult
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

	const soundEffects = new SoundEffects();
	let sound = new Audio('../assets/Ring_Spin_2024.mp3');
	let soundWinner = new Audio('../assets/Win.mp3');

	// Thời gian chạy random

	const MAX_REEL_ITEMS = 365;
	const CONFETTI_COLORS = [
		'#26ccff',
		'#a25afd',
		'#ff5e7e',
		'#88ff5a',
		'#fcff42',
		'#ffa62d',
		'#ff36ff',
	];
	let confettiAnimationId;

	/** Confetti animation instance */
	const customConfetti = confetti.create(confettiCanvas, {
		resize: true,
		useWorker: true,
	});

	/** Triggers confetti animation until animation is canceled */
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

	/** Function to stop the winning animation */
	const stopWinningAnimation = () => {
		if (confettiAnimationId) {
			window.cancelAnimationFrame(confettiAnimationId);
		}
		sunburstSvg.style.display = 'none';
	};

	/** Function to be triggered before spinning */
	const onSpinStart = () => {
		console.log('Start Spin');
		if (optionsMuteSound === false) {
			sound.play();
		}

		// Show loading
		elementResult.classList.add('hiddenElement');
		// Remove result
		elementLoading.classList.remove('hiddenElement');

		stopWinningAnimation();
		drawButton.disabled = true;
		drawButton.style.display = 'none';
		settingsButton.disabled = true;
		// soundEffects.spin((MAX_REEL_ITEMS - 1) / 10);
	};

	/** Function to be triggered after spinning */
	const onSpinEnd = async () => {
		// sound.pause();

		confettiAnimation();
		soundWinner.play();
		sunburstSvg.style.display = 'flex';
		// await soundEffects.win();
		drawButton.disabled = false;
		drawButton.style.display = 'inline-block';
		settingsButton.disabled = false;
		console.log('Done spin');

		// Remove loading
		elementResult.classList.remove('hiddenElement');
		// Show result
		elementLoading.classList.add('hiddenElement');

		const luckyNumber = slot.getLuckyNumber;
		// elementResult.innerHTML = dataInfo[luckyNumber.toString()];

		fetch('../js/constants/dataSG1Kickoff.json')
			.then((response) => response.json())
			.then((data) => {
				elementResult.innerHTML = data[luckyNumber.toString()];
			});
	};

	/** Slot instance */
	const slot = new Slot({
		reelContainerSelector: '#reel',
		maxReelItems: MAX_REEL_ITEMS,
		onSpinStart,
		onSpinEnd,
		onNameListChanged: stopWinningAnimation,
	});

	/** To open the setting page */
	const onSettingsOpen = () => {
		nameListTextArea.value = slot.names.length ? slot.names.join('\n') : '';
		removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
		enableSoundCheckbox.checked = !soundEffects.mute;
		settingsWrapper.style.display = 'block';
	};

	/** To close the setting page */
	const onSettingsClose = (e) => {
		e.stopPropagation();
		settingsContent.scrollTop = 0;
		settingsWrapper.style.display = 'none';
	};

	// Click handler for "Draw" button
	drawButton.addEventListener('click', () => {
		if (!slot.names.length) {
			onSettingsOpen();
			return;
		}

		slot.spin();
	});

	// Hide fullscreen button when it is not supported
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore - for older browsers support
	if (
		!(document.documentElement.requestFullscreen && document.exitFullscreen)
	) {
		fullscreenButton.remove();
	}

	// Click handler for "Fullscreen" button
	fullscreenButton.addEventListener('click', () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			return;
		}

		if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	});

	// Click handler for "Settings" button
	settingsButton.addEventListener('click', onSettingsOpen);

	// Click handler for "Save" button for setting page
	settingsSaveButton.addEventListener('click', (e) => {
		e.stopPropagation();
		slot.names = nameListTextArea.value
			? nameListTextArea.value
					.split(/\n/)
					.filter((name) => Boolean(name.trim()))
			: [];
		// slot.names = Object.keys(dataInfo);

		fetch('../js/constants/dataSG1Kickoff.json')
			.then((response) => response.json())
			.then((data) => {
				slot.names = Object.keys(data);
			});
		slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
		soundEffects.mute = !enableSoundCheckbox.checked;
		optionsMuteSound = soundEffects.mute;
		onSettingsClose(e);
	});

	// Click handler for "Discard and close" button for setting page
	settingsCloseButton.addEventListener('click', onSettingsClose);

	// Click SETTINGS
	settingsWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'none';
	});

	settingsContent.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'block';
	});
})();
