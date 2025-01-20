//? DATA LIST: ../js/constants/dataSG1Kickoff.json
// {
// 	"HCM.Hoanglm18": "SG01B1",
// 	"HCM.Hoanglm18": "SG01B1",
// 	...
// }
// ?
// Initialize slot machine
const ENDPOINT_BACKEND =
	'https://icdpmobile.fpt.net/v1/icdp-backend-mobile/ct-tat-nien';
// ! VARIABLE
var PROGRAM_ID = '';
var USER_NAME = '';
var PASSWORD = '';

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

const programSelectList = document.getElementById('program_select_list');
const userNameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const realPasswordElement = document.getElementById('realPassword');
const durationDrawElement = document.getElementById('duration');

function calculateReelDuration(maxReelItems) {
	const timePerItem = 45; // 100ms cho 1 item => 45ms/item
	const totalDurationMs = maxReelItems * timePerItem; // Tổng thời gian quay (ms)
	const totalDurationSeconds = Math.ceil(totalDurationMs / 1000); // Chuyển đổi sang giây
	return Number(totalDurationSeconds);
}

function calculateMaxReelItems(durationInSeconds) {
	const timePerItem = 45; // 45ms cho mỗi item
	const totalDurationMs = durationInSeconds * 1000; // Chuyển giây sang mili giây
	const maxReelItems = Math.floor(totalDurationMs / timePerItem); // Làm tròn xuống số item
	return Number(maxReelItems);
}

durationDrawElement.value = calculateReelDuration(MAX_REEL_ITEMS);

