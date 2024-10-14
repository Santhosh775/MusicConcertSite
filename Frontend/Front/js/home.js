document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage
    if (username) {
        document.getElementById('username-display').textContent = username;
    } else {
        document.getElementById('username-display').textContent = 'Guest'; // Default for not logged in
    }
});