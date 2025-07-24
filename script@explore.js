async function fetchImages(query, max = 12) {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
    query
  )}&media_type=image`;
  const res = await fetch(url);
  const data = await res.json();
  return data.collection.items.slice(0, max);
}
function getFirstSentence(text) {
  if (!text) return "";
  const match = text.match(/.*?[.?!](\s|$)/);
  return match ? match[0].trim() : text.trim();
}

function renderGallery(images) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";
  if (!images.length) {
    gallery.innerHTML = "<p>No images found.</p>";
    return;
  }
  const seen = new Set();
  const uniqueImages = images.filter((item) => {
    const url = item.links[0].href;
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
  uniqueImages.forEach((item) => {
    const title = item.data[0].title || "Untitled";
    const imageUrl = item.links[0].href;
    const description = item.data[0].description || "No description available.";
    const nasaId = item.data[0].nasa_id;
    const nasaPage = `https://images.nasa.gov/details-${nasaId}`;
    const card = document.createElement("div");
    card.className = "image-card";
    card.innerHTML = `
          <img src="${imageUrl}" alt="${title}">
          <h3>${title}</h3>
          <p>${getFirstSentence(description)}</p>
          <button class="read-more-btn"
            data-title="${encodeURIComponent(title)}"
            data-description="${encodeURIComponent(description)}"
            data-nasapage="${nasaPage}">
            Read More
          </button>
        `;
    gallery.appendChild(card);
  });
  document.querySelectorAll(".read-more-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = decodeURIComponent(btn.getAttribute("data-title"));
      const description = decodeURIComponent(
        btn.getAttribute("data-description")
      );
      const nasaPage = btn.getAttribute("data-nasapage");
      openModal(title, description, nasaPage);
    });
  });
}
function openModal(title, description, link) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDescription").textContent = description;
  document.getElementById("modalLink").href = link;
  document.getElementById("modalOverlay").style.display = "flex";
}
function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}
document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});
async function loadImagesForRover(rover) {
  document.getElementById("gallery").innerHTML = "";
  document.getElementById("loading").style.display = "block";
  const mainQuery = rover === "all" ? "mars rover" : `${rover} rover`;
  const selfieQuery = rover === "all" ? "mars rover selfie" : `${rover} selfie`;
  const [mainImages, selfieImages] = await Promise.all([
    fetchImages(mainQuery, 8),
    fetchImages(selfieQuery, 4),
  ]);
  const combined = [...selfieImages, ...mainImages];
  document.getElementById("loading").style.display = "none";
  renderGallery(combined);
}
document.getElementById("searchBtn").addEventListener("click", () => {
  const rover = document.getElementById("roverSelect").value;
  loadImagesForRover(rover);
});
loadImagesForRover("all");
