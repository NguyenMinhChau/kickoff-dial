const ENDPOINT_BACKEND =
	'https://icdpmobile.fpt.net/v1/icdp-backend-mobile/ct-tat-nien';

// ! VARIABLE
var PROGRAM_ID = '';
var USER_NAME = '';
var PASSWORD = '';
var DIGIT_COUNT = 3; // Mặc định 3 số, có thể chỉnh trong settings
var PRIZE = null;
var PRIZE_DATA = null;

const URL_BACKGROUND = 'url(./assets/og/YEP_HNI_2026.png)';
const CONFETTI_COLORS = [
	'#26ccff',
	'#a25afd',
	'#ff5e7e',
	'#88ff5a',
	'#fcff42',
	'#ffa62d',
	'#ff36ff',
];

// DOM ELEMENTS
const manualInputArea = document.getElementById('manual-input-area');
const digitInputsContainer = document.getElementById('digit-inputs-container');
const digitCountSelect = document.getElementById('digit_count_select');

const drawButton = document.getElementById('draw-button');
const resetButton = document.getElementById('reset-button');
const elementLoading = document.getElementById('middle');
const elementResult = document.getElementById('name-persion-lucky');
const sunburstSvg = document.getElementById('sunburst');
const confettiCanvas = document.getElementById('confetti-canvas');

// SETTINGS & MODALS
const programSelectList = document.getElementById('program_select_list');
const userNameElement = document.getElementById('username');
const passwordElement = document.getElementById('password');
const realPasswordElement = document.getElementById('realPassword');
const settingsWrapper = document.getElementById('settings');
const enableSoundCheckbox = document.getElementById('enable-sound');

// TABLES
const tabelUserJoinPrizeBody = document.getElementById(
	'table_user_join_prize_body',
);
const tabelUserJoinPrizeCount = document.getElementById(
	'table_user_join_prize_count',
);
const tabelUserJoinBody = document.getElementById('table_user_join_body');
const userJoinCount = document.getElementById('user-join-count');
const tabelUserPrizeBody = document.getElementById('table_user_prize_body');
const userPrizesCount = document.getElementById('user-prizes-count');
const tabelPrizeSelectBody = document.getElementById('table_prize_select_body');
const prizesSelectCount = document.getElementById('prizes-select-count');

// BUTTONS
const settingsButton = document.getElementById('settings-button');
const settingsCloseButton = document.getElementById('settings-close');
const settingsSaveButton = document.getElementById('settings-save');
const prizesSelectButton = document.getElementById('prizes-select-button');
const prizesSelectWrapper = document.getElementById('prizes-select');
const prizesSelectCloseButton = document.getElementById('prizes-select-close');
const settingsSavePrizeSelectButton = document.getElementById(
	'settings-save-prize-select',
);
const userPrizesButton = document.getElementById('user-prizes-button');
const userPrizesWrapper = document.getElementById('user-prizes');
const userSettingsCloseButton = document.getElementById('user-settings-close');
const userJoinButton = document.getElementById('user-join-button');
const userJoinWrapper = document.getElementById('user-join');
const userJoinCloseButton = document.getElementById('user-join-close');
const fullscreenButton = document.getElementById('fullscreen-button');

// AUDIO & EFFECTS SETUP
// Sử dụng object SoundEffects nếu có, hoặc tạo object giả lập
const soundEffects =
	typeof SoundEffects !== 'undefined' ? new SoundEffects() : { mute: false };

// 1. NHẠC NỀN (BACKGROUND MUSIC)
// Khởi tạo riêng biệt, chạy xuyên suốt
let bgMusic = new Audio('../assets/Ring_Spin_2024.mp3');
bgMusic.loop = true; // <--- QUAN TRỌNG: Tự động lặp lại khi hết bài
bgMusic.volume = 0.8; // Âm lượng nhỏ để làm nền

// 2. HIỆU ỨNG QUAY (SPIN SFX)
// Khởi tạo riêng biệt, chỉ chạy khi bấm nút
let sfxSpin = new Audio('../assets/Ring_Spin_2024.mp3');
sfxSpin.loop = true; // Lặp lại trong lúc chờ kết quả quay
sfxSpin.volume = 1.0; // Âm lượng lớn hơn nhạc nền

