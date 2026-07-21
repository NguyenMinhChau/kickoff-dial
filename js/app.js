import {
	ENDPOINT_BACKEND,
	URL_BACKGROUND_HEADER_FORM,
} from './constants/endpoints.js';
import { Dialog } from './utils/dialog.js';

//? DATA LIST: ../js/constants/dataSG1Kickoff.json
// {
// 	"HCM.Hoanglm18": "SG01B1",
// 	"HCM.Hoanglm18": "SG01B1",
// 	...
// }
// ?
// https://icdpmobile.fpt.net/icdp-mobile-staging/v1/icdp-backend-mobile/ct-tat-nien
Chart.register(ChartDataLabels);
// ! VARIABLE
var PROGRAM_ID = '';
var USER_NAME = '';
var PASSWORD = '';
var PRIZE = null;
var PRIZE_DATA = null;
var MY_CHART = null;

const URL_BACKGROUND = 'url(../assets/og/HOLIDAY_INF_2026.webp)';

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
	const userPrizesWrapper = document.getElementById('user-prizes');
	const userPrizesCount = document.getElementById('user-prizes-count');
	const prizesSelectCount = document.getElementById('prizes-select-count');
	const userJoinWrapper = document.getElementById('user-join');
	const userJoinCount = document.getElementById('user-join-count');
	const settingsContent = document.getElementById('settings-panel');
	const prizesContent = document.getElementById('prizes-panel');
	const prizesSelectContent = document.getElementById('prizes-select-panel');
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
	// !! STATISTICAL
	const chartStatisticalWrapper = document.getElementById('chart-statistical');
	const checkinChartStatisticalWrapper = document.getElementById(
		'checkin-chart-statistical',
	);
	const chartStatisticalContent = document.getElementById(
		'chart-statistical-panel',
	);
	const checkinChartStatisticalContent = document.getElementById(
		'checkin-chart-statistical-panel',
	);
	const chartStatisticalCloseButton = document.getElementById(
		'chart-statistical-close',
	);
	const checkinChartStatisticalCloseButton = document.getElementById(
		'checkin-chart-statistical-close',
	);
	const sunmaryChart = document.getElementById('summary_chart');
	const ctxChartDeparment = document
		.getElementById('departmentChart')
		.getContext('2d');
	const ctxCheckinChartDeparment = document
		.getElementById('departmentChartAndCheckin')
		.getContext('2d');
	//! ============================

	// !SET BACKGROUND IMAGE
	themeRedElement[0].style.backgroundImage = URL_BACKGROUND;
	formIndexMainWrapper.style.setProperty('--bg-image', URL_BACKGROUND);
	backgroundHeaderFormIndex.src = URL_BACKGROUND_HEADER_FORM;

	if (imageQrCodeElement || imageQrCodeCheckinStatisticalElement) {
		// const getDataQrCode = async () => {
		// 	return await fetch(`${ENDPOINT_BACKEND}/qr-code-check-in`, {
		// 		method: 'GET',
		// 	})
		// 		.then((response) => {
		// 			return response.json();
		// 		})
		// 		.then(async (data) => {
		// 			const { success, errors, payload } = { ...data };
		// 			if (!success) {
		// 				console.error(errors);
		// 				return;
		// 			}
		// 			// if (payload) {
		// 			// 	return payload;
		// 			// } else {
		// 			// 	return '../assets/og/QR_CODE_PLACEHOLDER.png';
		// 			// }
		// 			return '../assets/og/QR_CODE_PLACEHOLDER.png';
		// 		});
		// };
		// getDataQrCode().then(async (res) => {
		// 	if (res && imageQrCodeElement) imageQrCodeElement.src = res;
		// 	if (res && imageQrCodeCheckinStatisticalElement)
		// 		imageQrCodeCheckinStatisticalElement.src = res;
		// });

		imageQrCodeElement.src = '../assets/og/QR_CODE_PLACEHOLDER.png';
		imageQrCodeCheckinStatisticalElement.src =
			'../assets/og/QR_CODE_PLACEHOLDER.png';
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
										<td class="col-email">${(email || '-').toUpperCase()}</td>
										<td>${fullName || '-'}</td>
										<td class="col-chinhanh">${donVi || '-'}</td>
										<td>${phongBan || '-'}</td>
										<td class="col-nhom">${group || '-'}</td>
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
										<td class="col-email">${(email || '-').toUpperCase()}</td>
										<td>${fullName || '-'}</td>
										<td class="col-chinhanh">${donVi || '-'}</td>
										<td>${phongBan || '-'}</td>
										<td class="col-nhom">${group || '-'}</td>
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

	// !! LIGHTBOX FUNCTIONS
	const showLightbox = (src, captionText) => {
		const lightbox = document.getElementById('image-lightbox');
		const lightboxImg = document.getElementById('lightbox-img');
		const lightboxCaption = document.getElementById('lightbox-caption');
		if (!lightbox || !lightboxImg || !lightboxCaption) return;

		lightboxImg.src = src;
		lightboxCaption.textContent = captionText || '';
		lightbox.style.display = 'flex';
		lightbox.offsetHeight;
		lightbox.classList.add('show');
	};

	const hideLightbox = () => {
		const lightbox = document.getElementById('image-lightbox');
		const lightboxImg = document.getElementById('lightbox-img');
		if (!lightbox || !lightboxImg) return;

		lightbox.classList.remove('show');
		setTimeout(() => {
			if (!lightbox.classList.contains('show')) {
				lightbox.style.display = 'none';
				lightboxImg.src = '';
			}
		}, 300);
	};

	// !! GET PRIZE
	const updatePrizePreview = (name, code, image) => {
		const previewContainer = document.getElementById('prize-preview-container');
		if (!previewContainer) return;
		if (!name) {
			previewContainer.innerHTML = `
				<div class="prize-preview-placeholder">
					<i class="fas fa-image"></i>
					<p>Chọn giải thưởng để xem chi tiết</p>
				</div>
			`;
			return;
		}

		previewContainer.innerHTML = `
			<div class="prize-preview-card">
				<div class="prize-preview-img-wrapper">
					${
						image
							? `<img class="prize-preview-img" src="${image}" alt="${name}" />
						   <button class="img-zoom-btn" data-src="${image}" data-caption="${name}" title="Phóng to ảnh">
						       <i class="fas fa-search-plus"></i>
						   </button>`
							: `<div class="prize-preview-fallback"><i class="fas fa-gift"></i></div>`
					}
				</div>
				<div class="prize-preview-info">
					<h4 class="prize-preview-name">${name}</h4>
					<span class="prize-preview-code">Mã giải: ${code || '-'}</span>
				</div>
			</div>
		`;

		// Attach zoom click listener directly to the button inside preview card
		const zoomBtn = previewContainer.querySelector('.img-zoom-btn');
		if (zoomBtn) {
			zoomBtn.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				showLightbox(zoomBtn.dataset.src, zoomBtn.dataset.caption);
			});
		}
	};

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
							const { prizeName, prizeCode, _id, image } = { ...item };
							const isSelected = PRIZE_DATA && PRIZE_DATA.prizeId === _id;
							return `
								<tr class="prize-row ${isSelected ? 'selected-row' : ''}" data-prize-id="${_id}" style="cursor: pointer;">
									<th scope="row" style="vertical-align: middle;">${_idx + 1}</th>
									<td>
										<div class="prize-thumb-container">
											${
												image
													? `<img class="prize-thumb-img" src="${image}" alt="${prizeName}" />`
													: `<div class="prize-thumb-fallback"><i class="fas fa-gift"></i></div>`
											}
										</div>
									</td>
									<td class="prize-name-cell" style="vertical-align: middle;">${prizeName || '-'}</td>
									<td style="text-align: center; vertical-align: middle;">
										<input
											type="radio"
											class="prize_select"
											name="prize_select"
											value="${_id}"
											${isSelected ? 'checked' : ''}
											data-prize-name="${prizeName}"
											data-prize-code="${prizeCode}"
											data-prize-id="${_id}"
											data-prize-image="${image || ''}"
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
									<td style="padding: 12px" colspan="4">Không có dữ liệu</td>
							</tr>`;

					// Update preview on load if prize is already selected
					if (PRIZE_DATA) {
						updatePrizePreview(
							PRIZE_DATA.prizeName,
							PRIZE_DATA.prizeCode,
							PRIZE_DATA.prizeImage,
						);
					} else {
						updatePrizePreview(null);
					}

					// Click on row selects the radio button
					const prizeRows = document.querySelectorAll('.prize-row');
					prizeRows.forEach((row) => {
						row.addEventListener('click', function (e) {
							if (e.target.tagName === 'INPUT') return;

							const radio = this.querySelector(
								'input[type="radio"].prize_select',
							);
							if (radio) {
								radio.checked = true;
								radio.dispatchEvent(new Event('change'));
							}
						});
					});

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
								prizeImage: e.target.dataset.prizeImage,
							};

							// Toggle class selected-row
							document
								.querySelectorAll('.prize-row')
								.forEach((r) => r.classList.remove('selected-row'));
							const row = e.target.closest('.prize-row');
							if (row) row.classList.add('selected-row');

							// Update preview
							updatePrizePreview(
								PRIZE_DATA.prizeName,
								PRIZE_DATA.prizeCode,
								PRIZE_DATA.prizeImage,
							);
						});
					});
				});
		}
	};
	getListPrize();

	// !! STATISTICAL
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

				elementResult.innerHTML = `
					<div class="lucky-result-card animate__animated animate__zoomIn">
						<button style="display: none!important" class="btn-secret-delete-winner btn-delete-winner-main-action" data-id="${_userPrize?._id || _userPrize?.id || ''}" data-name="${_userPrize?.fullName || ''}" title="Hủy kết quả khi nhân sự vắng mặt">
							<i class="fas fa-trash-alt"></i>
						</button>
						<div class="res-label">XIN CHÚC MỪNG</div>
						<h1 class="res-name">${_userPrize?.fullName || 'UNKNOWN'}</h1>
						<div class="res-info">
							<span class="res-badge">Mã số dự thưởng: ${(_userPrize?.maNV || _userPrize?.email || '').toUpperCase()}</span>
							<div class="res-dept">Phòng ban: ${_userPrize?.phongBan || _userPrize?.donVi || ''}</div>
						</div>
					</div>
				`;
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
	//! ============================

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

	// !! STATISTICAL
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
	//! ============================

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
						const { _id, email, fullName, phongBan, prize, group, donVi } = {
							...item,
						};
						return `<tr>
										<th scope="row">${_idx + 1}</th>
										<td class="col-email">${(email || '-').toUpperCase()}</td>
										<td>${fullName || '-'}</td>
										<td class="col-chinhanh">${donVi || '-'}</td>
										<td>${phongBan || '-'}</td>
										<td class="col-nhom">${group || '-'}</td>
										<td>${prize?.prizeName || '-'}</td>
										<td style="text-align: center;">
											<button class="btn-delete-winner btn-delete-winner-action" data-id="${_id || ''}" data-name="${fullName || ''}" title="Hủy giải thưởng">
												<i class="fas fa-trash-alt"></i>
											</button>
										</td>
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
									<td style="padding: 12px" colspan="8">Không có dữ liệu</td>
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
	// !! STATISTICAL
	chartStatisticalButton.addEventListener('click', onChartStatisticalOpen);
	checkinChartStatisticalButton.addEventListener(
		'click',
		onCheckinChartStatisticalOpen,
	);
	chartStatisticalCloseButton.addEventListener(
		'click',
		onChartStatisticalClose,
	);
	checkinChartStatisticalCloseButton.addEventListener(
		'click',
		onCheckinChartStatisticalClose,
	);
	//! ============================
	userSettingsCloseButton.addEventListener('click', onUserPrizesClose);
	userJoinCloseButton.addEventListener('click', onUserJoinClose);

	// Event delegation to handle deleting winner
	if (tabelUserPrizeBody) {
		tabelUserPrizeBody.addEventListener('click', async (e) => {
			const deleteBtn = e.target.closest('.btn-delete-winner-action');
			if (!deleteBtn || deleteBtn.classList.contains('loading')) return;

			const id = deleteBtn.getAttribute('data-id');
			const name = deleteBtn.getAttribute('data-name');

			if (!id) {
				Dialog.showAlert(
					'Thông báo',
					'Không tìm thấy thông tin định danh của nhân sự.',
					'warning',
				);
				return;
			}

			if (!PROGRAM_ID) {
				Dialog.showAlert(
					'Thông báo',
					'Không tìm thấy thông tin chương trình.',
					'warning',
				);
				return;
			}

			// Click lần 1: Kích hoạt trạng thái chờ xác nhận
			if (!deleteBtn.classList.contains('confirm-pending')) {
				deleteBtn.classList.add('confirm-pending');
				deleteBtn.setAttribute('data-original-html', deleteBtn.innerHTML);
				deleteBtn.innerHTML = '<i class="fas fa-question"></i>';
				deleteBtn.setAttribute('title', 'Nhấn một lần nữa để xác nhận xóa');

				// Đặt tự động khôi phục về bình thường sau 3 giây nếu không nhấn tiếp
				const resetTimeout = setTimeout(() => {
					if (deleteBtn.classList.contains('confirm-pending')) {
						deleteBtn.classList.remove('confirm-pending');
						deleteBtn.innerHTML =
							deleteBtn.getAttribute('data-original-html') ||
							'<i class="fas fa-trash-alt"></i>';
						deleteBtn.setAttribute('title', 'Hủy giải thưởng');
					}
				}, 3000);

				deleteBtn.dataset.timeoutId = resetTimeout;
				return; // Dừng lại ở click lần thứ nhất
			}

			// Click lần 2: Thực thi cuộc gọi xóa thực tế
			if (deleteBtn.dataset.timeoutId) {
				clearTimeout(Number(deleteBtn.dataset.timeoutId));
			}
			deleteBtn.classList.remove('confirm-pending');

			// Thêm trạng thái loading
			deleteBtn.classList.add('loading');
			deleteBtn.disabled = true;
			const originalIcon =
				deleteBtn.getAttribute('data-original-html') || deleteBtn.innerHTML;
			deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

			try {
				const response = await fetch(
					`${ENDPOINT_BACKEND}/delete-user/${PROGRAM_ID}/${id}`,
					{
						method: 'DELETE',
						headers: {
							accept: 'application/json',
							// 'token': TOKENS.token,
							// 'tokenAPI': TOKENS.tokenAPI
						},
					},
				);

				const data = await response.json();
				if (data?.success) {
					// Hiển thị tích xanh thành công trực tiếp trên nút
					deleteBtn.classList.remove('loading');
					deleteBtn.classList.add('success-state');
					deleteBtn.innerHTML = '<i class="fas fa-check"></i>';

					// Đợi 1 giây rồi cập nhật bảng (dòng sẽ biến mất mượt mà)
					setTimeout(() => {
						if (typeof onUserPrizesOpen === 'function') {
							onUserPrizesOpen();
						}
					}, 1000);
				} else {
					const errorMsg =
						data?.errors?.[0]?.message ||
						data?.errors?.[0]?.msg ||
						'Thao tác xóa thất bại.';

					// Hiển thị dấu chéo đỏ thất bại trực tiếp trên nút và tooltip lỗi
					deleteBtn.classList.remove('loading');
					deleteBtn.classList.add('fail-state');
					deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
					deleteBtn.setAttribute('title', `Lỗi: ${errorMsg}`);

					// Đợi 2 giây khôi phục lại nút như cũ
					setTimeout(() => {
						deleteBtn.classList.remove('fail-state');
						deleteBtn.disabled = false;
						deleteBtn.innerHTML = originalIcon;
						deleteBtn.setAttribute('title', 'Hủy giải thưởng');
					}, 2000);
				}
			} catch (error) {
				console.error('Error deleting winner:', error);

				deleteBtn.classList.remove('loading');
				deleteBtn.classList.add('fail-state');
				deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
				deleteBtn.setAttribute('title', 'Lỗi hệ thống khi gọi API');

				setTimeout(() => {
					deleteBtn.classList.remove('fail-state');
					deleteBtn.disabled = false;
					deleteBtn.innerHTML = originalIcon;
					deleteBtn.setAttribute('title', 'Hủy giải thưởng');
				}, 2000);
			}
		});
	}

	// Event delegation to handle deleting winner from the main screen result card
	if (elementResult) {
		elementResult.addEventListener('click', async (e) => {
			const deleteBtn = e.target.closest('.btn-delete-winner-main-action');
			if (!deleteBtn || deleteBtn.classList.contains('loading')) return;

			const id = deleteBtn.getAttribute('data-id');
			const name = deleteBtn.getAttribute('data-name');

			if (!id) {
				Dialog.showAlert(
					'Thông báo',
					'Không tìm thấy thông tin định danh của nhân sự.',
					'warning',
				);
				return;
			}

			if (!PROGRAM_ID) {
				Dialog.showAlert(
					'Thông báo',
					'Không tìm thấy thông tin chương trình.',
					'warning',
				);
				return;
			}

			// Click lần 1: Kích hoạt trạng thái chờ xác nhận
			if (!deleteBtn.classList.contains('confirm-pending')) {
				deleteBtn.classList.add('confirm-pending');
				deleteBtn.setAttribute('data-original-html', deleteBtn.innerHTML);
				deleteBtn.innerHTML = '<i class="fas fa-question"></i>';
				deleteBtn.setAttribute('title', 'Nhấn một lần nữa để xác nhận xóa');

				// Đặt tự động khôi phục về bình thường sau 3 giây nếu không nhấn tiếp
				const resetTimeout = setTimeout(() => {
					if (deleteBtn.classList.contains('confirm-pending')) {
						deleteBtn.classList.remove('confirm-pending');
						deleteBtn.innerHTML =
							deleteBtn.getAttribute('data-original-html') ||
							'<i class="fas fa-trash-alt"></i>';
						deleteBtn.setAttribute('title', 'Hủy kết quả khi nhân sự vắng mặt');
					}
				}, 3000);

				deleteBtn.dataset.timeoutId = resetTimeout;
				return; // Dừng lại ở click lần thứ nhất
			}

			// Click lần 2: Thực thi cuộc gọi xóa thực tế
			if (deleteBtn.dataset.timeoutId) {
				clearTimeout(Number(deleteBtn.dataset.timeoutId));
			}
			deleteBtn.classList.remove('confirm-pending');

			deleteBtn.classList.add('loading');
			deleteBtn.disabled = true;
			const originalIcon =
				deleteBtn.getAttribute('data-original-html') || deleteBtn.innerHTML;
			deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

			try {
				const response = await fetch(
					`${ENDPOINT_BACKEND}/delete-user/${PROGRAM_ID}/${id}`,
					{
						method: 'DELETE',
						headers: {
							accept: 'application/json',
							// 'token': TOKENS.token,
							// 'tokenAPI': TOKENS.tokenAPI
						},
					},
				);

				const data = await response.json();
				if (data?.success) {
					// Hiển thị tích xanh thành công trực tiếp trên nút
					deleteBtn.classList.remove('loading');
					deleteBtn.classList.add('success-state');
					deleteBtn.innerHTML = '<i class="fas fa-check"></i>';

					// Đợi 1 giây rồi xóa card kết quả trên màn hình chính
					setTimeout(() => {
						elementResult.innerHTML =
							'<div style="color: #64748b; font-size: 1.5rem; font-weight: 600; text-align: center; padding: 20px;">Đã hủy kết quả trúng thưởng</div>';
					}, 1000);
				} else {
					const errorMsg =
						data?.errors?.[0]?.message ||
						data?.errors?.[0]?.msg ||
						'Thao tác xóa thất bại.';

					// Hiển thị dấu chéo đỏ thất bại trực tiếp trên nút và tooltip lỗi
					deleteBtn.classList.remove('loading');
					deleteBtn.classList.add('fail-state');
					deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
					deleteBtn.setAttribute('title', `Lỗi: ${errorMsg}`);

					// Đợi 2 giây khôi phục lại nút như cũ
					setTimeout(() => {
						deleteBtn.classList.remove('fail-state');
						deleteBtn.disabled = false;
						deleteBtn.innerHTML = originalIcon;
						deleteBtn.setAttribute('title', 'Hủy kết quả khi nhân sự vắng mặt');
					}, 2000);
				}
			} catch (error) {
				console.error('Error deleting winner from main screen:', error);

				deleteBtn.classList.remove('loading');
				deleteBtn.classList.add('fail-state');
				deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
				deleteBtn.setAttribute('title', 'Lỗi hệ thống khi gọi API');

				setTimeout(() => {
					deleteBtn.classList.remove('fail-state');
					deleteBtn.disabled = false;
					deleteBtn.innerHTML = originalIcon;
					deleteBtn.setAttribute('title', 'Hủy kết quả khi nhân sự vắng mặt');
				}, 2000);
			}
		});
	}

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

	chartStatisticalWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		onChartStatisticalClose(e);
	});

	checkinChartStatisticalWrapper.addEventListener('click', (e) => {
		e.stopPropagation();
		onCheckinChartStatisticalClose(e);
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

	chartStatisticalContent.addEventListener('click', (e) => {
		e.stopPropagation();
		chartStatisticalWrapper.style.display = 'block';
	});

	checkinChartStatisticalContent.addEventListener('click', (e) => {
		e.stopPropagation();
		checkinChartStatisticalWrapper.style.display = 'block';
	});

	// ! HANDLE PRIZE SELECT
	function submitPrize(e) {
		if (PRIZE_DATA) {
			onPrizesSelectClose(e);
			prizeDataElement.innerHTML = `${PRIZE_DATA.prizeId}`;

			// Show selection on the main screen
			const currentPrizeDisplay = document.getElementById(
				'current-prize-display',
			);
			const currentPrizeImg = document.getElementById('current-prize-img');
			const currentPrizeName = document.getElementById('current-prize-name');
			const currentPrizeCode = document.getElementById('current-prize-code');

			if (currentPrizeDisplay) {
				currentPrizeName.textContent = PRIZE_DATA.prizeName;
				currentPrizeCode.textContent = `Mã giải: ${PRIZE_DATA.prizeCode || '-'}`;

				const currentPrizeZoomBtn = document.getElementById(
					'current-prize-zoom-btn',
				);

				if (PRIZE_DATA.prizeImage) {
					currentPrizeImg.src = PRIZE_DATA.prizeImage;
					currentPrizeImg.style.display = 'block';
					if (currentPrizeZoomBtn) {
						currentPrizeZoomBtn.dataset.src = PRIZE_DATA.prizeImage;
						currentPrizeZoomBtn.dataset.caption = PRIZE_DATA.prizeName;
						currentPrizeZoomBtn.style.display = 'flex';
					}
					const imgWrapper = currentPrizeImg.closest(
						'.current-prize-img-wrapper',
					);
					if (imgWrapper) {
						const fallback = imgWrapper.querySelector(
							'.current-prize-fallback',
						);
						if (fallback) fallback.remove();
					}
				} else {
					currentPrizeImg.style.display = 'none';
					if (currentPrizeZoomBtn) {
						currentPrizeZoomBtn.style.display = 'none';
					}
					const imgWrapper = currentPrizeImg.closest(
						'.current-prize-img-wrapper',
					);
					if (imgWrapper) {
						let fallback = imgWrapper.querySelector('.current-prize-fallback');
						if (!fallback) {
							fallback = document.createElement('div');
							fallback.className = 'current-prize-fallback';
							fallback.style.fontSize = '2rem';
							fallback.style.color = '#94a3b8';
							fallback.innerHTML = '<i class="fas fa-gift"></i>';
							imgWrapper.appendChild(fallback);
						}
					}
				}

				currentPrizeDisplay.style.display = 'block';
			}
		} else {
			alert('Vui lòng chọn phần thưởng trước khi xác nhận. Xin cảm ơn!');
		}
	}
	// !! LIGHTBOX FUNCTIONALITY
	const setupLightbox = () => {
		const lightbox = document.getElementById('image-lightbox');
		const lightboxClose = lightbox?.querySelector('.lightbox-close');
		if (!lightbox) return;

		lightboxClose?.addEventListener('click', hideLightbox);
		lightbox.addEventListener('click', (e) => {
			if (
				e.target === lightbox ||
				e.target.classList.contains('lightbox-close') ||
				e.target.closest('.lightbox-close')
			) {
				hideLightbox();
			}
		});

		// Attach zoom click listener directly to the main screen button
		const currentPrizeZoomBtn = document.getElementById(
			'current-prize-zoom-btn',
		);
		if (currentPrizeZoomBtn) {
			currentPrizeZoomBtn.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				showLightbox(
					currentPrizeZoomBtn.dataset.src,
					currentPrizeZoomBtn.dataset.caption,
				);
			});
		}
	};
	setupLightbox();

	// CLICK PRIZE SELECT
	settingsSavePrizeSelectButton.addEventListener('click', submitPrize);
};

document.addEventListener('DOMContentLoaded', () => {
	start();
});
