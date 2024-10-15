document.getElementById('sidebarCollapse').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:5000/api/users');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const users = await response.json();
    const usersTableBody = document.getElementById('usersTable').querySelector('tbody');

    usersTableBody.innerHTML = '';

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td><button class="delete-button" data-id="${user._id}">Delete</button></td>
      `;
      usersTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', async function () {
        const userId = this.getAttribute('data-id');
        try {
          const deleteResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
          });
          if (deleteResponse.ok) {
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

document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  function hideAllSections() {
    sections.forEach(section => section.classList.remove("active"));
  }

  function showSection(sectionId) {
    document.getElementById(sectionId).classList.add("active");

    if (sectionId === "users") {
      fetchUsers();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const sectionId = this.getAttribute("data-section");

      hideAllSections(); 
      showSection(sectionId); 
    });
  });

 
  hideAllSections();
  showSection("dashboard");
});

async function loadEvents() {
  try {
    const response = await fetch('http://localhost:5000/api/events');
    const events = await response.json();

    const eventsTableBody = document.getElementById('eventsTable').querySelector('tbody');
    eventsTableBody.innerHTML = ''; 

    events.forEach(event => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${event.name}</td>
        <td>${new Date(event.date).toLocaleDateString()}</td>
        <td>${event.location}</td>
        <td>
          <button class="edit-button" onclick="editEvent('${event._id}')">Edit</button>
          <button class="delete-button" onclick="deleteEvent('${event._id}')">Delete</button>
        </td>
      `;
      eventsTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching events:', error);
  }
}


window.onload = loadEvents;

let editingEventId = null; 

document.getElementById('showEventFormButton').addEventListener('click', function () {
  const eventForm = document.getElementById('eventForm');
  
  if (eventForm.style.display === 'none' || eventForm.style.display === '') {
    eventForm.style.display = 'block';  // Show the form
  } else {
    eventForm.style.display = 'none';  // Hide the form
  }
});


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

  if (eventImage) {
    const reader = new FileReader();
    reader.onloadend = async function () {
      formData.imageUrl = reader.result; 
      await submitEventForm(formData);
    };
    reader.readAsDataURL(eventImage);
  } else {
    await submitEventForm(formData); 
  }
});

async function submitEventForm(formData) {
  try {
    const url = editingEventId
      ? `http://localhost:5000/api/events/${editingEventId}` 
      : 'http://localhost:5000/api/events'; 

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
      loadEvents(); 
      editingEventId = null;
      document.getElementById('eventForm').reset();
      document.getElementById('eventSubmitButton').textContent = 'Add Event'; 
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

    document.getElementById('eventName').value = event.name;
    document.getElementById('eventDate').value = new Date(event.date).toISOString().substring(0, 10);
    document.getElementById('eventLocation').value = event.location;

    // Show the event form when editing
    const eventForm = document.getElementById('eventForm');
    eventForm.style.display = 'block'; // Show the form

    editingEventId = event._id;
    document.getElementById('eventSubmitButton').textContent = 'Update Event'; 

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
        loadEvents(); 
      } else {
        const error = await response.json();
        console.error('Error deleting event:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

async function loadPurchaseDetails() {
  try {
    // Fetch purchases from the server
    const response = await fetch('http://localhost:5000/api/tickets/purchases');
    if (!response.ok) {
      throw new Error('Failed to fetch purchase data');
    }
    const purchases = await response.json();

    // Group purchases by eventId
    const purchasesByEvent = purchases.reduce((acc, purchase) => {
      if (!acc[purchase.eventId]) {
        acc[purchase.eventId] = [];
      }
      acc[purchase.eventId].push(purchase);
      return acc;
    }, {});

    const ticketTablesContainer = document.getElementById('ticketTables');
    ticketTablesContainer.innerHTML = ''; // Clear any existing content

    // For each event, create a separate table
    for (const eventId in purchasesByEvent) {
      const eventPurchases = purchasesByEvent[eventId];
      if (eventPurchases.length > 0) {
        const eventName = eventPurchases[0].eventName; // All purchases for the same event will have the same eventName

        // Create a new table for the event
        const table = document.createElement('table');
        table.classList.add('ticket-table');

        // Create the table header
        const tableHeader = `
          <thead>
            <tr>
              <th colspan="10">${eventName}</th>
            </tr>
            <tr>
              <th>Purchase Date</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tickets Purchased</th>
              <th>Amount</th>
            </tr>
          </thead>
        `;

        // Create the table body
        const tableBody = document.createElement('tbody');
        eventPurchases.forEach(purchase => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${new Date(purchase.purchaseDate).toLocaleDateString()}</td>
            <td>${purchase.userDetails.name}</td>
            <td>${purchase.userDetails.email}</td>
            <td>${purchase.userDetails.phone}</td>
            <td>${purchase.numTickets}</td>
            <td>${purchase.amount}</td>
          `;
          tableBody.appendChild(row);
        });

        // Append header and body to the table
        table.innerHTML = tableHeader;
        table.appendChild(tableBody);

        // Append the table to the ticketTablesContainer
        ticketTablesContainer.appendChild(table);
      }
    }
  } catch (error) {
    console.error('Error loading purchase details:', error);
  }
}

// Load purchases when the dashboard is displayed
document.addEventListener('DOMContentLoaded', function () {
  loadPurchaseDetails();
});
