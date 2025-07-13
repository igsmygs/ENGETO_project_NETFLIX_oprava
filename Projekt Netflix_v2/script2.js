document.addEventListener("DOMContentLoaded", function () {
  const dropdown = document.getElementById("movieDropdown");
  const resultsDiv = document.getElementById("movieResults");

  if (!dropdown || !resultsDiv) {
    console.error("Nepodařilo se najít required elementy!");
    return;
  }

  dropdown.addEventListener("change", async function (e) {
    const value = e.target.value;

    if (!value) {
      resultsDiv.innerHTML = "";
      return;
    }

    resultsDiv.innerHTML = '<div class="loading">Načítám seriály...</div>';

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${value}`
      );

      if (!response.ok) {
        throw new Error(`Chyba serveru: ${response.status}`);
      }

      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error("Chyba:", error);
      resultsDiv.innerHTML = `<div class="error">Chyba: ${error.message}</div>`;
    }
  });

  function displayResults(data) {
    const resultsDiv = document.getElementById("movieResults");
    resultsDiv.innerHTML = "";

    if (!data || data.length === 0) {
      resultsDiv.innerHTML =
        '<div class="no-results">Žádné výsledky nenalezeny</div>';
      return;
    }

    data.slice(0, 8).forEach((item) => {
      const card = document.createElement("div");
      card.className = "movie-card";

      const img = document.createElement("img");
      img.src =
        item.show.image?.medium ||
        "https://via.placeholder.com/210x295/222/fff?text=No+image";
      img.alt = item.show.name;

      const title = document.createElement("h3");
      title.textContent = item.show.name;

      card.appendChild(img);
      card.appendChild(title);
      resultsDiv.appendChild(card);
    });
  }
});
