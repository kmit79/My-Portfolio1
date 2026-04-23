// Fetch weather based on user location
function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // First, get city name using reverse geocoding
                    const geoResponse = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=he`
                    );
                    const geoData = await geoResponse.json();
                    const cityName = geoData.city || geoData.locality || geoData.principalSubdivision || 'מיקום לא ידוע';

                    // Using Open-Meteo API (free, no key required)
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
                    );
                    const data = await response.json();
                    const current = data.current;
                    const tempC = Math.round(current.temperature_2m);
                    const humidity = current.relative_humidity_2m;
                    const windSpeed = Math.round(current.wind_speed_10m);

                    // Get weather emoji based on weather code
                    const weatherCode = current.weather_code;
                    let weatherEmoji = '☀️';
                    if (weatherCode === 0) weatherEmoji = '☀️'; // Clear sky
                    else if (weatherCode === 1 || weatherCode === 2) weatherEmoji = '🌤️'; // Mainly clear, partly cloudy
                    else if (weatherCode === 3) weatherEmoji = '☁️'; // Overcast
                    else if (weatherCode >= 45 && weatherCode <= 48) weatherEmoji = '🌫️'; // Foggy
                    else if (weatherCode >= 51 && weatherCode <= 67) weatherEmoji = '🌧️'; // Drizzle/Rain
                    else if (weatherCode >= 71 && weatherCode <= 85) weatherEmoji = '❄️'; // Snow
                    else if (weatherCode >= 80 && weatherCode <= 82) weatherEmoji = '⛈️'; // Rain showers
                    else if (weatherCode >= 85 && weatherCode <= 86) weatherEmoji = '🌨️'; // Snow showers
                    else if (weatherCode === 95 || weatherCode === 96 || weatherCode === 99) weatherEmoji = '⛈️'; // Thunderstorm

                    document.getElementById('weather-display').innerHTML = `
                        <div class="weather-info">
                            <div class="weather-location">${cityName}</div>
                            <div class="weather-main">
                                <span class="weather-emoji">${weatherEmoji}</span>
                                <span class="weather-temp">${tempC}°C</span>
                            </div>
                            <span class="weather-details"> | לחות: ${humidity}% | רוח: ${windSpeed} km/h</span>
                        </div>
                    `;
                } catch (error) {
                    console.error('Error fetching weather:', error);
                    document.getElementById('weather-display').innerHTML =
                        '<span class="weather-error">לא ניתן לטעון מזג אוויר</span>';
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                document.getElementById('weather-display').innerHTML =
                    '<span class="weather-error">קבע מיקום כדי לראות מזג אוויר</span>';
            }
        );
    } else {
        document.getElementById('weather-display').innerHTML = 
            '<span class="weather-error">Geolocation לא נתמך</span>';
    }
}

// Handle contact form submission
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form
        if (!name || !email || !message) {
            formStatus.style.display = 'block';
            formStatus.className = 'form-status error';
            formStatus.textContent = 'אנא מלא את כל השדות.';
            return;
        }

        // Update UI to loading state
        submitBtn.disabled = true;
        formStatus.style.display = 'block';
        formStatus.className = 'form-status loading';
        formStatus.textContent = 'שולח הודעה...';

        try {
            // Handle form submission using Formspree
            const response = await fetch("https://formspree.io/f/xjgjpbnv", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });

            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'ההודעה נשלחה בהצלחה!';
                contactForm.reset();
                
                // Hide message after a few seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            } else {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'אופס! הייתה בעיה בשליחת ההודעה.';
            }
        } catch (error) {
            console.error('Formspree error:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = 'חלה שגיאה בחיבור לשרת. נסה שנית מאוחר יותר.';
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Load weather when DOM is ready (handle both cases: already loaded or not)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        getWeather();
        initNavigationHighlighting();
        initContactForm();
    });
} else {
    // DOM is already loaded
    getWeather();
    initNavigationHighlighting();
    initContactForm();
}

// Navigation highlighting functionality
function initNavigationHighlighting() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('header');

    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        const headerHeight = header.offsetHeight;
        const navHeight = document.querySelector('nav').offsetHeight;

        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Find the current section
        let currentSection = null;
        let maxVisibility = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
            const viewportTop = scrollY + navHeight;
            const viewportBottom = scrollY + window.innerHeight;

            // Calculate how much of the section is visible
            const visibleTop = Math.max(viewportTop, sectionTop);
            const visibleBottom = Math.min(viewportBottom, sectionTop + sectionHeight);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const visibilityRatio = visibleHeight / sectionHeight;

            // If this section has more visibility than previous ones, make it current
            if (visibilityRatio > maxVisibility && visibilityRatio > 0.3) { // At least 30% visible
                maxVisibility = visibilityRatio;
                currentSection = section;
            }
        });

        // If we're at the top of the page (before any section), highlight "about" or keep none active
        if (!currentSection && scrollY < headerHeight) {
            // Don't highlight anything when at the top
            return;
        }

        // Highlight the corresponding navigation link
        if (currentSection) {
            const currentLink = document.querySelector(`nav a[href="#${currentSection.id}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    function throttledHighlight() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                highlightNavigation();
                scrollTimeout = null;
            }, 50); // Update every 50ms
        }
    }

    // Initial highlight
    highlightNavigation();

    // Listen for scroll events
    window.addEventListener('scroll', throttledHighlight);

    // Also listen for resize events to handle viewport changes
    window.addEventListener('resize', highlightNavigation);

    // Handle click events on navigation links for smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20; // 20px offset for better positioning

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
