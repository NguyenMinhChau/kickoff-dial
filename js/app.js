//? DATA LIST: ../js/constants/dataSG1Kickoff.json
// {
// 	"HCM.Hoanglm18": "SG01B1",
// 	"HCM.Hoanglm18": "SG01B1",
// 	...
// }
// ?
// https://icdpmobile.fpt.net/icdp-mobile-staging/v1/icdp-backend-mobile/ct-tat-nien
Chart.register(ChartDataLabels);
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
const URL_BACKGROUND = 'url(../../../assets/og/YEP_2026.png)';

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
	const backgroundHeaderFormIndex = document.getElementById(
		'background-header-form-index',
	);
	const formIndexMainWrapper = document.querySelector(
		'.formbold-main-wrapper-index',
	);
	const drawButton = document.getElementById('draw-button');
	const prizeDataElement = document.getElementById('prize-data');
	const fullscreenButton = document.getElementById('fullscreen-button');
	const settingsButton = document.getElementById('settings-button');
	const prizesButton = document.getElementById('prizes-button');
	const prizesSelectButton = document.getElementById('prizes-select-button');
	const chartStatisticalButton = document.getElementById(
		'chart-statistical-button',
	);
	const checkinChartStatisticalButton = document.getElementById(
		'checkin-chart-statistical-button',
	);
	const userPrizesButton = document.getElementById('user-prizes-button');
	const imageQrCodeElement = document.getElementById('prizes-qrcode');
	const imageQrCodeCheckinStatisticalElement = document.getElementById(
		'checkin-chart-statistical-qrcode',
	);
	const userJoinButton = document.getElementById('user-join-button');
	const settingsWrapper = document.getElementById('settings');
	const prizesWrapper = document.getElementById('prizes');
	const prizesSelectWrapper = document.getElementById('prizes-select');
	const chartStatisticalWrapper = document.getElementById('chart-statistical');
	const checkinChartStatisticalWrapper = document.getElementById(
		'checkin-chart-statistical',
	);
	const userPrizesWrapper = document.getElementById('user-prizes');
	const userPrizesCount = document.getElementById('user-prizes-count');
	const prizesSelectCount = document.getElementById('prizes-select-count');
	const userJoinWrapper = document.getElementById('user-join');
	const userJoinCount = document.getElementById('user-join-count');
	const settingsContent = document.getElementById('settings-panel');
	const prizesContent = document.getElementById('prizes-panel');
	const prizesSelectContent = document.getElementById('prizes-select-panel');
	const chartStatisticalContent = document.getElementById(
		'chart-statistical-panel',
	);
	const checkinChartStatisticalContent = document.getElementById(
		'checkin-chart-statistical-panel',
	);
	const userPrizesContent = document.getElementById('user-prizes-panel');
	const userJoinContent = document.getElementById('user-join-panel');
	const settingsSaveButton = document.getElementById('settings-save');
	const settingsSavePrizeSelectButton = document.getElementById(
		'settings-save-prize-select',
	);
	const settingsCloseButton = document.getElementById('settings-close');
	const userSettingsCloseButton = document.getElementById(
		'user-settings-close',
	);
	const userJoinCloseButton = document.getElementById('user-join-close');
	const prizesCloseButton = document.getElementById('prizes-close');
	const prizesSelectCloseButton = document.getElementById(
		'prizes-select-close',
	);
	const chartStatisticalCloseButton = document.getElementById(
		'chart-statistical-close',
	);
	const checkinChartStatisticalCloseButton = document.getElementById(
		'checkin-chart-statistical-close',
	);
	const sunburstSvg = document.getElementById('sunburst');
	const confettiCanvas = document.getElementById('confetti-canvas');
	const nameListTextArea = document.getElementById('name-list');
	const removeNameFromListCheckbox =
		document.getElementById('remove-from-list');
	const enableSoundCheckbox = document.getElementById('enable-sound');
	const selectPrizeCheckbox = document.getElementById('select-prize');

	const elementLoading = document.getElementById('middle');
	const elementResult = document.getElementById('name-persion-lucky');
	const tabelUserPrizeBody = document.getElementById('table_user_prize_body');
	const sunmaryChart = document.getElementById('summary_chart');
	const tabelUserJoinPrizeCount = document.getElementById(
		'table_user_join_prize_count',
	);
	const tabelUserJoinBody = document.getElementById('table_user_join_body');
	const tabelUserJoinPrizeJoinBody = document.getElementById(
		'table_user_join_prize_body',
	);
	const tabelPrizeSelectBody = document.getElementById(
		'table_prize_select_body',
	);
	const ctxChartDeparment = document
		.getElementById('departmentChart')
		.getContext('2d');
	const ctxCheckinChartDeparment = document
		.getElementById('departmentChartAndCheckin')
		.getContext('2d');

	// !SET BACKGROUND IMAGE
	themeRedElement[0].style.backgroundImage = URL_BACKGROUND;
	formIndexMainWrapper.style.backgroundImage = URL_BACKGROUND;
	backgroundHeaderFormIndex.src = URL_BACKGROUND_HEADER_FORM;

	if (imageQrCodeElement || imageQrCodeCheckinStatisticalElement) {
		const getDataQrCode = async () => {
			return await fetch(`${ENDPOINT_BACKEND}/qr-code-check-in`, {
				method: 'GET',
			})
				.then((response) => {
					return response.json();
				})
				.then(async (data) => {
					const { success, errors, payload } = { ...data };
					if (!success) {
						console.error(errors);
						return;
					}
					// if (payload) {
					// 	return payload;
					// } else {
					// 	return '../assets/og/QR_CODE_PLACEHOLDER.png';
					// }
					return '../assets/og/QR_CODE_PLACEHOLDER.png';
				});
		};
		getDataQrCode().then(async (res) => {
			if (res && imageQrCodeElement) imageQrCodeElement.src = res;
			if (res && imageQrCodeCheckinStatisticalElement)
				imageQrCodeCheckinStatisticalElement.src = res;
		});
	}

	// !

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
			selectPrizeCheckbox &&
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
				acc[item?.maNV || item?.email] = item.phongBan;
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
					alert(
						errors?.[0]?.message ||
							errors?.[0]?.msg ||
							'Lấy danh sách chương trình không thành công',
					);
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

	function clearChart() {
		if (MY_CHART) {
			MY_CHART.destroy();
			MY_CHART = null; // Important reset
		}
		// Clear both canvases to be safe
		[ctxChartDeparment, ctxCheckinChartDeparment].forEach((ctx) => {
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			ctx.beginPath();
		});
	}

	// ! SET SLOTS NAME
	const setSlotNames = async (noSetSlotName = false) => {
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
						alert(
							errors?.[0]?.message ||
								errors?.[0]?.msg ||
								'Thao tác không thành công',
						);
						return;
					}
					const DATA_NO_PRIZE = data?.payload
						?.map((item) => {
							if (item?.status !== 'PRIZED') {
								//  && item.status === 'CHECKED_IN'
								return item;
							}
						})
						?.filter((x) => x);

					// !TABLE USER PRIZE BODY
					const htmlTableBody = data.payload
						.map((item, _idx) => {
							const { email, fullName, phongBan, status, group, prize, donVi } =
								{ ...item };
							const isPrized = status === 'PRIZED';
							return `
								<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${email || '-'}</td>
										<td>${fullName || '-'}</td>
										<td>${donVi || '-'}</td>
										<td>${phongBan || '-'}</td>
										<td>${group || '-'}</td>
										<td>${
											isPrized
												? `<div>
											<p style="color: #1d4ed8; margin: 0; padding: 0">TRÚNG THƯỞNG</p>
											<p style="color: #1d4ed8; margin: 0; padding: 0; font-size: 10px">${
												prize?.prizeName || '-'
											}</p>
										</div>`
												: '-'
										}</td>
									</tr>
							`;
						})
						.join('');
					// !TABLE USER JOIN PRIZE BODY
					const htmlTableBodyJoinPrize = DATA_NO_PRIZE.map((item, _idx) => {
						const { email, fullName, phongBan, group, donVi } = { ...item };
						return `
								<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${email || '-'}</td>
										<td>${fullName || '-'}</td>
										<td>${donVi || '-'}</td>
										<td>${phongBan || '-'}</td>
										<td>${group || '-'}</td>
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
									<td style="padding: 12px" colspan="7">Không có dữ liệu</td>
							</tr>`;

					tabelUserJoinPrizeCount.innerHTML =
						DATA_NO_PRIZE.length > 0
							? `(${DATA_NO_PRIZE.length.toLocaleString()})`
							: '';
					tabelUserJoinPrizeJoinBody.innerHTML =
						DATA_NO_PRIZE.length > 0
							? htmlTableBodyJoinPrize
							: `<tr style="text-align: center">
									<td style="padding: 12px" colspan="6">Không có dữ liệu</td>
							</tr>`;
					// !
					if (!noSetSlotName) {
						slot.names = nameListTextArea.value
							? nameListTextArea.value
									.split(/\n/)
									.filter((name) => Boolean(name.trim()))
							: [];
						slot.names = Object.keys(formatSlotJSON(DATA_NO_PRIZE));
					}
				});
		}
	};
	setSlotNames();
	// !!!

	// !! GET PRIZE
	const getListPrize = async () => {
		if (PROGRAM_ID) {
			await fetch(`${ENDPOINT_BACKEND}/get-prizes/${PROGRAM_ID}`, {
				method: 'GET',
			})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					const { success, errors } = { ...data };
					if (!success) {
						alert(
							errors?.[0]?.message ||
								errors?.[0]?.msg ||
								'Lấy danh sách giải thưởng không thành công',
						);
						return;
					}
					// !! TABLE PRIZES SELECT
					const htmlTableBodyPrizeSelect = data?.payload
						.map((item, _idx) => {
							const { prizeName, prizeCode, _id } = { ...item };
							return `
								<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${prizeName || '-'}</td>
										<td>
											<input
														type="radio"
                            class="prize_select"
														name="prize_select"
														value=${_id}
														data-prize-name="${prizeName}"
														data-prize-code="${prizeCode}"
														data-prize-id="${_id}"
													/>
										</td>
									</tr>
							`;
						})
						.join('');
					// !!

					prizesSelectCount.innerHTML =
						data?.payload.length > 0
							? `(${data?.payload.length.toLocaleString()})`
							: '';
					tabelPrizeSelectBody.innerHTML =
						data?.payload.length > 0
							? htmlTableBodyPrizeSelect
							: `<tr style="text-align: center">
									<td style="padding: 12px" colspan="3">Không có dữ liệu</td>
							</tr>`;
					const inputRadioElements = document.querySelectorAll(
						'input[type="radio"].prize_select',
					);
					inputRadioElements.forEach((inputRadioElement) => {
						inputRadioElement.addEventListener('change', function (e) {
							PRIZE = e.target.value;
							PRIZE_DATA = {
								prizeName: e.target.dataset.prizeName,
								prizeCode: e.target.dataset.prizeCode,
								prizeId: e.target.dataset.prizeId,
							};
						});
					});
				});
		}
	};
	getListPrize();

	const titleColors = {
		'CHIẾN BINH SỨC MẠNH': '#6d94b8',
		'CHIẾN BINH KẾT NỐI': '#0563cf',
		'CHIẾN BINH NHIỆT HUYẾT': '#b44015',
		'CHIẾN BINH TỐC ĐỘ': '#cf9a2a',
		'CHIẾN BINH TRÍ TUỆ': '#d5a5e7',
		'CHIẾN BINH SÁNG TẠO': '#ee2334',
	};

	// Function helpers for Chart styling
	function getGradientColor(ctx, color) {
		const gradient = ctx.createLinearGradient(0, 0, 0, 400);
		gradient.addColorStop(0, color); // Solid color at top
		gradient.addColorStop(0.8, color + '80'); // Semitransparent
		gradient.addColorStop(1, color + '10'); // Very transparent at bottom
		return gradient;
	}

	// !! STATISTICAL
	const getStatisticalChart = async (isUpdate = false) => {
		if (PROGRAM_ID) {
			await fetch(
				`${ENDPOINT_BACKEND}/thong-ke-so-luong-quay-so/${PROGRAM_ID}`,
				{
					method: 'GET',
				},
			)
				.then((response) => response.json())
				.then((data) => {
					const { success, errors, payload } = { ...data };
					if (!success) {
						console.error(
							errors?.[0]?.message ||
								errors?.[0]?.msg ||
								'Lấy danh sách giải thưởng không thành công',
						);
						return;
					}

					// Process Data
					const sortedData = Object.entries(payload)
						.map(([label, values]) => ({ label, ...values }))
						.sort((a, b) => b.total - a.total);

					const sortedLabels = sortedData.map((item) =>
						item.label.toUpperCase(),
					);
					const sortedTotalValues = sortedData.map((item) => item.total);
					const sortedCheckedInValues = sortedData.map(
						(item) => item.checkedIn,
					);

					const totalAllTeams = sortedTotalValues.reduce(
						(sum, val) => sum + val,
						0,
					);
					const totalCheckedInAllTeams = sortedCheckedInValues.reduce(
						(sum, val) => sum + val,
						0,
					);
					const percentageCheckedInAllTeams = totalAllTeams
						? ((totalCheckedInAllTeams / totalAllTeams) * 100).toFixed(2)
						: 0;

					sunmaryChart.innerHTML = `
						<div style="font-size: 1.2rem; margin-bottom: 5px;">Tổng số: <b style="color: #fbbf24; font-size: 1.5rem;">${totalAllTeams?.toLocaleString()}</b> chiến binh</div>
						<div style="font-size: 1.2rem;">Phần trăm đã checkin: <b style="color: #34d399; font-size: 1.5rem;">${percentageCheckedInAllTeams}</b>%</div>
					`;

					const targetCtx =
						chartStatisticalWrapper.style.display === 'block'
							? ctxChartDeparment
							: ctxCheckinChartDeparment;

					// --- CHART COLOR LOGIC ---
					// 1. Color for Total: Dynamic per team
					const totalColors = sortedLabels.map(
						(label) => titleColors[label.toUpperCase()] || '#FFFFFF',
					);
					const totalGradients = totalColors.map((c) =>
						getGradientColor(targetCtx, c),
					);

					// 2. Color for Check-in: UNIFORM NEON YELLOW (High Contrast)
					const checkInColor = '#FACC15'; // Neon Gold/Yellow
					const checkInBorder = '#FEF08A'; // Lighter border

					// --- CHART LOGIC START ---
					if (MY_CHART && MY_CHART.ctx.canvas === targetCtx.canvas) {
						// UPDATE EXISTING CHART
						MY_CHART.data.labels = sortedLabels.map((item) =>
							item.toUpperCase(),
						);
						MY_CHART.data.datasets[0].data = sortedTotalValues;
						MY_CHART.data.datasets[1].data = sortedCheckedInValues;

						MY_CHART.data.datasets[0].backgroundColor = totalGradients;
						MY_CHART.data.datasets[0].borderColor = totalColors;
						// Dataset 1 (Check-in) uses fixed colors, no need to update color array dynamically
						MY_CHART.update();
					} else {
						// DESTROY AND CREATE NEW CHART
						if (MY_CHART) {
							MY_CHART.destroy();
						}

						MY_CHART = new Chart(targetCtx, {
							type: 'bar',
							data: {
								labels: sortedLabels.map((item) => item.toUpperCase()),
								datasets: [
									{
										label: 'TỔNG SỐ CHIẾN BINH',
										data: sortedTotalValues,
										backgroundColor: totalGradients,
										borderColor: totalColors,
										borderWidth: 2,
										borderRadius: 8,
										barPercentage: 0.6,
										categoryPercentage: 0.8,
										// Data Labels Configuration
										datalabels: {
											anchor: 'end', // Anchor to top of bar
											align: 'end', // Push text upwards
											offset: -5, // Slight adjustment
											color: '#FFFFFF',
											font: {
												size: 14,
												weight: 'bold',
											},
											formatter: (value) => value.toLocaleString(),
										},
									},
									{
										label: 'TỶ LỆ CHECK-IN (%)',
										data: sortedCheckedInValues,
										// FIX: Use uniform high-contrast color
										backgroundColor: checkInColor,
										borderColor: checkInBorder,
										borderWidth: 2,
										borderRadius: 8,
										barPercentage: 0.6,
										categoryPercentage: 0.8,
										// Data Labels Configuration
										datalabels: {
											anchor: 'end', // Anchor to top of bar
											align: 'end', // Push text upwards
											offset: -5,
											color: checkInColor, // Match the bar color for text
											font: {
												size: 14,
												weight: 'bold',
											},
											formatter: (value, context) => {
												const total = sortedTotalValues[context.dataIndex];
												if (!total) return '0%';
												const percentage = (value / total) * 100;
												return percentage.toFixed(1) + '%';
											},
										},
									},
								],
							},
							options: {
								responsive: true,
								maintainAspectRatio: false,
								animation: {
									duration: 1000,
									easing: 'easeOutQuart',
								},
								layout: {
									// Add padding top so labels don't get cut off
									padding: { top: 50, bottom: 20, left: 10, right: 10 },
								},
								plugins: {
									legend: {
										display: true,
										position: 'bottom',
										labels: {
											font: {
												size: 14,
												weight: 'bold',
												family:
													"'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
											},
											color: '#e2e8f0',
											padding: 20,
											usePointStyle: true,
											pointStyle: 'circle',
										},
									},
									tooltip: {
										enabled: true,
										backgroundColor: 'rgba(15, 23, 42, 0.95)',
										titleColor: '#fbbf24',
										bodyColor: '#fff',
										titleFont: { size: 14, weight: 'bold' },
										bodyFont: { size: 13 },
										padding: 12,
										cornerRadius: 8,
										borderColor: 'rgba(255,255,255,0.1)',
										borderWidth: 1,
										displayColors: true,
									},
									datalabels: {
										// Global settings if not overridden
										display: true,
									},
								},
								scales: {
									x: {
										ticks: {
											font: {
												size: (context) => {
													const width = context.chart.width;
													return width < 768 ? 9 : 12;
												},
												weight: 'bold',
											},
											color: (context) => {
												const label = context.tick.label.toUpperCase();
												return titleColors[label] || '#e2e8f0';
											},
											autoSkip: false,
											maxRotation: 45,
											minRotation: 0,
										},
										grid: { display: false },
										border: {
											display: true,
											color: 'rgba(255,255,255,0.2)',
										},
									},
									y: {
										ticks: {
											font: { size: 12, weight: 'bold' },
											color: '#94a3b8',
											callback: (value) => Math.round(value),
										},
										grid: {
											color: 'rgba(255, 255, 255, 0.05)',
											drawBorder: false,
										},
										beginAtZero: true,
									},
								},
							},
						});
					}
					// --- CHART LOGIC END ---
				});
		}
	};
	getStatisticalChart();

	let intervalId = null;

	function startUpdatingChart(noClearChart = false) {
		if (intervalId) return; // Tránh tạo nhiều interval

		intervalId = setInterval(() => {
			if (
				chartStatisticalWrapper.style.display === 'block' ||
				checkinChartStatisticalWrapper.style.display === 'block'
			) {
				// Pass true to indicate an update, preventing full redraw flicker
				getStatisticalChart(true);
			} else {
				clearInterval(intervalId);
				intervalId = null;
			}
		}, 5000);
	}

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
					alert(
						errors?.[0]?.message ||
							errors?.[0]?.msg ||
							'Thao tác không thành công',
					);
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
		prizesSelectButton.disabled = true;
		chartStatisticalButton.disabled = true;
		checkinChartStatisticalButton.disabled = true;
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
		prizesSelectButton.disabled = false;
		chartStatisticalButton.disabled = false;
		checkinChartStatisticalButton.disabled = false;
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
		elementResult.innerHTML = '';

		await fetch(`${ENDPOINT_BACKEND}/get-users-by-program/${PROGRAM_ID}`, {
			method: 'GET',
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				const { success, errors } = { ...data };
				if (!success) {
					elementResult.innerHTML = '';
					alert(
						errors?.[0]?.message ||
							errors?.[0]?.msg ||
							'Thao tác không thành công',
					);
					return;
				}
				const dataJSON = formatSlotJSON(data?.payload);
				const _userPrize = data?.payload?.filter(
					(x) => (x?.maNV || x?.email) === luckyNumber,
				)?.[0];
				elementResult.innerHTML = `${
					_userPrize?.fullName ? _userPrize?.fullName : ''
				}${
					_userPrize?.fullName && dataJSON[luckyNumber.toString()] ? ' - ' : ''
				}${
					dataJSON[luckyNumber.toString()]
						? dataJSON[luckyNumber.toString()]
						: ''
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
		prizeElementContainer: '#prize-data',
		maxReelItems: MAX_REEL_ITEMS,
		onSpinStart,
		onSpinEnd,
		onNameListChanged: stopWinningAnimation,
		ENDPOINT_BACKEND: ENDPOINT_BACKEND,
	});

	/** To open the setting page */
	const onSettingsOpen = () => {
		// nameListTextArea.value = slot.names.length
		// 	? slot.names
		// 			.map((item, index) => {
		// 				return `${index + 1}. ${item}`;
		// 			})
		// 			.join('\n')
		// 	: '';
		setSlotNames(true);
		removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
		enableSoundCheckbox.checked = !soundEffects.mute;
		settingsWrapper.style.display = 'block';
	};

	const onPrizesOpen = () => {
		prizesWrapper.style.display = 'block';
	};

	const onPrizesSelectOpen = () => {
		getListPrize();
		prizesSelectWrapper.style.display = 'block';
	};

	const onChartStatisticalOpen = () => {
		// Clear old chart if switching contexts to ensure clean render
		clearChart();
		getStatisticalChart();
		startUpdatingChart(true);
		chartStatisticalWrapper.style.display = 'block';
	};

	const onCheckinChartStatisticalOpen = () => {
		clearChart();
		getStatisticalChart();
		startUpdatingChart(true);
		checkinChartStatisticalWrapper.style.display = 'block';
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
						alert(
							errors?.[0]?.message ||
								errors?.[0]?.msg ||
								'Thao tác không thành công',
						);
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
						const { email, fullName, phongBan, prize, group, donVi } = {
							...item,
						};
						return `<tr>
										<th scope="row">${_idx + 1}</th>
										<td>${email || '-'}</td>
										<td>${fullName || '-'}</td>
										<td>${donVi || '-'}</td>
										<td>${phongBan || '-'}</td>
										<td>${group || '-'}</td>
										<td>${prize?.prizeName || '-'}</td>
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
									<td style="padding: 12px" colspan="7">Không có dữ liệu</td>
							</tr>`;
					// !
				});
		}
		userPrizesWrapper.style.display = 'block';
	};

	const onUserJoinOpen = () => {
		setSlotNames(true);
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

	const onPrizesSelectClose = (e) => {
		e.stopPropagation();
		prizesSelectContent.scrollTop = 0;
		prizesSelectWrapper.style.display = 'none';
	};

	const onChartStatisticalClose = (e) => {
		e.stopPropagation();
		clearChart();
		chartStatisticalContent.scrollTop = 0;
		chartStatisticalWrapper.style.display = 'none';
		clearInterval(intervalId);
		intervalId = null;
	};

	const onCheckinChartStatisticalClose = (e) => {
		e.stopPropagation();
		clearChart();
		checkinChartStatisticalContent.scrollTop = 0;
		checkinChartStatisticalWrapper.style.display = 'none';
		clearInterval(intervalId);
		intervalId = null;
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
	drawButton.addEventListener('click', async (e) => {
		if (!slot.names.length) {
			onSettingsOpen();
			return;
		}

		if (!USER_NAME || !PASSWORD) {
			onSettingsOpen();
			if (!userNameElement.value) return userNameElement.focus();
			passwordElement.focus();
			return;
		} else if (!PRIZE_DATA && selectPrizeCheckbox.checked) {
			onPrizesSelectOpen(e);
			return;
		}

		await slot.spin();

		// PRIZE_DATA = null;
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
	prizesSelectButton.addEventListener('click', onPrizesSelectOpen);
	chartStatisticalButton.addEventListener('click', onChartStatisticalOpen);
	checkinChartStatisticalButton.addEventListener(
		'click',
		onCheckinChartStatisticalOpen,
	);
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
	prizesSelectCloseButton.addEventListener('click', onPrizesSelectClose);
	chartStatisticalCloseButton.addEventListener(
		'click',
		onChartStatisticalClose,
	);
	checkinChartStatisticalCloseButton.addEventListener(
		'click',
		onCheckinChartStatisticalClose,
	);
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

	prizesSelectWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesSelectWrapper.style.display = 'none';
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

	prizesSelectContent.addEventListener('click', (e) => {
		e.stopPropagation();
		prizesSelectWrapper.style.display = 'block';
	});

	userJoinContent.addEventListener('click', (e) => {
		e.stopPropagation();
		userJoinWrapper.style.display = 'block';
	});

	// ! HANDLE PRIZE SELECT
	function submitPrize(e) {
		if (PRIZE_DATA) {
			onPrizesSelectClose(e);
			// console.log({ PRIZE, PRIZE_DATA });
			prizeDataElement.innerHTML = `${PRIZE_DATA.prizeId}`;
		} else {
			alert('Vui lòng chọn phần thưởng trước khi xác nhận. Xin cảm ơn!');
		}
	}
	// CLICK PRIZE SELECT
	settingsSavePrizeSelectButton.addEventListener('click', submitPrize);
};

document.addEventListener('DOMContentLoaded', () => {
	start();
});
