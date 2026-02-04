// https://icdpmobile.fpt.net/icdp-mobile-staging/v1/icdp-backend-mobile/ct-tat-nien
const ENDPOINT_BACKEND =
	'https://icdpmobile.fpt.net/v1/icdp-backend-mobile/ct-tat-nien';

const ipAddressElement = document.getElementById('ip-address');

const URL_BACKGROUND_HEADER_FORM =
	'https://sf-static.upanhlaylink.com/img/image_20250826bb2383fa4c5c3fb975fc6130ddee0961.jpg';
const URL_BACKGROUND = 'url(../../../assets/og/YEP_SOC_2026.png)';

const checkIpWiFi = async () => {
	return await fetch('https://api64.ipify.org?format=json')
		.then((response) => response.json())
		.then((data) => {
			// ipAddressElement.innerHTML = data.ip;
			if (data.ip.startsWith('58.188')) {
				return data.ip;
			} else {
				return '';
			}
		})
		.catch((error) => {
			return '';
		});
};

var DATA_PAYLOAD = [];
const startForm = () => {
	const backgroundHeaderForm = document.getElementById(
		'background-header-form',
	);
	const formMainWrapper = document.querySelector('.formbold-main-wrapper');
	const maNVInput = document.getElementById('maNV');
	const infoConfirmElement = document.getElementById('info_confirm');
	const messageFormElement = document.getElementById('message-form');
	const formStepOneElement = document.getElementById('form-step-one');
	const formStepTwoElement = document.getElementById('form-step-two');
	const formSubmitElement = document.getElementById('form-submit');
	const formCheckInfoElement = document.getElementById('form-check-info');

	// ! GET PROGRAM
	const getProgram = async () => {
		return await fetch(`${ENDPOINT_BACKEND}/create-program`, {
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
						'Lấy danh sách chương trình không thành công';
					return;
				}
				if (payload && payload.length > 0) {
					return payload[0]._id;
				} else {
					return '';
				}
			});
	};
	// !!!

	// ! SUBMIT FORM
	const submitForm = async (body) => {
		await getProgram().then(async (id) => {
			if (id) {
				// modalLoading.style.display = 'flex';
				await fetch(`${ENDPOINT_BACKEND}/submit-form-check-in/${id}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
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
								'Thao tác không thành công';
							return;
						}
						formStepOneElement.style.display = 'none';
						formStepTwoElement.style.display = 'block';
						if (payload.fullName && document.getElementById('res_fullName')) {
							document.getElementById('res_fullName').innerText =
								payload.fullName || '-';
							document.getElementById('res_maNV').innerText =
								payload.maNV || '-';
							document.getElementById('res_phongBan').innerText =
								payload.phongBan || '-';
							document.getElementById('res_group').innerText =
								payload.group || '-';
							document.getElementById('res_chiNhanh').innerText =
								payload.donVi || '-';
							document.getElementById('res_timeCheckin').innerText =
								moment(payload.timeCheckIn)
									.add(7, 'hours')
									.format('DD/MM/YYYY HH:mm:ss') || '-';
						}
					});
			}
		});
	};
	// checkIpWiFi().then(async (res) => {
	// 	if (res) {
	// 	} else {
	// 	}
	// });

	// ! SET NBACKGROUND IMAGE
	if (backgroundHeaderForm) {
		backgroundHeaderForm.src = URL_BACKGROUND_HEADER_FORM;
	}
	formMainWrapper.style.setProperty('--bg-image', URL_BACKGROUND);

	if (formCheckInfoElement) {
		formCheckInfoElement.addEventListener('click', async () => {
			await getProgram().then(async (id) => {
				if (id) {
					await fetch(
						`${ENDPOINT_BACKEND}/get-users-by-program/${id}` +
							`${maNVInput.value ? `?keyword=${maNVInput.value}` : ''}`,
						{
							method: 'GET',
						},
					)
						.then((response) => {
							return response.json();
						})
						.then(async (data) => {
							const { success, errors, payload } = { ...data };
							if (!success) {
								alert(
									errors?.[0]?.message ||
										errors?.[0]?.msg ||
										'Thao tác không thành công',
								);
								return;
							}

							DATA_PAYLOAD = payload;
							const { status } = { ...payload?.[0] };

							if (status === 'CHECKED_IN' || status === 'PRIZED') {
								formCheckInfoElement.style.display = 'none';
								formSubmitElement.style.display = 'none';
							} else {
								formCheckInfoElement.style.display = 'none';
								formSubmitElement.style.display = 'block';
							}

							if (payload.length > 0) {
								const htmls = payload
									.map((item) => {
										const { status, maNV, fullName, donVi, group, phongBan } = {
											...item,
										};
										const isCheckinPrize =
											status === 'CHECKED_IN' || status === 'PRIZED';
										const bodySubmit = {
											maNV: maNV,
										};
										return `
										<div style="display: flex; flex-direction: row; gap: 12px; align-items: flex-start">
											<div style="flex: 1">
												<div><b>Họ và tên:</b> <span id="res_confirm_fullName">${
													fullName || '-'
												}</span></div>
												<div><b>Mã nhân viên:</b> <span id="res_confirm_maNV">${
													maNV || '-'
												}</span></div>
												<div><b>Chi nhánh:</b> <span id="res_confirm_chiNhanh">${
													donVi || '-'
												}</span></div>
												<div><b>Phòng ban:</b> <span id="res_confirm_phongBan">${
													phongBan || '-'
												}</span></div>
												<div><b>Nhóm:</b> <span id="res_confirm_group">${group || '-'}</span></div> 
											</div>
											<div data-body='${JSON.stringify(bodySubmit)}' 
													class="checkin-btn"
													style="display: inline-block; border-radius: 8px; color: #FFF; cursor: default; width: max-content; margin-top: 0; padding: 12px; background-color: ${
														status === 'CHECKED_IN'
															? '#15803d'
															: status === 'PRIZED'
																? '#1d4ed8'
																: '#b91c1c'
													}!important">
													${
														isCheckinPrize
															? status === 'CHECKED_IN'
																? 'ĐÃ CHECK IN'
																: 'ĐÃ TRÚNG THƯỞNG'
															: 'CHƯA CHECK IN'
													}
											</div>
										</div>
									
									</br>
								`;
									})
									.join('');
								infoConfirmElement.innerHTML = htmls;
								// if (document.querySelectorAll('.checkin-btn').length > 0) {
								// 	document
								// 		.querySelectorAll('.checkin-btn')
								// 		.forEach((button) => {
								// 			button.addEventListener('click', function () {
								// 				const body = JSON.parse(this.getAttribute('data-body'));
								// 				submitForm(body);
								// 			});
								// 		});
								// }
							} else {
								formCheckInfoElement.style.display = 'none';
								formSubmitElement.style.display = 'none';
								infoConfirmElement.innerHTML =
									'<div style="text-align: center">Không tìm thấy thông tin nhân viên</div>';
							}
						});
				}
			});
		});
	}

	if (maNVInput) {
		formCheckInfoElement.disabled = !maNVInput.value;
		formSubmitElement.disabled = !maNVInput.value;
		maNVInput.addEventListener('input', () => {
			formCheckInfoElement.disabled = !maNVInput.value;
			formSubmitElement.disabled = !maNVInput.value;
			formSubmitElement.style.display = 'none';
			formCheckInfoElement.style.display = 'block';
			infoConfirmElement.innerHTML = '';
			messageFormElement.innerHTML = '';
		});
	}

	if (formSubmitElement) {
		formSubmitElement.addEventListener('click', async () => {
			const body = {
				maNV: maNVInput.value,
			};
			await submitForm(body);
		});
	}
};

document.addEventListener('DOMContentLoaded', () => {
	startForm();
});
