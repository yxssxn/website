const asciiArt = `
 ___.__.___  ___  ______  _________  ___  ____      ___  ___ ___.__.________
<   |  |\\  \\/  / /  ___/ /  ___/\\  \\/  / /    \\     \\  \\/  /<   |  |\\___   /
 \\___  | >    <  \\___ \\  \\___ \\  >    < |   |  \\     >    <  \\___  | /    /
 / ____|/__/\\_ \\/____  >/____  >/__/\\_ \\|___|  / /\\ /__/\\_ \\ / ____|/_____ \\
 \\/           \\/     \\/      \\/       \\/     \\/  \\/       \\/ \\/           \\/`;

let asciiArtIndex = 0;
const typingSpeed = 5;
let terminalPrompt = "> Loading yxssxn.xyz ";
let promptIndex = 0;
let loadingDots = 0;
let spinnerChars = ['|', '/', '-', '\\'];
let spinnerIndex = 0;

function typeTerminalPrompt() {
  if (promptIndex < terminalPrompt.length) {
    document.getElementById("loading-text").textContent += terminalPrompt.charAt(promptIndex);
    promptIndex++;
    setTimeout(typeTerminalPrompt, 80);
  } else {
    // Add loading dots animation
    showLoadingDots();
  }
}

function showLoadingDots() {
  if (loadingDots < 8) {
    const loadingElement = document.getElementById("loading-text");
    // Show spinner with dots
    const currentSpinner = spinnerChars[spinnerIndex % spinnerChars.length];
    const dots = '.'.repeat(Math.floor(loadingDots / 2));
    loadingElement.textContent = terminalPrompt + currentSpinner + " " + dots;
    
    spinnerIndex++;
    loadingDots++;
    setTimeout(showLoadingDots, 200);
  } else {
    // Final loading message
    document.getElementById("loading-text").textContent = terminalPrompt + "█ [OK]";
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
      document.querySelector(".container").style.opacity = "1";
      asciiArtIndex = 0;
      typeAsciiArt();
    }, 500);
  }
}

function typeAsciiArt() {
  if (asciiArtIndex < asciiArt.length) {
    document.getElementById("ascii-art").textContent += asciiArt.charAt(asciiArtIndex);
    asciiArtIndex++;
    setTimeout(typeAsciiArt, typingSpeed);
  } else {
    // Add blinking cursor after typing is complete
    const cursor = document.createElement('span');
    cursor.id = 'terminal-cursor';
    cursor.textContent = '_';
    cursor.style.animation = 'blink 1s infinite';
    document.getElementById("ascii-art").appendChild(cursor);
    
    // Add click handler to ASCII art for ESC functionality
    document.getElementById("ascii-art").addEventListener('click', function() {
      hideAllSectionsAndDeselect();
    });
  }
}

// Arrow key navigation
let currentFocusIndex = -1;
let focusableElements = [];

function updateFocusableElements() {
  focusableElements = Array.from(document.querySelectorAll('a:not([style*="display: none"]), a[href]')).filter(el => {
    return el.offsetParent !== null; // Only visible elements
  });
}

function focusElement(index) {
  if (index >= 0 && index < focusableElements.length) {
    focusableElements[index].focus();
    currentFocusIndex = index;
  }
}

function navigateUp() {
  if (currentFocusIndex > 0) {
    focusElement(currentFocusIndex - 1);
  }
}

function navigateDown() {
  if (currentFocusIndex < focusableElements.length - 1) {
    focusElement(currentFocusIndex + 1);
  } else if (currentFocusIndex === -1 && focusableElements.length > 0) {
    focusElement(0);
  }
}

function navigateLeft() {
  // Navigate to previous element in the same row (nav items)
  const currentElement = focusableElements[currentFocusIndex];
  if (currentElement && currentElement.closest('.nav__link--list')) {
    const navLinks = Array.from(document.querySelectorAll('.nav__link a'));
    const currentNavIndex = navLinks.indexOf(currentElement);
    if (currentNavIndex > 0) {
      focusElement(focusableElements.indexOf(navLinks[currentNavIndex - 1]));
    }
  }
}

function navigateRight() {
  // Navigate to next element in the same row (nav items)
  const currentElement = focusableElements[currentFocusIndex];
  if (currentElement && currentElement.closest('.nav__link--list')) {
    const navLinks = Array.from(document.querySelectorAll('.nav__link a'));
    const currentNavIndex = navLinks.indexOf(currentElement);
    if (currentNavIndex >= 0 && currentNavIndex < navLinks.length - 1) {
      focusElement(focusableElements.indexOf(navLinks[currentNavIndex + 1]));
    }
  }
}

