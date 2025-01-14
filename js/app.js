// Initialize slot machine
const ENDPOINT_BACKEND =
	'https://icdpmobile.fpt.net/v1/icdp-backend-mobile/ct-tat-nien';
// ! VARIABLE
var PROGRAM_ID = '';
var USER_NAME = '';
var PASSWORD = '';

const programSelectList = document.getElementById('program_select_list');
const userNameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');

const start = () => {
	const drawButton = document.getElementById('draw-button');
	const fullscreenButton = document.getElementById('fullscreen-button');
	const settingsButton = document.getElementById('settings-button');
	const prizesButton = document.getElementById('prizes-button');
	const settingsWrapper = document.getElementById('settings');
	const prizesWrapper = document.getElementById('prizes');
	const settingsContent = document.getElementById('settings-panel');
	const prizesContent = document.getElementById('prizes-panel');
	const settingsSaveButton = document.getElementById('settings-save');
	const settingsCloseButton = document.getElementById('settings-close');
	const prizesCloseButton = document.getElementById('prizes-close');
	const sunburstSvg = document.getElementById('sunburst');
	const confettiCanvas = document.getElementById('confetti-canvas');
	const nameListTextArea = document.getElementById('name-list');
	const removeNameFromListCheckbox =
		document.getElementById('remove-from-list');
	const enableSoundCheckbox = document.getElementById('enable-sound');

	const elementLoading = document.getElementById('middle');
	const elementResult = document.getElementById('name-persion-lucky');
	// const programSelectList = document.getElementById('program_select_list');
	let optionsMuteSound = false;

	// Graceful exit if necessary elements are not found
	if (
		!(drawButton && fullscreenButton && settingsButton && prizesButton,
		settingsWrapper && prizesWrapper,
		settingsContent && prizesContent,
		settingsSaveButton &&
			settingsCloseButton &&
			prizesCloseButton &&
			sunburstSvg &&
			confettiCanvas &&
			nameListTextArea &&
			removeNameFromListCheckbox &&
			enableSoundCheckbox &&
			elementLoading &&
			elementResult)
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

	// ! FORMAT DATA SLOT
	const formatSlotJSON = (data) => {
		if (Array.isArray(data)) {
			return data.reduce((acc, item) => {
				acc[item.email] = item.phongBan;
				return acc;
			}, {});
		}
		return {};
	};
	// !!!

	// ! GET PROGRAM
	const getProgram = async () => {
		await fetch(`${ENDPOINT_BACKEND}/create-program`, {
			method: 'GET',
		})
			.then((response) => {
				return response.json();
			})
			.then(async (data) => {
				const { success, errors } = { ...data };
				if (!success) {
					alert(errors?.[0]?.message || 'Thao tác không thành công');
					return;
				}
				programSelectList.innerHTML = '<option value="">Đang tải...</option>';

				try {
					if (data.payload && data.payload.length > 0) {
						programSelectList.innerHTML = data.payload
							.map(
								(program) =>
									`<option value="${program._id}">${program.nameProgram}</option>`,
							)
							.join('');
						programSelectList.options[0].selected = true;
						const firstValue = programSelectList.value;
						PROGRAM_ID = firstValue;
						setSlotNames();
					} else {
						programSelectList.innerHTML =
							'<option value="">Không có chương trình nào</option>';
					}
				} catch (error) {
					programSelectList.innerHTML =
						'<option value="">Lỗi tải dữ liệu</option>';
				}
			});
	};
	getProgram();
	// !!!

	// ! SET SLOTS NAME
	const setSlotNames = async () => {
		if (PROGRAM_ID) {
			await fetch(`${ENDPOINT_BACKEND}/get-users-by-program/${PROGRAM_ID}`, {
				method: 'GET',
			})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					const { success, errors } = { ...data };
					if (!success) {
						alert(errors?.[0]?.message || 'Thao tác không thành công');
						return;
					}
					const DATA_NO_PRIZE = data?.payload
						?.map((item) => {
							if (item?.status !== 'PRIZED') {
								return item;
							}
						})
						?.filter((x) => x);

					slot.names = nameListTextArea.value
						? nameListTextArea.value
								.split(/\n/)
								.filter((name) => Boolean(name.trim()))
						: [];
					slot.names = Object.keys(formatSlotJSON(DATA_NO_PRIZE));
				});
		}
	};
	setSlotNames();
	// !!!

	programSelectList.addEventListener('change', async (e) => {
		PROGRAM_ID = e.target.value;
		await fetch(`${ENDPOINT_BACKEND}/get-users-by-program/${PROGRAM_ID}`, {
			method: 'GET',
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				const { success, errors } = { ...data };
				if (!success) {
					alert(errors?.[0]?.message || 'Thao tác không thành công');
					return;
				}
				const DATA_NO_PRIZE = data?.payload
					?.map((item) => {
						if (item?.status !== 'PRIZED') {
							return item;
						}
					})
					?.filter((x) => x);

				nameListTextArea.value = Object.keys(formatSlotJSON(DATA_NO_PRIZE))
					.length
					? Object.keys(formatSlotJSON(DATA_NO_PRIZE))
							.map((item, index) => {
								return `${index + 1}. ${item}`;
							})
							.join('\n')
					: '';
			});
		setSlotNames();
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
		prizesButton.disabled = true;
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
		prizesButton.disabled = false;
		console.log('Done spin');

		// Remove loading
		elementResult.classList.remove('hiddenElement');
		// Show result
		elementLoading.classList.add('hiddenElement');

		const luckyNumber = slot.getLuckyNumber;

		// ! COMMENT
		// elementResult.innerHTML = dataInfo[luckyNumber.toString()];

		// fetch('../js/constants/dataSG1Kickoff.json')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		elementResult.innerHTML = data[luckyNumber.toString()];
		// 	});
		// !!!!

		await fetch(`${ENDPOINT_BACKEND}/get-users-by-program/${PROGRAM_ID}`, {
			method: 'GET',
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				const { success, errors } = { ...data };
				if (!success) {
					alert(errors?.[0]?.message || 'Thao tác không thành công');
					return;
				}
				const dataJSON = formatSlotJSON(data?.payload);
				const _userPrize = data?.payload?.filter(
					(x) => x.email === luckyNumber,
				)?.[0];
				elementResult.innerHTML = `${
					_userPrize?.fullName + ' - ' + dataJSON[luckyNumber.toString()]
				}`;
			});
	};

	userNameElement.addEventListener('input', (e) => {
		USER_NAME = e.target.value;
	});

	passwordElement.addEventListener('input', (e) => {
		PASSWORD = e.target.value;
	});

	/** Slot instance */
	const slot = new Slot({
		reelContainerSelector: '#reel',
		selectProgramContainer: '#program_select_list',
		usernameElementContainer: '#username',
		passwordElementContainer: '#password',
		maxReelItems: MAX_REEL_ITEMS,
		onSpinStart,
		onSpinEnd,
		onNameListChanged: stopWinningAnimation,
		ENDPOINT_BACKEND: ENDPOINT_BACKEND,
	});

	/** To open the setting page */
	const onSettingsOpen = () => {
		nameListTextArea.value = slot.names.length
			? slot.names
					.map((item, index) => {
						return `${index + 1}. ${item}`;
					})
					.join('\n')
			: '';
		removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
		enableSoundCheckbox.checked = !soundEffects.mute;
		settingsWrapper.style.display = 'block';
	};

	const onPrizesOpen = () => {
		prizesWrapper.style.display = 'block';
	};

	/** To close the setting page */
	const onSettingsClose = (e) => {
		e.stopPropagation();
		settingsContent.scrollTop = 0;
		settingsWrapper.style.display = 'none';
	};

	const onPrizesClose = (e) => {
		e.stopPropagation();
		prizesContent.scrollTop = 0;
		prizesWrapper.style.display = 'none';
	};

	// Click handler for "Draw" button
	drawButton.addEventListener('click', () => {
		if (!slot.names.length) {
			onSettingsOpen();
			return;
		}

		if (!USER_NAME || !PASSWORD) {
			onSettingsOpen();
			if (!userNameElement.value) return userNameElement.focus();
			passwordElement.focus();
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
	prizesButton.addEventListener('click', onPrizesOpen);

	// Click handler for "Save" button for setting page
	settingsSaveButton.addEventListener('click', (e) => {
		e.stopPropagation();

		// ! COMMENT
		// slot.names = nameListTextArea.value
		// 	? nameListTextArea.value
		// 			.split(/\n/)
		// 			.filter((name) => Boolean(name.trim()))
		// 	: [];
		// slot.names = Object.keys(dataInfo);

		// fetch('../js/constants/dataSG1Kickoff.json')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		slot.names = Object.keys(data);
		// 	});
		// !!!!

		slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
		soundEffects.mute = !enableSoundCheckbox.checked;
		optionsMuteSound = soundEffects.mute;
		onSettingsClose(e);
	});

	// Click handler for "Discard and close" button for setting page
	settingsCloseButton.addEventListener('click', onSettingsClose);
	prizesCloseButton.addEventListener('click', onPrizesClose);

	// Click SETTINGS
	settingsWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'none';
	});

	prizesWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesWrapper.style.display = 'none';
	});

	settingsContent.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'block';
	});

	prizesContent.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesWrapper.style.display = 'block';
	});
};

start();
