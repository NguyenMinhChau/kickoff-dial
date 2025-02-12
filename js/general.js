function setOgImage(imageUrl) {
	// Tìm thẻ meta `og:image` nếu đã tồn tại
	let metaTag = document.querySelector('meta[property="og:image"]');

	if (!metaTag) {
		// Nếu không tồn tại, tạo mới
		metaTag = document.createElement('meta');
		metaTag.setAttribute('property', 'og:image');
		document.head.appendChild(metaTag); // Thêm vào phần <head>
	}

	// Cập nhật URL hình ảnh
	metaTag.setAttribute('content', imageUrl);
}

const startGeneral = () => {
	// ! SET IMAGE OG
	setOgImage('../assets/og/KICKOFF_V5.png');
};

startGeneral();
