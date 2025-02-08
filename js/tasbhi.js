let count = 0;
        const counterDisplay = document.getElementById('counter-display');
        const incrementBtn = document.getElementById('increment-btn');
        const decrementBtn = document.getElementById('decrement-btn');
        const resetBtn = document.getElementById('reset-btn');
        const stoneContainer = document.getElementById('stone-container');
        const targetCountInput = document.getElementById('target-count');
        const congratsMessage = document.getElementById('congrats-message');

        // Sound effects
        const incrementSound = new Audio('https://myislam.sfo3.digitaloceanspaces.com/assets/2024/11/BeadsDrop.mp3');
        const decrementSound = new Audio('https://myislam.sfo3.digitaloceanspaces.com/assets/2024/11/BeadsDrop.mp3');

        // Function to create a stone element
        function createStone() {
            const stone = document.createElement('div');
            stone.classList.add('stone');
            return stone;
        }

        // Function to update the stone display
        function updateStoneDisplay() {
            stoneContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const stone = createStone();
                stoneContainer.appendChild(stone);
            }
            if (stoneContainer.children.length > 0) {
                stoneContainer.lastElementChild.classList.add('animate-increment');
                stoneContainer.lastElementChild.addEventListener('animationend', () => {
                    stoneContainer.lastElementChild.classList.remove('animate-increment');
                });
            }
        }

        function checkTarget() {
            const target = parseInt(targetCountInput.value);
            if (!isNaN(target) && count >= target) {
                congratsMessage.classList.add('show');
            } else {
                congratsMessage.classList.remove('show');
            }
        }


        incrementBtn.addEventListener('click', () => {
            count++;
            counterDisplay.textContent = count;
            updateStoneDisplay();
            incrementSound.play();
            checkTarget(); // Check target on increment
        });

        decrementBtn.addEventListener('click', () => {
            if (count > 0) {
                count--;
                counterDisplay.textContent = count;
                if (stoneContainer.children.length > 0) {
                    stoneContainer.removeChild(stoneContainer.lastElementChild);
                }
                decrementSound.play();
                checkTarget(); // Check target on decrement
            }
        });

        resetBtn.addEventListener('click', () => {
            count = 0;
            counterDisplay.textContent = count;
            updateStoneDisplay();
            congratsMessage.classList.remove('show'); // Hide congrats on reset
        });

        updateStoneDisplay();