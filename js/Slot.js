function calculateMaxReelItems(durationInSeconds) {
	const timePerItem = 45; // 45ms cho mỗi item
	const totalDurationMs = durationInSeconds * 1000; // Chuyển giây sang mili giây
	const maxReelItems = Math.floor(totalDurationMs / timePerItem); // Làm tròn xuống số item
	return Number(maxReelItems);
}
class Slot {
	/** List of names to draw from */
	nameList = [];

	/** Whether there is a previous winner element displayed in reel */
	havePreviousWinner = false;

	/** Container that hold the reel items */
	reelContainer = null;

	/** Maximum item inside a reel */
	maxReelItems;

	/** Whether winner should be removed from name list */
	shouldRemoveWinner;

	/** Reel animation object instance */
	reelAnimation;

	/** Callback function that runs before spinning reel */
	onSpinStart;

	/** Callback function that runs after spinning reel */
	onSpinEnd;

	/** Callback function that runs after spinning reel */
	onNameListChanged;

	luckyNumber;

	ENDPOINT_BACKEND;

	/**
	 * Constructor of Slot
	 * @param {Object} config Configuration object
	 */
	constructor({
		maxReelItems = 110,
		removeWinner = true,
		reelContainerSelector,
		selectProgramContainer,
		usernameElementContainer,
		passwordElementContainer,
		prizeElementContainer,
		durationElementContainer,
		onSpinStart,
		onSpinEnd,
		onNameListChanged,
		ENDPOINT_BACKEND,
	}) {
		this.reelContainer = document.querySelector(reelContainerSelector);
		this.selectProgramContainer = document.querySelector(
			selectProgramContainer,
		);
		this.usernameElementContainer = document.querySelector(
			usernameElementContainer,
		);
		this.passwordElementContainer = document.querySelector(
			passwordElementContainer,
		);
		this.durationElementContainer = document.querySelector(
			durationElementContainer,
		);
		this.prizeElementContainer = document.querySelector(prizeElementContainer);
		this.maxReelItems = maxReelItems;
		this.shouldRemoveWinner = removeWinner;
		this.onSpinStart = onSpinStart;
		this.onSpinEnd = onSpinEnd;
		this.onNameListChanged = onNameListChanged;
		this.ENDPOINT_BACKEND = ENDPOINT_BACKEND;
		this.luckyNumber = 'aaa';

		// Create reel animation
		this.reelAnimation = this.reelContainer?.animate(
			[
				{ transform: 'none', filter: 'blur(0)' },
				{ filter: 'blur(1px)', offset: 0.5 },
				{
					transform: `translateY(-${
						(calculateMaxReelItems(this.durationElementContainer.value) - 1) *
						(7.5 * 16)
					}px)`,
					filter: 'blur(0)',
				},
			],
			{
				duration:
					calculateMaxReelItems(this.durationElementContainer.value) * 45, // 100ms for 1 item
				easing: 'ease-in-out',
				iterations: 1,
			},
		);

		this.reelAnimation?.cancel();
	}

	/**
	 * Setter for name list
	 * @param {string[]} names List of names to draw a winner from
	 */
	set names(names) {
		this.nameList = names;

		const reelItemsToRemove = this.reelContainer?.children
			? Array.from(this.reelContainer.children)
			: [];

		reelItemsToRemove.forEach((element) => element.remove());

		this.havePreviousWinner = false;

		if (this.onNameListChanged) {
			this.onNameListChanged();
		}
	}

	/** Getter for name list */
	get names() {
		return this.nameList;
	}

	/**
	 * Setter for shouldRemoveWinner
	 * @param {boolean} removeWinner Whether the winner should be removed from name list
	 */
	set shouldRemoveWinnerFromNameList(removeWinner) {
		this.shouldRemoveWinner = removeWinner;
	}

	/** Getter for shouldRemoveWinner */
	get shouldRemoveWinnerFromNameList() {
		return this.shouldRemoveWinner;
	}

	get getLuckyNumber() {
		return this.luckyNumber;
	}

	/**
	 * Returns a new array where the items are shuffled
	 * @param {Array} array The array to be shuffled
	 * @returns {Array} The shuffled array
	 */
	static shuffleNames(array) {
		const keys = Object.keys(array);
		const result = [];
		for (let k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
			const i = (Math.random() * n) | 0;
			const key = keys[i];
			result.push(array[key]);
			n -= 1;
			const tmp = keys[n];
			keys[n] = key;
			keys[i] = tmp;
		}
		return result;
	}

