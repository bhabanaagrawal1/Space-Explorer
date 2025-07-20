function showsidebar(event) {
  event.preventDefault();
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'flex';
}

function hidesidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.style.display = 'none';
}



const alertsbox = document.getElementById("alerts-box");

async function weather() {
  const response = await fetch("https://api.nasa.gov/DONKI/notifications?startDate=2024-01-01&endDate=2024-01-20&type=all&api_key=aD5hlJOQHLxHyXEULzu0kJWcXARHrbPvU2tAz9oh");
  const data = await response.json();

  if (data.length === 0) {
    alertsbox.innerHTML = "<p>No recent alerts found.</p>";
    return;
  }

  data.forEach((event) => {
    const box = document.createElement("div");
    box.className = "alertcard";

    box.innerHTML = `
      <h3>${event.messageType}</h3>
      <p><strong>Date:</strong> ${event.messageIssueTime?.split("T")[0]}</p>
      ${event.messageURL ? `<a href="${event.messageURL}" target="_blank">View Full Report</a>` : "<p>No link available</p>"}
    `;

    alertsbox.appendChild(box);
  });
}

weather();
  

 