// Získání elementů
const registerBtn = document.getElementById("registerBtn");
const modal = document.getElementById("registrationModal");
const password1 = document.getElementById("password1");
const password2 = document.getElementById("password2");

// Otevření modálního okna při kliknutí na tlačítko Registrace
registerBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

// Zavření modálního okna při kliknutí mimo něj
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

// Validace shody hesel
[password1, password2].forEach((input) => {
  input.addEventListener("input", () => {
    if (password1.value && password2.value) {
      if (password1.value !== password2.value) {
        password1.classList.add("password-mismatch");
        password2.classList.add("password-mismatch");
        password1.classList.remove("password-match");
        password2.classList.remove("password-match");
      } else {
        password1.classList.remove("password-mismatch");
        password2.classList.remove("password-mismatch");
        password1.classList.add("password-match");
        password2.classList.add("password-match");
      }
    } else {
      password1.classList.remove("password-mismatch", "password-match");
      password2.classList.remove("password-mismatch", "password-match");
    }
  });
});

// Mizející placeholder při focusu
document.querySelectorAll("input").forEach((input) => {
  const placeholder = input.placeholder;
  input.addEventListener("focus", () => {
    input.placeholder = "";
  });
  input.addEventListener("blur", () => {
    if (!input.value) {
      input.placeholder = placeholder;
    }
  });
});

// Mizející placeholder pro emailový formulář
const emailInput = document.querySelector(".email-form input");
if (emailInput) {
  const emailPlaceholder = emailInput.placeholder;

  emailInput.addEventListener("focus", () => {
    emailInput.placeholder = "";
  });

  emailInput.addEventListener("blur", () => {
    if (!emailInput.value) {
      emailInput.placeholder = emailPlaceholder;
    }
  });
}

// Zabránění odeslání formuláře
const emailForm = document.querySelector(".email-form");
if (emailForm) {
  emailForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });
}

// Tlačítko na novou stránku
const findMoreBtn = document.querySelector(".find-more-btn");
if (findMoreBtn) {
  findMoreBtn.addEventListener("click", () => {
    window.location.href = "movies.html";
  });
  findMoreBtn.style.cursor = "pointer";
  findMoreBtn.style.opacity = "1";
}

// Funkce pro šipku nahoru
function setupBackToTop() {
  const backToTop = document.getElementById("backToTop");
  const movieSection = document.querySelector(".movie-section");

  if (!backToTop || !movieSection) return;

  window.addEventListener("scroll", () => {
    const movieSectionPosition = movieSection.getBoundingClientRect().top;
    const scrollPosition = window.scrollY;

    // Zobrazí šipku, když uživatel scrolluje pod sekci filmů
    if (scrollPosition > movieSectionPosition + window.innerHeight) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  // Kliknutí na šipku
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Spustit při načtení stránky
document.addEventListener("DOMContentLoaded", setupBackToTop);

// Přidejte tento obsah do nového souboru script.js
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

    data.slice(0, 5).forEach((item) => {
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
