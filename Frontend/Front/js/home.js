document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage
    const usernameDisplay = document.getElementById('username-display');

    if (usernameDisplay) { // Ensure the element exists
        if (username) {
            usernameDisplay.textContent = username;
        } else {
            usernameDisplay.textContent = 'Guest'; // Default for not logged in
        }
    } else {
        console.error('Element with id="username-display" not found.');
    }
});

async function loadEventsForHomePage() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const events = await response.json();

    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear previous event cards

    events.forEach(event => {
      const eventName = event.name.replace(/'/g, "\\'");
      const eventLocation = event.location.replace(/'/g, "\\'");
      const eventDate = event.date;
    
      const card = `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card">
            <img src="${event.imageUrl}" alt="${eventName}" class="card-img-top">
            <div class="card-body">
              <h5 class="card-title">${eventName}</h5>
              <p class="card-text">Date: ${new Date(eventDate).toLocaleDateString()}</p>
              <p class="card-text">Location: ${eventLocation}</p>
              <button class="btn" onclick="buyTickets('${event._id}', '${eventName}', '${eventLocation}', '${eventDate}')">Buy Tickets</button>
            </div>
          </div>
        </div>
      `;
      eventList.innerHTML += card;
    });
    

  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

function buyTickets(id, name, location, date) {
    // Store event details in localStorage
    localStorage.setItem('selectedEvent', JSON.stringify({ id, name, location, date }));
  
    // Redirect to BuyTickets.html
    window.location.href = 'BuyTickets.html';
}

// Fetch and display events when the page loads
document.addEventListener('DOMContentLoaded', loadEventsForHomePage);

document.querySelector('.extra_button a').addEventListener('click', function(e) {
  e.preventDefault(); // Prevent default anchor behavior
  const targetId = this.getAttribute('href'); // Get the target section ID
  const targetElement = document.querySelector(targetId); // Select target element

  if (targetElement) {
      // Smooth scroll to the target element
      targetElement.scrollIntoView({ 
          behavior: 'smooth' 
      });
  }
});