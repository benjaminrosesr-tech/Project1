document.addEventListener("DOMContentLoaded", () => {
  // --- COMPONENT LOADER ---
  const loadComponent = (url, elementId, callback) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = data;
        }
        if (callback) {
          callback();
        }
      })
      .catch((error) => console.error("Error loading component:", error));
  };

  // --- NAVBAR LOGIC ---
  const onNavbarLoad = () => {
    // Set active navigation link
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("#mainNav .nav-link");
    navLinks.forEach((link) => {
      if (link.getAttribute("href").includes(currentPage)) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    // Re-initialize theme switcher after it's loaded
    initializeThemeSwitcher();
  };

  // --- THEME SWITCHER LOGIC ---
  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) return storedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    const effectiveTheme =
      theme === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    document.documentElement.setAttribute("data-bs-theme", effectiveTheme);

    // Update active icons
    const lightIcon = document.getElementById("light-theme-icon");
    const darkIcon = document.getElementById("dark-theme-icon");
    if (lightIcon && darkIcon) {
      lightIcon.classList.toggle("d-none", effectiveTheme === "dark");
      darkIcon.classList.toggle("d-none", effectiveTheme !== "dark");
    }
  };

  const initializeThemeSwitcher = () => {
    setTheme(getPreferredTheme());

    document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const theme = toggle.getAttribute("data-bs-theme-value");
        setStoredTheme(theme);
        setTheme(theme);
      });
    });
  };

  // --- INITIALIZE EVERYTHING ---
  // Load Navbar, then run its setup logic
  loadComponent("/components/navbar.html", "navbar-placeholder", onNavbarLoad);

  // Load Footer
  loadComponent("/components/footer.html", "footer-placeholder");

  // Initial theme setup to prevent FOUC (Flash of Unstyled Content)
  // This is a simplified version of the inline script.
  // The full logic runs again in initializeThemeSwitcher to attach event listeners.
  (() => {
    const theme = getPreferredTheme();
    document.documentElement.setAttribute(
      "data-bs-theme",
      theme === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme
    );
  })();
});
