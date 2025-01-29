const form = document.getElementById('blogForm');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        const loader = document.getElementById('loader');
        const apiUrl = 'http://127.0.0.1:8000/api/submissions/';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            loader.style.display = 'block';
            e.submitter.disabled = true;

            const formData = {
                title: form.title.value,
                content: form.content.value,
                name: form.name.value,
                phone_number: form.phone_number.value
            };

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Submission failed');

                // Success handling
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                form.reset();
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Add confetti effect
                createConfetti();

            } catch (error) {
                console.error('Error:', error);
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                errorMessage.scrollIntoView({ behavior: 'smooth' });
            } finally {
                loader.style.display = 'none';
                e.submitter.disabled = false;
            }
        });

        // Phone number validation with animation
        const phoneInput = document.getElementById('phone_number');
        phoneInput.addEventListener('input', (e) => {
            const pattern = /^\+8801\d{9}$/;
            if (!pattern.test(e.target.value)) {
                e.target.classList.add('invalid');
                e.target.classList.remove('valid');
                e.target.setCustomValidity('Please enter a valid Bangladeshi phone number (+8801XXXXXXXXX)');
            } else {
                e.target.classList.add('valid');
                e.target.classList.remove('invalid');
                e.target.setCustomValidity('');
            }
        });

        // Simple confetti effect
        function createConfetti() {
            const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f'];
            for(let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.width = '8px';
                confetti.style.height = '8px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = '50%';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }
        }

        // Add fall animation for confetti
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);