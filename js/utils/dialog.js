export const Dialog = {
	showConfirm(title, message, options = {}) {
		return new Promise((resolve) => {
			const overlay = document.createElement('div');
			overlay.className = 'custom-dialog-overlay';
			
			const confirmText = options.confirmText || 'Đồng ý';
			const cancelText = options.cancelText || 'Hủy bỏ';
			const iconClass = options.icon || 'fas fa-exclamation-triangle';
			const iconType = options.type || 'warning'; // success, error, warning, info
			
			overlay.innerHTML = `
				<div class="custom-dialog-box">
					<div class="custom-dialog-icon ${iconType}">
						<i class="${iconClass}"></i>
					</div>
					<h3 class="custom-dialog-title">${title}</h3>
					<p class="custom-dialog-message">${message}</p>
					<div class="custom-dialog-actions">
						<button class="custom-btn custom-btn-cancel">${cancelText}</button>
						<button class="custom-btn custom-btn-confirm">${confirmText}</button>
					</div>
				</div>
			`;
			
			document.body.appendChild(overlay);
			
			// Trigger browser reflow for entry animation
			overlay.offsetHeight; 
			overlay.classList.add('show');
			
			const cancelBtn = overlay.querySelector('.custom-btn-cancel');
			const confirmBtn = overlay.querySelector('.custom-btn-confirm');
			
			const cleanup = (result) => {
				overlay.classList.remove('show');
				setTimeout(() => {
					overlay.remove();
					resolve(result);
				}, 250);
			};
			
			cancelBtn.addEventListener('click', () => cleanup(false));
			confirmBtn.addEventListener('click', () => cleanup(true));
			
			// Close if clicking outside the box
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) {
					cleanup(false);
				}
			});
		});
	},
	
	showAlert(title, message, type = 'info') {
		return new Promise((resolve) => {
			const overlay = document.createElement('div');
			overlay.className = 'custom-dialog-overlay';
			
			let iconClass = 'fas fa-info-circle';
			if (type === 'success') iconClass = 'fas fa-check-circle';
			else if (type === 'error') iconClass = 'fas fa-times-circle';
			else if (type === 'warning') iconClass = 'fas fa-exclamation-circle';
			
			overlay.innerHTML = `
				<div class="custom-dialog-box">
					<div class="custom-dialog-icon ${type}">
						<i class="${iconClass}"></i>
					</div>
					<h3 class="custom-dialog-title">${title}</h3>
					<p class="custom-dialog-message">${message}</p>
					<div class="custom-dialog-actions">
						<button class="custom-btn custom-btn-confirm" style="min-width: 100px;">Đồng ý</button>
					</div>
				</div>
			`;
			
			document.body.appendChild(overlay);
			
			// Trigger browser reflow
			overlay.offsetHeight; 
			overlay.classList.add('show');
			
			const confirmBtn = overlay.querySelector('.custom-btn-confirm');
			
			const cleanup = () => {
				overlay.classList.remove('show');
				setTimeout(() => {
					overlay.remove();
					resolve();
				}, 250);
			};
			
			confirmBtn.addEventListener('click', cleanup);
			
			overlay.addEventListener('click', (e) => {
				if (e.target === overlay) {
					cleanup();
				}
			});
		});
	}
};
