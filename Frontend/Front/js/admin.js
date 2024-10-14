document.getElementById('sidebarCollapse').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

// Fetch users from the server and display in the users section
async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:5000/api/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const users = await response.json();
    const usersTableBody = document.getElementById('usersTable').querySelector('tbody');

    // Clear the table body before appending new rows
    usersTableBody.innerHTML = '';

    // Populate the table with user data
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td><button class="delete-button" data-id="${user._id}">Delete</button></td>
      `;
      usersTableBody.appendChild(row);
    });

    // Add event listener to each delete button
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async function () {
        const userId = this.getAttribute('data-id');
        try {
          const deleteResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
          });
          if (deleteResponse.ok) {
            // Remove the row from the table if deletion is successful
            this.parentElement.parentElement.remove();
            console.log('User deleted successfully');
          } else {
            console.error('Failed to delete user:', await deleteResponse.json());
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Fetch and display users when the Users section is shown
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  // Function to hide all sections
  function hideAllSections() {
    sections.forEach(section => section.classList.remove("active"));
  }

  // Function to show the selected section
  function showSection(sectionId) {
    document.getElementById(sectionId).classList.add("active");

    // If the "Users" section is clicked, fetch the users
    if (sectionId === "users") {
      fetchUsers();
    }
  }

  // Add click event to each navigation link
  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default anchor behavior
      const sectionId = this.getAttribute("data-section");

      hideAllSections(); // Hide all sections
      showSection(sectionId); // Show the clicked section
    });
  });

  // Default to show the first section (dashboard) and hide others
  hideAllSections();
  showSection("dashboard");
});

// Event Form logic (same as before, handles event CRUD)
async function loadEvents() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const events = await response.json();

    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear previous events

    events.forEach(event => {
      const card = `
        <div class="event-card" id="${event._id}">
          <img src="${event.imageUrl}" alt="${event.name}" />
          <h3>${event.name}</h3>
          <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
          <p>Location: ${event.location}</p>
          <button onclick="editEvent('${event._id}')">Edit</button>
          <button onclick="deleteEvent('${event._id}')">Delete</button>
        </div>
      `;
      eventList.innerHTML += card;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}

// Fetch and display events on page load
window.onload = loadEvents;

let editingEventId = null; // To track the event being edited

document.getElementById('eventForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const eventImage = document.getElementById('eventImage').files[0];
  const eventName = document.getElementById('eventName').value.trim();
  const eventDate = document.getElementById('eventDate').value.trim();
  const eventLocation = document.getElementById('eventLocation').value.trim();

  if (!eventName || !eventDate || !eventLocation) {
    alert("Please fill in all fields.");
    return;
  }

  const formData = {
    name: eventName,
    date: eventDate,
    location: eventLocation,
  };

  // If image is provided, process the image
  if (eventImage) {
    const reader = new FileReader();
    reader.onloadend = async function () {
      formData.imageUrl = reader.result; // Add base64 image if provided
      await submitEventForm(formData);
    };
    reader.readAsDataURL(eventImage);
  } else {
    await submitEventForm(formData); // Proceed without image
  }
});

async function submitEventForm(formData) {
  try {
    const url = editingEventId
      ? `http://localhost:5000/api/events/${editingEventId}` // Update event
      : 'http://localhost:5000/api/events'; // Create new event

    const method = editingEventId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const event = await response.json();
      console.log('Event processed successfully', event);
      loadEvents(); // Reload the events
      editingEventId = null; // Reset editing state
      document.getElementById('eventForm').reset(); // Clear form
      document.getElementById('eventSubmitButton').textContent = 'Add Event'; // Reset button text
    } else {
      const error = await response.json();
      console.error('Error processing event:', error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function editEvent(id) {
  console.log('Editing event with ID:', id);

  try {
    const response = await fetch(`http://localhost:5000/api/events/${id}`);
    if (!response.ok) {
      throw new Error(`Event not found: ${response.status}`);
    }
    const event = await response.json();

    // Pre-fill the form with event details
    document.getElementById('eventName').value = event.name;
    document.getElementById('eventDate').value = new Date(event.date).toISOString().substring(0, 10);
    document.getElementById('eventLocation').value = event.location;

    editingEventId = event._id; // Track the event being edited
    document.getElementById('eventSubmitButton').textContent = 'Update Event'; // Update button text

  } catch (error) {
    console.error('Error fetching event:', error);
  }
}

async function deleteEvent(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Event deleted successfully');
        loadEvents(); // Reload events after deletion
      } else {
        const error = await response.json();
        console.error('Error deleting event:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
