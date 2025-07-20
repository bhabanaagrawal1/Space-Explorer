const container = document.getElementById("planets-info");
const searchbar = document.getElementById("search");

let allPlanets = [];

container.innerHTML = "<p class='loading'>Loading Planets....</p>";

const planetImages = {
  Mercury: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
  Venus: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
  Earth: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
  Mars: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
  Jupiter: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
  Saturn: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
  Uranus: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
  Neptune: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg"
};

fetch("https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true")
  .then(response => response.json())
  .then(data => {
    allPlanets = data.bodies;
    displayPlanets(allPlanets);
  })
  .catch(err => {
    container.innerHTML = "<p style='color:red; font-weight:bold;'>Error fetching planets info!</p>";
    console.error("Error fetching planets info:", err);
  });

function displayPlanets(planets) {
  container.innerHTML = "";

  planets.forEach(planet => {
    const div = document.createElement("div");
    div.classList.add("planets-card");

    const planetName = planet.englishName;
    const imgSrc = planetImages[planetName] || "https://via.placeholder.com/200";

    div.innerHTML = `
      <h2>${planetName}</h2>
      <img src="${imgSrc}" alt="${planetName}" class="planet-img">
      <button class="details-btn">View Details</button>
      <div class="planet-details">
        <p><strong>Mass:</strong> ${
          planet.mass
            ? planet.mass.massValue + " ×10^" + planet.mass.massExponent + " kg"
            : "N/A"
        }</p>
        <p><strong>Gravity:</strong> ${planet.gravity} m/s²</p>
        <p><strong>Mean Radius:</strong> ${planet.meanRadius} km</p>
        <p><strong>Distance from Sun:</strong> ${(planet.semimajorAxis / 1000000).toFixed(2)} million km</p>
        <p><strong>Moons:</strong> ${planet.moons ? planet.moons.length : 0}</p>
      </div>
    `;

    container.appendChild(div);
  });

  if (planets.length === 0) {
    container.innerHTML = "<p style='color:yellow;'>No planets found!</p>";
  }


  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const details = btn.nextElementSibling;
      details.classList.toggle("show");
      btn.textContent = details.classList.contains("show") ? "Hide Details" : "View Details";
    });
  });
}

searchbar.addEventListener("input", () => {
  const query = searchbar.value.toLowerCase();
  const filtered = allPlanets.filter(planet =>
    planet.englishName.toLowerCase().includes(query)
  );
  displayPlanets(filtered);
});