// 3. HIỆU ỨNG CHIẾN THẮNG
let sfxWin = new Audio('../assets/Win.mp3');

let confettiAnimationId;
let customConfetti = null;
if (confettiCanvas && typeof confetti !== 'undefined') {
	customConfetti = confetti.create(confettiCanvas, {
		resize: true,
		useWorker: true,
	});
}

let currentDigitInputs = [];

const start = () => {
	// Set Background
	const themeRedElement = document.getElementsByClassName('theme--red');
	if (themeRedElement.length > 0)
		themeRedElement[0].style.backgroundImage = URL_BACKGROUND;

	// ============================================================
	// LOGIC KÍCH HOẠT NHẠC NỀN (AUTO PLAY)
	// ============================================================
	const tryPlayBackgroundMusic = () => {
		// Chỉ phát nếu chưa bị mute và nhạc đang dừng (paused)
		if (!soundEffects.mute && bgMusic.paused) {
			bgMusic
				.play()
				.then(() => {
					console.log('Nhạc nền đang phát...');
				})
				.catch((error) => {
					console.log('Trình duyệt chặn Autoplay. Đợi người dùng click...');
				});
		}
	};

	tryPlayBackgroundMusic();

	// Bắt sự kiện click/touch đầu tiên để mở khóa âm thanh
	const unlockAudioContext = () => {
		tryPlayBackgroundMusic();
		// Sau khi đã kích hoạt, gỡ bỏ sự kiện để tránh gọi lại không cần thiết
		document.removeEventListener('click', unlockAudioContext);
		document.removeEventListener('keydown', unlockAudioContext);
		document.removeEventListener('touchstart', unlockAudioContext);
	};

	document.addEventListener('click', unlockAudioContext);
	document.addEventListener('keydown', unlockAudioContext);
	document.addEventListener('touchstart', unlockAudioContext);

	// --- 1. RENDER INPUTS ---
	const renderDigitInputs = () => {
		digitInputsContainer.innerHTML = '';
		currentDigitInputs = [];
		for (let i = 0; i < DIGIT_COUNT; i++) {
			const input = document.createElement('input');
			input.type = 'text';
			input.className = 'digit-input';
			input.maxLength = 1;
			input.dataset.index = i;
			input.placeholder = '0';
			input.autocomplete = 'off';
			input.inputMode = 'numeric';
			digitInputsContainer.appendChild(input);
			currentDigitInputs.push(input);
		}
		setupInputEvents();
	};

	const setupInputEvents = () => {
		currentDigitInputs.forEach((input, index) => {
			input.addEventListener('paste', (e) => {
				e.preventDefault();
				const pasteData = (e.clipboardData || window.clipboardData)
					.getData('text')
					.replace(/\D/g, '')
					.split('');
				pasteData.forEach((num, i) => {
					if (index + i < currentDigitInputs.length) {
						currentDigitInputs[index + i].value = num;
						const nextIdx =
							index + i === currentDigitInputs.length - 1
								? index + i
								: index + i + 1;
						currentDigitInputs[nextIdx].focus();
					}
				});
			});

			input.addEventListener('input', (e) => {
				if (!/^\d*$/.test(e.target.value)) {
					e.target.value = '';
					return;
				}
				if (e.target.value.length >= 1) {
					e.target.value = e.target.value.slice(-1);
					if (index < currentDigitInputs.length - 1)
						currentDigitInputs[index + 1].focus();
				}
			});

			input.addEventListener('keydown', (e) => {
				if (e.key === 'Backspace') {
					if (!input.value && index > 0) {
						e.preventDefault();
						currentDigitInputs[index - 1].focus();
						currentDigitInputs[index - 1].value = '';
					} else if (input.value) input.value = '';
				} else if (e.key === 'ArrowLeft' && index > 0) {
					currentDigitInputs[index - 1].focus();
				} else if (
					e.key === 'ArrowRight' &&
					index < currentDigitInputs.length - 1
				) {
					currentDigitInputs[index + 1].focus();
				} else if (e.key === 'Enter') handleDraw();
			});
		});
		setTimeout(() => {
			if (currentDigitInputs[0]) currentDigitInputs[0].focus();
		}, 100);
	};

	renderDigitInputs();

	// --- 2. DATA HANDLING ---
	const setSlotNames = async () => {
		if (!PROGRAM_ID) return;
		try {
			await fetch(`${ENDPOINT_BACKEND}/get-users-by-program/${PROGRAM_ID}`, {
				method: 'GET',
			})
				.then((res) => res.json())
				.then((data) => {
					if (!data.success) return;
					const all = data.payload || [];

					const noPrize = all.filter((i) => i.status !== 'PRIZED');
					if (tabelUserJoinPrizeCount)
						tabelUserJoinPrizeCount.innerHTML = `(${noPrize.length})`;
					if (tabelUserJoinPrizeBody)
						tabelUserJoinPrizeBody.innerHTML = noPrize
							.map(
								(i, x) =>
									`<tr><td>${x + 1}</td><td>${i.maNV || i.email}</td><td>${
										i.fullName
									}</td><td>${i.donVi}</td></tr>`,
							)
							.join('');

					if (userJoinCount) userJoinCount.innerHTML = `(${all.length})`;
					if (tabelUserJoinBody)
						tabelUserJoinBody.innerHTML = all
							.map(
								(i, x) =>
									`<tr><td>${x + 1}</td><td>${i.maNV || i.email}</td><td>${
										i.fullName
									}</td><td>${i.donVi}</td><td>${
										i.status === 'PRIZED'
											? '<b style="color:blue">TRÚNG THƯỞNG</b>'
											: i.status
									}</td></tr>`,
							)
							.join('');

					const prize = all.filter((u) => u.status === 'PRIZED');
					if (userPrizesCount) userPrizesCount.innerHTML = `(${prize.length})`;
					if (tabelUserPrizeBody)
						tabelUserPrizeBody.innerHTML = prize
							.map(
								(i, x) =>
									`<tr><td>${x + 1}</td><td>${i.maNV || i.email}</td><td>${
										i.fullName
									}</td><td>${i.donVi}</td><td>${i.phongBan}</td><td>${
										i.prize?.prizeName || '-'
									}</td></tr>`,
							)
							.join('');
				});
		} catch (e) {}
	};

	const getProgram = async () => {
		try {
			const res = await fetch(`${ENDPOINT_BACKEND}/create-program`).then((r) =>
				r.json(),
			);
			if (res.success && res.payload?.length > 0) {
				programSelectList.innerHTML = res.payload
					.map((p) => `<option value="${p._id}">${p.nameProgram}</option>`)
					.join('');
				programSelectList.selectedIndex = 0;
				PROGRAM_ID = res.payload[0]._id;
				setSlotNames();
			}
		} catch (e) {}
	};
	getProgram();
	if (programSelectList) {
		programSelectList.addEventListener('change', (e) => {
			PROGRAM_ID = e.target.value;
			setSlotNames();
		});
	}

	const getListPrize = async () => {
		if (PROGRAM_ID) {
			try {
				const res = await fetch(
					`${ENDPOINT_BACKEND}/get-prizes/${PROGRAM_ID}`,
				).then((r) => r.json());
				if (res.success) {
					tabelPrizeSelectBody.innerHTML = res.payload
						.map(
							(i, x) =>
								`<tr><td>${x + 1}</td><td>${
									i.prizeName
								}</td><td><input type="radio" name="pz" value="${
									i._id
								}" data-n="${i.prizeName}" data-c="${i.prizeCode}" data-i="${
									i._id
								}" class="pz-radio"></td></tr>`,
						)
						.join('');
					prizesSelectCount.innerHTML = `(${res.payload.length})`;
					document.querySelectorAll('.pz-radio').forEach((el) =>
						el.addEventListener('change', (e) => {
							PRIZE_DATA = {
								prizeId: e.target.dataset.i,
								prizeName: e.target.dataset.n,
							};
						}),
					);
				}
			} catch (e) {}
		}
	};

	// --- 3. DRAW LOGIC (LOGIC QUAY SỐ) ---
	const handleDraw = async () => {
		let code = '';
		currentDigitInputs.forEach((i) => (code += i.value));
		if (code.length < DIGIT_COUNT) {
			alert(`Vui lòng nhập đủ ${DIGIT_COUNT} chữ số!`);
			return;
		}
		if (!PROGRAM_ID) {
			alert('Chưa tải dữ liệu!');
			return;
		}

		// Ẩn UI nhập liệu
		drawButton.style.display = 'none';
		// manualInputArea.classList.add('fade-out-up');
		// setTimeout(() => (manualInputArea.style.display = 'none'), 400);

		// Hiển thị Loading
		elementLoading.classList.remove('hiddenElement');
		elementResult.classList.add('hiddenElement');
		elementResult.innerHTML = '';
		stopWinningAnimation();

		// --- XỬ LÝ ÂM THANH KHI QUAY ---
		// Chỉ thao tác với sfxSpin. Nhạc nền (bgMusic) không bị đụng vào.
		// if (!soundEffects.mute) {
		// 	sfxSpin.currentTime = 0;
		// 	sfxSpin.loop = true; // Đảm bảo tiếng quay lặp lại
		// 	sfxSpin.play().catch((err) => console.log(err));
		// }

		try {
			const res = await fetch(
				`${ENDPOINT_BACKEND}/get-info-user-by-code/{programId}/{code}?programId=${PROGRAM_ID}&code=${code}`,
			).then((r) => r.json());

			// Giả lập độ trễ hồi hộp
			setTimeout(() => {
				elementLoading.classList.add('hiddenElement');

				// Tắt tiếng quay (Nhạc nền vẫn chạy bình thường)
				// sfxSpin.pause();
				// sfxSpin.currentTime = 0;

				if (res.success && res.payload) {
					manualInputArea.style.display = 'none';
					showWinner(res.payload);
				} else {
					manualInputArea.style.display = 'none';
					showError(res.errors?.[0]?.msg || 'Không tìm thấy thông tin!');
				}
			}, 5000);
		} catch (e) {
			elementLoading.classList.add('hiddenElement');
			// sfxSpin.pause(); // Tắt tiếng quay khi lỗi
			// sfxSpin.currentTime = 0;
			showError('Lỗi kết nối server!');
		}
	};

	const showWinner = (user) => {
		// Phát tiếng chiến thắng (đè lên nhạc nền)
		if (!soundEffects.mute) {
			sfxWin.currentTime = 0;
			sfxWin.play().catch(() => {});
		}
		let code = '';
		currentDigitInputs?.forEach((i) => (code += i.value));

		elementResult.classList.remove('hiddenElement');
		sunburstSvg.style.display = 'flex';

		elementResult.innerHTML = `
            <div class="lucky-result-card">
                <div class="res-label">XIN CHÚC MỪNG${
									code ? ` ${code}` : ''
								}</div>
                <h1 class="res-name">${user.fullName || 'UNKNOWN'}</h1>
                <div class="res-info">
                    <span class="res-badge">${user.maNV || user.email}</span>
                    <div class="res-dept">${
											user.bienChe.toUpperCase() || ''
										}</div>
                    <div class="res-sub">${
											user.phongBan.toUpperCase() || ''
										}</div>
                </div>
            </div>
        `;

		confettiAnimation();
		resetButton.style.display = 'inline-block';
		resetButton.innerText = 'TIẾP TỤC';
		resetButton.style.backgroundColor = '#f59e0b';
		resetButton.className = 'solid-button animate__animated animate__fadeInUp';
	};

	const showError = (msg) => {
		elementResult.classList.remove('hiddenElement');
		elementResult.innerHTML = `
            <div class="lucky-result-card error-card">
                <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
                <div class="error-msg">RẤT TIẾC! ${msg}</div>
                <div class="error-hint">Vui lòng kiểm tra lại mã số dự thưởng.</div>
            </div>
        `;
		resetButton.style.display = 'inline-block';
		resetButton.innerText = 'THỬ LẠI';
		resetButton.style.backgroundColor = '#64748b';
	};

	const handleReset = () => {
		stopWinningAnimation();
		sfxWin.pause(); // Tắt nhạc chiến thắng
		sfxWin.currentTime = 0;

		elementResult.classList.add('hiddenElement');
		resetButton.style.display = 'none';

		drawButton.style.display = 'inline-block';
		manualInputArea.style.display = 'flex';
		manualInputArea.classList.remove('fade-out-up');
		manualInputArea.classList.add('fade-in-down');

		currentDigitInputs.forEach((i) => (i.value = ''));
		if (currentDigitInputs[0]) currentDigitInputs[0].focus();
	};

	// --- 4. EVENTS ---
	settingsSaveButton.addEventListener('click', () => {
		if (userNameElement) USER_NAME = userNameElement.value;
		if (passwordElement) PASSWORD = realPasswordElement.value;

		// Xử lý MUTE / UNMUTE toàn bộ
		if (enableSoundCheckbox) {
			soundEffects.mute = !enableSoundCheckbox.checked;

			if (soundEffects.mute) {
				// Nếu chọn tắt tiếng -> Dừng mọi âm thanh
				bgMusic.pause();
				// sfxSpin.pause();
				sfxWin.pause();
			} else {
				// Nếu chọn bật tiếng -> Phát lại nhạc nền (nếu nó đang dừng)
				if (bgMusic.paused) {
					bgMusic.play().catch(() => {});
				}
			}
		}

		if (digitCountSelect) {
			const newCount = parseInt(digitCountSelect.value);
			if (newCount !== DIGIT_COUNT) {
				DIGIT_COUNT = newCount;
				renderDigitInputs();
			}
		}
		settingsWrapper.style.display = 'none';
	});

	settingsButton.addEventListener('click', () => {
		if (userNameElement) userNameElement.value = USER_NAME;
		if (digitCountSelect) digitCountSelect.value = DIGIT_COUNT;
		setSlotNames();
		settingsWrapper.style.display = 'block';
	});
	settingsCloseButton.addEventListener('click', (e) => {
		e.stopPropagation();
		settingsWrapper.style.display = 'none';
	});

	prizesSelectButton.addEventListener('click', () => {
		getListPrize();
		prizesSelectWrapper.style.display = 'block';
	});
	prizesSelectCloseButton.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesSelectWrapper.style.display = 'none';
	});
	settingsSavePrizeSelectButton.addEventListener('click', () => {
		if (PRIZE_DATA) prizesSelectWrapper.style.display = 'none';
		else alert('Chọn giải!');
	});

	userPrizesButton.addEventListener('click', () => {
		setSlotNames();
		userPrizesWrapper.style.display = 'block';
	});
	userSettingsCloseButton.addEventListener('click', (e) => {
		e.stopPropagation();
		userPrizesWrapper.style.display = 'none';
	});

	userJoinButton.addEventListener('click', () => {
		setSlotNames();
		userJoinWrapper.style.display = 'block';
	});
	userJoinCloseButton.addEventListener('click', (e) => {
		e.stopPropagation();
		userJoinWrapper.style.display = 'none';
	});

	if (userNameElement)
		userNameElement.addEventListener(
			'input',
			(e) => (USER_NAME = e.target.value),
		);
	if (passwordElement)
		passwordElement.addEventListener('input', (e) => {
			const v = e.target.value;
			if (v.length > PASSWORD.length) PASSWORD += v.slice(PASSWORD.length);
			else if (v.length < PASSWORD.length)
				PASSWORD = PASSWORD.slice(0, v.length);
			passwordElement.value = '*'.repeat(v.length);
			realPasswordElement.value = PASSWORD;
		});

	if (fullscreenButton)
		fullscreenButton.addEventListener('click', () => {
			if (!document.fullscreenElement)
				document.documentElement.requestFullscreen();
			else if (document.exitFullscreen) document.exitFullscreen();
		});

	drawButton.addEventListener('click', handleDraw);
	resetButton.addEventListener('click', handleReset);
	[
		settingsWrapper,
		prizesSelectWrapper,
		userPrizesWrapper,
		userJoinWrapper,
	].forEach((m) =>
		m.addEventListener('click', (e) => {
			if (e.target === m) m.style.display = 'none';
		}),
	);

	const confettiAnimation = () => {
		if (!customConfetti) return;
		const s = Math.max(
			0.5,
			Math.min(
				1,
				(window.innerWidth || document.documentElement.clientWidth) / 1100,
			),
		);
		customConfetti({
			particleCount: 2,
			gravity: 0.8,
			spread: 90,
			origin: { y: 0.6 },
			colors: CONFETTI_COLORS,
			scalar: s,
		});
		confettiAnimationId = window.requestAnimationFrame(confettiAnimation);
	};
	const stopWinningAnimation = () => {
		if (confettiAnimationId) window.cancelAnimationFrame(confettiAnimationId);
		sunburstSvg.style.display = 'none';
	};
};

document.addEventListener('DOMContentLoaded', start);