// Keyboard shortcuts and navigation
document.addEventListener("keydown", function(event) {
  // Only trigger if not typing in an input field
  if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
    
    // Update focusable elements on each keypress
    updateFocusableElements();
    
    // Update current focus index
    const activeElement = document.activeElement;
    if (activeElement && focusableElements.includes(activeElement)) {
      currentFocusIndex = focusableElements.indexOf(activeElement);
    }
    
    switch(event.key) {
      case 'ArrowUp':
        event.preventDefault();
        navigateUp();
        break;
      case 'ArrowDown':
        event.preventDefault();
        navigateDown();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        navigateLeft();
        break;
      case 'ArrowRight':
        event.preventDefault();
        navigateRight();
        break;
      case 'Enter':
        event.preventDefault();
        if (document.activeElement && document.activeElement.tagName === 'A') {
          document.activeElement.click();
        }
        break;
      case 'c':
      case 'C':
        event.preventDefault();
        toggleSocials(); // Now toggles Contact
        updateFocusableElements();
        break;
      case 'b':
      case 'B':
        event.preventDefault();
        toggleBookMarks(); // Now toggles Bookmarks
        updateFocusableElements();
        break;
      case 'd':
      case 'D':
        event.preventDefault();
        // Toggle to Dark mode
        const body = document.getElementsByTagName("body")[0];
        if (!body.classList.contains("night")) {
          setUserThemePreference('dark');
          applyTheme('dark');
        }
        break;
      case 'l':
      case 'L':
        event.preventDefault();
        // Toggle to Lite mode
        const bodyLite = document.getElementsByTagName("body")[0];
        if (bodyLite.classList.contains("night")) {
          setUserThemePreference('light');
          applyTheme('light');
        }
        break;
      case 'a':
      case 'A':
        event.preventDefault();
        toggleAbout();
        updateFocusableElements();
        break;
      case 'k':
      case 'K':
        event.preventDefault();
        showKeyboardShortcuts();
        break;
      case 'Escape':
        event.preventDefault();
        hideAllSectionsAndDeselect();
        break;
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  typeTerminalPrompt();
  fetchLinks();
  setTheme();
  change();
  
  // Remove focus from theme button after clicking, but only if clicked by mouse
  const themeBtn = document.getElementById("night__btn");
  let keyboardActivated = false;
  
  // Track if theme button was activated by keyboard
  themeBtn.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      keyboardActivated = true;
    }
  });
  
  themeBtn.addEventListener('click', function() {
    if (!keyboardActivated) {
      // Only blur if activated by mouse click
      setTimeout(() => {
        this.blur();
      }, 100);
    }
    keyboardActivated = false; // Reset flag
  });
  
  // Add blur to navigation buttons
  const aboutBtn = document.getElementById("about");
  const linksBtn = document.getElementById("links");
  const bookmarkBtn = document.getElementById("bookmark");
  
  [aboutBtn, linksBtn, bookmarkBtn].forEach(btn => {
    btn.addEventListener('click', function() {
      setTimeout(() => {
        this.blur();
      }, 100);
    });
  });
});

function toggleAbout() {
  var link = document.getElementById("about");
  link.classList.add("a__active");
  document.getElementById("about-section").style.display = "block";
  document.getElementById("socials").style.display = "none";
  document.getElementById("bookmarks").style.display = "none";
  document.getElementById("shortcuts").style.display = "none";
  var link2 = document.getElementById("links");
  var link3 = document.getElementById("bookmark");
  link2.classList.remove("a__active");
  link3.classList.remove("a__active");
}

function toggleSocials() {
  var link = document.getElementById("links");
  link.classList.add("a__active");
  document.getElementById("socials").style.display = "flex";
  document.getElementById("about-section").style.display = "none";
  document.getElementById("bookmarks").style.display = "none";
  document.getElementById("shortcuts").style.display = "none";
  var link2 = document.getElementById("bookmark");
  var link3 = document.getElementById("about");
  link2.classList.remove("a__active");
  link3.classList.remove("a__active");
}

function toggleBookMarks() {
  var link = document.getElementById("bookmark");
  link.classList.add("a__active");
  document.getElementById("bookmarks").style.display = "flex";
  document.getElementById("about-section").style.display = "none";
  document.getElementById("socials").style.display = "none";
  document.getElementById("shortcuts").style.display = "none";
  var link2 = document.getElementById("links");
  var link3 = document.getElementById("about");
  link2.classList.remove("a__active");
  link3.classList.remove("a__active");
}

