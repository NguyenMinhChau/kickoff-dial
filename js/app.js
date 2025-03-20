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
	themeRedElement[0].style.backgroundImage =
		'url(../../../assets/og/SINH_NHAT_BGG_01.gif)';
	backgroundHeaderFormIndex.src = '../assets/og//BG_CHECKIN.png';
	formIndexMainWrapper.style.backgroundImage =
		'url(../../../assets/og/YEP_VTU.png)';
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
						messageFormElement.innerHTML =
							errors?.[0]?.message ||
							errors?.[0]?.msg ||
							'Lấy mã QR Code không thành công';
						return;
					}
					if (payload) {
						return payload;
					} else {
						return '../assets/og/QR_CODE_PLACEHOLDER.png';
					}
				});
		};
		getDataQrCode().then(async (res) => {
			imageQrCodeElement.src = res;
			// imageQrCodeCheckinStatisticalElement.src = res;
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
			let _myChart = ctxChartDeparment || ctxCheckinChartDeparment;
			MY_CHART.destroy();

			_myChart.clearRect(0, 0, _myChart.canvas.width, _myChart.canvas.height);

			_myChart.beginPath();
			_myChart.save();
		}
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
							const {
								email,
								fullName,
								phongBan,
								status,
								timeCheckIn,
								group,
								prize,
								donVi,
							} = { ...item };
							// <td>${
							// 	isCheckIn
							// 		? `<div>
							// 	<p style="color: #15803d; margin: 0; padding: 0">ĐÃ CHECK IN</p>
							// 	<p style="color: #15803d; margin: 0; padding: 0; font-size: 10px">${moment(
							// 		timeCheckIn,
							// 	)
							// 		.add(7, 'hours')
							// 		.format('DD/MM/YYYY HH:mm:ss')}</p>
							// </div>`
							// 		: isPrized
							// 		? `<div>
							// 	<p style="color: #1d4ed8; margin: 0; padding: 0">TRÚNG THƯỞNG</p>
							// 	<p style="color: #1d4ed8; margin: 0; padding: 0; font-size: 10px">${
							// 		prize?.prizeName || '-'
							// 	}</p>
							// </div>`
							// 		: `<span style="color: #b91c1c">CHƯA CHECK IN</span>`
							// }</td>
							const isCheckIn = status === 'CHECKED_IN';
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

	// !! STATISTICAL
	const getStatisticalChart = async (noClearChart = false) => {
		if (PROGRAM_ID) {
			await fetch(
				`${ENDPOINT_BACKEND}/thong-ke-so-luong-quay-so/${PROGRAM_ID}`,
				{
					method: 'GET',
				},
			)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					const { success, errors, payload } = { ...data };
					if (!success) {
						alert(
							errors?.[0]?.message ||
								errors?.[0]?.msg ||
								'Lấy danh sách giải thưởng không thành công',
						);
						return;
					}
					// !CHART DEPARTMENT
					if (!noClearChart) {
						clearChart();
					}
					// Chuyển object thành mảng để dễ sắp xếp
					const sortedData = Object.entries(payload)
						.map(([label, values]) => ({ label, ...values })) // Chuyển đổi thành object
						.sort((a, b) => b.total - a.total); // Sắp xếp theo total giảm dần

					// Tách dữ liệu đã sắp xếp thành các mảng riêng biệt
					const sortedLabels = sortedData.map((item) =>
						item.label.toUpperCase(),
					);
					const sortedTotalValues = sortedData.map((item) => item.total);
					const sortedCheckedInValues = sortedData.map(
						(item) => item.checkedIn,
					);
					// const sortedPrizedValues = sortedData.map((item) => item.prized);
					// Tính tổng số chiến binh và tổng số đã check-in
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

					// // Thêm hàng "TỔNG CỘNG" vào dữ liệu
					// sortedLabels.push('TỔNG');
					// sortedTotalValues.push(totalAllTeams);
					// sortedCheckedInValues.push(totalCheckedInAllTeams);

					sunmaryChart.innerHTML = `
						<div>Tổng số: <b>${totalAllTeams?.toLocaleString()}</b> chiến binh</div>
						<div>Phần trăm đã checkin: <b>${percentageCheckedInAllTeams}</b>%</div>
					`;

					let _mychart =
						chartStatisticalWrapper.style.display === 'block'
							? ctxChartDeparment
							: ctxCheckinChartDeparment;

					MY_CHART = new Chart(_mychart, {
						type: 'bar',
						data: {
							labels: sortedLabels.map((item) => item.toUpperCase()),
							datasets: [
								// {
								// 	label: '',
								// 	data: sortedLabels.map((label) =>
								// 		label === 'TỔNG' ? percentageCheckedInAllTeams : null,
								// 	),
								// 	borderWidth: 1,
								// 	hidden: true,
								// 	datalabels: {
								// 		anchor: 'end',
								// 		align: 'top',
								// 		color: '#FFFFFF',
								// 		font: {
								// 			size: 30,
								// 			weight: 'bold',
								// 		},
								// 		formatter: (value) => (value ? value + '%' : ''),
								// 	},
								// },
								{
									label: 'TỔNG SỐ CHIẾN BINH',
									data: sortedTotalValues,
									// backgroundColor: '#FFFFFF',
									// borderColor: '#FFFFFF',
									backgroundColor: sortedLabels.map(
										(label) => titleColors[label.toUpperCase()] || '#FFFFFF',
									), // Đặt màu theo titleColors
									borderColor: sortedLabels.map(
										(label) => titleColors[label.toUpperCase()] || '#FFFFFF',
									),
									borderWidth: 1,
								},
								{
									label: 'PHẦN TRĂM CHIẾN BINH ĐÃ CHECK-IN',
									data: sortedCheckedInValues,
									// backgroundColor: '#FFFFFF',
									// borderColor: '#FFFFFF',
									backgroundColor: sortedLabels.map(
										(label) => titleColors[label.toUpperCase()] || '#FFFFFF',
									),
									borderColor: sortedLabels.map(
										(label) => titleColors[label.toUpperCase()] || '#FFFFFF',
									),
									borderWidth: 1,
									//hidden: true, // Mặc định ẩn dataset này
									datalabels: {
										anchor: 'end',
										align: 'top',
										color: '#FFFFFF',
										font: {
											size: 30,
											weight: 'bold',
										},
										formatter: (value, context) => {
											const total = sortedTotalValues[context.dataIndex]; // Lấy tổng số chiến binh của cột hiện tại
											if (!total) return '0%'; // Tránh lỗi chia cho 0
											const percentage = (value / total) * 100;
											return percentage.toFixed(2) + '%'; // Hiển thị 2 số thập phân
										},
									},
								},
								// {
								// 	label: 'SỐ CHIẾN BINH TRÚNG THƯỞNG',
								// 	data: sortedPrizedValues,
								// 	backgroundColor: '#FFFFFF',
								// 	borderColor: '#FFFFFF',
								// 	borderWidth: 1,
								// 	hidden: true, // Mặc định ẩn dataset này
								// },
							],
						},
						options: {
							responsive: true,
							animation: false,
							layout: {
								padding: { top: 50 }, // Giữ khoảng cách phía trên để tránh cắt số
							},
							plugins: {
								legend: {
									display: true,
									labels: {
										font: {
											size: 14,
											weight: 'bold',
										},
										color: '#FFFFFF',
										padding: 15,
									},
									position: 'bottom', // Đưa legend xuống dưới chart
								},
								tooltip: {
									enabled: true, // Hiển thị tooltip khi hover
								},
								datalabels: {
									anchor: 'end',
									align: 'top',
									color: '#FFFFFF',
									font: {
										size: 30,
										weight: 'bold',
									},
									formatter: (value) => Math.round(value)?.toLocaleString(), // Hiển thị số nguyên trên cột
								},
							},
							scales: {
								x: {
									ticks: {
										font: {
											size: 12,
											weight: 'bold',
										},
										color: (context) => {
											const label = context.tick.label.toUpperCase();
											return titleColors[label] || '#FFFFFF'; // Mặc định màu trắng nếu không có trong danh sách
										},
										padding: 10,
									},
									grid: {
										display: false,
									},
									border: {
										display: false,
									},
								},
								y: {
									ticks: {
										font: {
											size: 12,
											weight: 'bold',
										},
										color: '#FFFFFF',
										padding: 10,
										callback: (value) => Math.round(value), // Format thành số nguyên
									},
									grid: {
										display: false,
									},
									border: {
										display: false,
									},
									beginAtZero: true,
								},
							},
						},
					});
					// !!
				});
		}
	};
	getStatisticalChart();

	let intervalId = null;

	function startUpdatingChart(noClearChart = false) {
		if (intervalId) return; // Tránh tạo nhiều interval

		intervalId = setInterval(() => {
			if (chartStatisticalWrapper) {
				getStatisticalChart(false);
			} else {
				clearInterval(intervalId);
				intervalId = null; // Reset intervalId khi dừng
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
				const dataJSON = formatSlotJSON(data?.payload);
				const _userPrize = data?.payload?.filter(
					(x) => (x?.maNV || x?.email) === luckyNumber,
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
		getStatisticalChart();
		startUpdatingChart(true);
		chartStatisticalWrapper.style.display = 'block';
	};

	const onCheckinChartStatisticalOpen = () => {
		getStatisticalChart();
		// startUpdatingChart(true);
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
		// clearInterval(intervalId);
		// intervalId = null;
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
		console.log({ slot });

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
