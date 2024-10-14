const resetForm = document.getElementById('reset-form');
const resetPasswordUrl = 'http://localhost:5000/api/users/reset-password'; 

resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const newPassword = document.getElementById('reset-password').value;
    const confirmPassword = document.getElementById('confirm-reset-password').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        // Send password reset request to the backend
        const response = await fetch(resetPasswordUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword, confirmPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Password reset successful');
            window.location.href = 'login.html'; // Redirect to login page after reset
        } else {
            alert(data.message || 'Password reset failed');
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        alert('An error occurred during password reset.');
    }
});