const start = () => {
	const themeRedElement = document.getElementsByClassName('theme--red');
	const drawButton = document.getElementById('draw-button');
	const fullscreenButton = document.getElementById('fullscreen-button');
	const settingsButton = document.getElementById('settings-button');
	const prizesButton = document.getElementById('prizes-button');
	const userPrizesButton = document.getElementById('user-prizes-button');
	const userJoinButton = document.getElementById('user-join-button');
	const settingsWrapper = document.getElementById('settings');
	const prizesWrapper = document.getElementById('prizes');
	const userPrizesWrapper = document.getElementById('user-prizes');
	const userPrizesCount = document.getElementById('user-prizes-count');
	const userJoinWrapper = document.getElementById('user-join');
	const userJoinCount = document.getElementById('user-join-count');
	const settingsContent = document.getElementById('settings-panel');
	const prizesContent = document.getElementById('prizes-panel');
	const userPrizesContent = document.getElementById('user-prizes-panel');
	const userJoinContent = document.getElementById('user-join-panel');
	const settingsSaveButton = document.getElementById('settings-save');
	const settingsCloseButton = document.getElementById('settings-close');
	const userSettingsCloseButton = document.getElementById(
		'user-settings-close',
	);
	const userJoinCloseButton = document.getElementById('user-join-close');
	const prizesCloseButton = document.getElementById('prizes-close');
	const sunburstSvg = document.getElementById('sunburst');
	const confettiCanvas = document.getElementById('confetti-canvas');
	const nameListTextArea = document.getElementById('name-list');
	const removeNameFromListCheckbox =
		document.getElementById('remove-from-list');
	const enableSoundCheckbox = document.getElementById('enable-sound');

	const elementLoading = document.getElementById('middle');
	const elementResult = document.getElementById('name-persion-lucky');
	const tabelUserPrizeBody = document.getElementById('table_user_prize_body');
	const tabelUserJoinPrizeCount = document.getElementById(
		'table_user_join_prize_count',
	);
	const tabelUserJoinBody = document.getElementById('table_user_join_body');
	const tabelUserJoinPrizeJoinBody = document.getElementById(
		'table_user_join_prize_body',
	);

	// set backgroundImage
	themeRedElement[0].style.backgroundImage =
		'url(../../../assets/og/YEP_VTU.png)';

	// const programSelectList = document.getElementById('program_select_list');
	let optionsMuteSound = false;

	// Graceful exit if necessary elements are not found
	if (
		!(
			drawButton &&
			fullscreenButton &&
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

					// !TABLE USER PRIZE BODY
					const htmlTableBody = data.payload
						.map((item, _idx) => {
							const { email, fullName, phongBan } = { ...item };
							return `
								<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${email || '-'}</td>
										<td>${fullName || '-'}</td>
										<td>${phongBan || '-'}</td>
									</tr>
							`;
						})
						.join('');
					// !TABLE USER JOIN PRIZE BODY
					const htmlTableBodyJoinPrize = DATA_NO_PRIZE.map((item, _idx) => {
						const { email, fullName, phongBan } = { ...item };
						return `
								<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${email || '-'}</td>
										<td>${fullName || '-'}</td>
										<td>${phongBan || '-'}</td>
									</tr>
							`;
					}).join('');

					userJoinCount.innerHTML =
						data.payload.length > 0
							? `(${data.payload.length.toLocaleString()})`
							: '';
					tabelUserJoinBody.innerHTML =
						data.payload.length > 0
							? htmlTableBody
							: `<tr style="text-align: center">
									<td style="padding: 12px" colspan="4">Không có dữ liệu</td>
							</tr>`;

					tabelUserJoinPrizeCount.innerHTML =
						DATA_NO_PRIZE.length > 0
							? `(${DATA_NO_PRIZE.length.toLocaleString()})`
							: '';
					tabelUserJoinPrizeJoinBody.innerHTML =
						DATA_NO_PRIZE.length > 0
							? htmlTableBodyJoinPrize
							: `<tr style="text-align: center">
									<td style="padding: 12px" colspan="4">Không có dữ liệu</td>
							</tr>`;
					// !

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
		userPrizesButton.disabled = true;
		userJoinButton.disabled = true;
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
		userPrizesButton.disabled = false;
		userJoinButton.disabled = false;
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

	// !!! WARNING
	passwordElement.addEventListener('input', (e) => {
		// !! ADD HIDDEN INPUT
		const value = e.target.value;

		// So sánh giá trị mới nhập và cập nhật giá trị thực
		if (value.length > PASSWORD.length) {
			// Người dùng thêm ký tự
			PASSWORD += value.slice(PASSWORD.length);
		} else if (value.length < PASSWORD.length) {
			// Người dùng xóa ký tự
			PASSWORD = PASSWORD.slice(0, value.length);
		}

		// Hiển thị dấu *
		passwordElement.value = '*'.repeat(value.length);
		realPasswordElement.value = PASSWORD;
		// !!!

		// !COMMENT
		// PASSWORD = e.target.value;
		// !
	});
	//!!!!!!

	durationDrawElement.addEventListener('input', (e) => {
		MAX_REEL_ITEMS = calculateMaxReelItems(e.target.value);
	});

	/** Slot instance */
	const slot = new Slot({
		reelContainerSelector: '#reel',
		selectProgramContainer: '#program_select_list',
		usernameElementContainer: '#username',
		passwordElementContainer: '#realPassword', //#password
		durationElementContainer: '#duration',
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

	const onUserPrizesOpen = async () => {
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

					const DATA_PRIZE = data?.payload
						?.map((item) => {
							if (item?.status === 'PRIZED') {
								return item;
							}
						})
						?.filter((x) => x);

					// !TABLE USER PRIZE BODY
					const htmlTableBody = DATA_PRIZE.map((item, _idx) => {
						const { email, fullName, phongBan } = { ...item };
						return `<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${email || '-'}</td>
										<td>${fullName || '-'}</td>
										<td>${phongBan || '-'}</td>
									</tr>
							`;
					}).join('');

					userPrizesCount.innerHTML =
						DATA_PRIZE.length > 0
							? `(${DATA_PRIZE?.length.toLocaleString()})`
							: '';
					tabelUserPrizeBody.innerHTML =
						DATA_PRIZE.length > 0
							? htmlTableBody
							: `<tr style="text-align: center">
									<td style="padding: 12px" colspan="4">Không có dữ liệu</td>
							</tr>`;
					// !
				});
		}
		userPrizesWrapper.style.display = 'block';
	};

	const onUserJoinOpen = () => {
		userJoinWrapper.style.display = 'block';
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

	const onUserPrizesClose = (e) => {
		e.stopPropagation();
		userPrizesContent.scrollTop = 0;
		userPrizesWrapper.style.display = 'none';
	};

	const onUserJoinClose = (e) => {
		e.stopPropagation();
		userJoinContent.scrollTop = 0;
		userJoinWrapper.style.display = 'none';
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
	userPrizesButton.addEventListener('click', onUserPrizesOpen);
	userJoinButton.addEventListener('click', onUserJoinOpen);

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
	userSettingsCloseButton.addEventListener('click', onUserPrizesClose);
	userJoinCloseButton.addEventListener('click', onUserJoinClose);

	// Click SETTINGS
	settingsWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'none';
	});

	prizesWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesWrapper.style.display = 'none';
	});

	userPrizesWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		userPrizesWrapper.style.display = 'none';
	});

	userJoinWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		userJoinWrapper.style.display = 'none';
	});

	settingsContent.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'block';
	});

	prizesContent.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesWrapper.style.display = 'block';
	});

	userPrizesContent.addEventListener('click', (e) => {
		e.stopPropagation();
		userPrizesWrapper.style.display = 'block';
	});

	userJoinContent.addEventListener('click', (e) => {
		e.stopPropagation();
		userJoinWrapper.style.display = 'block';
	});
};

start();