function showKeyboardShortcuts() {
  document.getElementById("shortcuts").style.display = "block";
  document.getElementById("about-section").style.display = "none";
  document.getElementById("socials").style.display = "none";
  document.getElementById("bookmarks").style.display = "none";
  // Remove all active nav states since this isn't a nav item
  document.getElementById("about").classList.remove("a__active");
  document.getElementById("links").classList.remove("a__active");
  document.getElementById("bookmark").classList.remove("a__active");
}

function toggleNight() {
  var element = document.body;
  element.classList.toggle("night");
}

// Theme management with AM/PM auto-detection
function getAutoTheme() {
  const now = new Date();
  const hour = now.getHours();
  // AM hours (0-11) = Light theme, PM hours (12-23) = Dark theme  
  return hour < 12 ? 'light' : 'dark';
}

function getUserThemePreference() {
  return localStorage.getItem('userThemePreference');
}

function setUserThemePreference(theme) {
  localStorage.setItem('userThemePreference', theme);
}

function applyTheme(theme) {
  const body = document.getElementsByTagName("body")[0];
  if (theme === 'dark') {
    if (!body.classList.contains("night")) {
      body.classList.add("night");
    }
  } else {
    if (body.classList.contains("night")) {
      body.classList.remove("night");
    }
  }
  updateThemeButton();
}

function setTheme() {
  const userPreference = getUserThemePreference();
  if (userPreference) {
    // User has manually chosen a theme, use that
    applyTheme(userPreference);
  } else {
    // No user preference, use auto AM/PM detection
    const autoTheme = getAutoTheme();
    applyTheme(autoTheme);
  }
}

function updateThemeButton() {
  const body = document.getElementsByTagName("body")[0];
  const button = document.getElementById("night__btn");
  if (body.classList.contains("night")) {
    button.innerHTML = '<span class="toggle-indicator">●</span> Lite';
  } else {
    button.innerHTML = '<span class="toggle-indicator">●</span> Dark';
  }
}

function mode() {
  const body = document.getElementsByTagName("body")[0];
  const newTheme = body.classList.contains("night") ? 'light' : 'dark';
  
  // User is manually changing theme, save their preference
  setUserThemePreference(newTheme);
  applyTheme(newTheme);
}

function change() {
  updateThemeButton();
}



// Hide all sections and deselect menu items
function hideAllSectionsAndDeselect() {
  // Hide all sections
  document.getElementById("about-section").style.display = "none";
  document.getElementById("socials").style.display = "none";
  document.getElementById("bookmarks").style.display = "none";
  document.getElementById("shortcuts").style.display = "none";
  // Remove active states
  document.getElementById("about").classList.remove("a__active");
  document.getElementById("links").classList.remove("a__active");
  document.getElementById("bookmark").classList.remove("a__active");
  updateFocusableElements();
  currentFocusIndex = -1;
}



function fetchLinks() {
  fetch("links.json")
    .then((response) => response.json())
    .then((data) => {
      const socials = data.socials;
      const bookmarks = data.bookmarks;

      const socialsTable = document.getElementById("socialsTable");
      const bookmarksTable = document.getElementById("bookmarksTable");

      socials.forEach((item) => {
        const row = document.createElement("div");
        row.classList.add("table-row");

        const nameCell = document.createElement("div");
        nameCell.classList.add("table-cell");
        const nameLink = document.createElement("a");
        nameLink.classList.add("table__links");
        nameLink.href = item.url;
        nameLink.target = "_blank";
        if (item.name.includes("✉")) {
          nameLink.innerHTML = '<span class="email-symbol">✉</span> Email';
        } else {
          nameLink.textContent = item.name;
        }
        
        
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        socialsTable.appendChild(row);
      });

      bookmarks.forEach((item) => {
        const row = document.createElement("div");
        row.classList.add("table-row");

        const nameCell = document.createElement("div");
        nameCell.classList.add("table-cell");
        const nameLink = document.createElement("a");
        nameLink.classList.add("table__links");
        nameLink.href = item.url;
        nameLink.target = "_blank";
        nameLink.textContent = item.name;
        
        
        nameCell.appendChild(nameLink);
        row.appendChild(nameCell);

        bookmarksTable.appendChild(row);
      });
    });
}