	/**
	 * Function for spinning the slot
	 * @returns {Promise<boolean>} Whether the spin is completed successfully
	 */
	async spin() {
		if (!this.nameList.length) {
			console.error('Name List is empty. Cannot start spinning.');
			return false;
		}

		// !SET TIME ANIMATION
		this.reelAnimation = this.reelContainer?.animate(
			[
				{ transform: 'none', filter: 'blur(0)' },
				{ filter: 'blur(1px)', offset: 0.5 },
				{
					transform: `translateY(-${
						(calculateMaxReelItems(this.durationElementContainer.value) - 1) *
						(7.5 * 16)
					}px)`,
					filter: 'blur(0)',
				},
			],
			{
				duration:
					calculateMaxReelItems(this.durationElementContainer.value) * 45, // 100ms for 1 item
				easing: 'ease-in-out',
				iterations: 1,
			},
		);

		await fetch(
			`${this.ENDPOINT_BACKEND}/admin-quay-so-may-man/${
				this.selectProgramContainer.value
			}?username=${this.usernameElementContainer.value}&password=${
				this.passwordElementContainer.value
			}${
				this.prizeElementContainer.textContent
					? `&prize=${this.prizeElementContainer.textContent}`
					: ''
			}`,
			{
				method: 'GET',
			},
		)
			.then((response) => {
				return response.json();
			})
			.then(async (data) => {
				const { success, errors } = { ...data };
				if (!success) {
					alert(
						errors?.[0]?.message ||
							errors?.[0]?.msg ||
							'Thao tác không thành công',
					);
					return;
				}
				const { userPrize } = { ...data.payload };

				if (this.onSpinStart) {
					this.onSpinStart();
				}

				const { reelContainer, reelAnimation, shouldRemoveWinner } = this;
				if (!reelContainer || !reelAnimation) {
					return false;
				}

				// Shuffle names and create reel items
				let randomNames = Slot.shuffleNames(this.nameList);

				while (
					randomNames.length &&
					randomNames.length <
						calculateMaxReelItems(this.durationElementContainer.value)
				) {
					randomNames = [...randomNames, ...randomNames];
				}

				randomNames = randomNames.slice(
					0,
					calculateMaxReelItems(this.durationElementContainer.value) -
						Number(this.havePreviousWinner),
				);

				const fragment = document.createDocumentFragment();

				// ! IMPORTANT
				randomNames[randomNames.length - 1] =
					userPrize?.maNV || userPrize?.email;

				randomNames.forEach((name) => {
					const newReelItem = document.createElement('div');
					newReelItem.innerHTML = name;
					fragment.appendChild(newReelItem);
				});

				reelContainer.appendChild(fragment);

				this.luckyNumber = userPrize?.maNV || userPrize?.email;

				// Remove winner form name list if necessary
				if (shouldRemoveWinner) {
					this.nameList.splice(
						this.nameList.findIndex(
							(name) => name === (userPrize?.maNV || userPrize?.email),
						),
						1,
					);
				}
				const animationPromise = new Promise((resolve) => {
					reelAnimation.onfinish = resolve;
				});

				reelAnimation.play();

				await animationPromise;

				// Sets the current playback time to the end of the animation
				reelAnimation.finish();

				Array.from(reelContainer.children)
					.slice(0, reelContainer.children.length - 1)
					.forEach((element) => element.remove());

				this.havePreviousWinner = true;

				if (this.onSpinEnd) {
					this.onSpinEnd();
				}
				return true;
			});

		// Play the spin animation
	}
	/**
	 * Function for spinning the slot
	 * @returns {Promise<boolean>} Whether the spin is completed successfully
	 */
	// async spin() {
	// 	if (!this.nameList.length) {
	// 		console.error('Name List is empty. Cannot start spinning.');
	// 		return false;
	// 	}

	// 	if (this.onSpinStart) {
	// 		this.onSpinStart();
	// 	}

	// 	const { reelContainer, reelAnimation, shouldRemoveWinner } = this;
	// 	if (!reelContainer || !reelAnimation) {
	// 		return false;
	// 	}

	// 	// Shuffle names and create reel items
	// 	let randomNames = Slot.shuffleNames(this.nameList);

	// 	while (randomNames.length && randomNames.length < this.maxReelItems) {
	// 		randomNames = [...randomNames, ...randomNames];
	// 	}

	// 	randomNames = randomNames.slice(
	// 		0,
	// 		this.maxReelItems - Number(this.havePreviousWinner),
	// 	);

	// 	const fragment = document.createDocumentFragment();

	// 	randomNames.forEach((name) => {
	// 		const newReelItem = document.createElement('div');
	// 		newReelItem.innerHTML = name;
	// 		fragment.appendChild(newReelItem);
	// 	});

	// 	reelContainer.appendChild(fragment);

	// 	console.log('Displayed items: ', randomNames);
	// 	console.log('Winner: ', randomNames[randomNames.length - 1]);
	// 	console.log('Remaining: ', randomNames.length);
	// 	this.luckyNumber = randomNames[randomNames.length - 1];

	// 	// Remove winner form name list if necessary
	// 	if (shouldRemoveWinner) {
	// 		this.nameList.splice(
	// 			this.nameList.findIndex(
	// 				(name) => name === randomNames[randomNames.length - 1],
	// 			),
	// 			1,
	// 		);
	// 	}

	// 	// Play the spin animation
	// 	const animationPromise = new Promise((resolve) => {
	// 		reelAnimation.onfinish = resolve;
	// 	});

	// 	reelAnimation.play();

	// 	await animationPromise;

	// 	// Sets the current playback time to the end of the animation
	// 	reelAnimation.finish();

	// 	Array.from(reelContainer.children)
	// 		.slice(0, reelContainer.children.length - 1)
	// 		.forEach((element) => element.remove());

	// 	this.havePreviousWinner = true;

	// 	if (this.onSpinEnd) {
	// 		this.onSpinEnd();
	// 	}
	// 	return true;
	// }
}
