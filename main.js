let form = document.querySelector("form");
let country = document.querySelector("#country");
let date = document.querySelector("#date");
let card = document.querySelector("#holiday-card");
let h1 = document.querySelector(".holiday-name");
let h2 = document.querySelector(".holiday-date");
let h3 = document.querySelector(".holiday-weekday");
let p = document.querySelector(".holiday-location");
let desc = document.querySelector(".holiday-description");
let icon = document.querySelector("#holiday-icon");
let loading = document.querySelector("#loading");
let feedback = document.querySelector("#form-feedback");

let API_KEY = "f5aa2711ebc94e67861a208a148b9e35";
let UNSPLASH_ACCESS_KEY = "YOUR_UNSPLASH_ACCESS_KEY";

const fetchUnsplashImage = async (holidayName) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${holidayName}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
  }
  return "default-icon.png"; // Fallback image
};

const fetchHoliday = async (e) => {
  e.preventDefault();
  if (country.value === "" || date.value === "") {
    feedback.classList.remove("hidden");
    return;
  }
  feedback.classList.add("hidden");
  loading.classList.remove("hidden");
  card.classList.add("hidden");
  card.classList.remove("visible");

  try {
    const [year, month, day] = date.value.split("-");
    const countryName = country.value;
    const response = await fetch(
      `https://holidays.abstractapi.com/v1/?api_key=${API_KEY}&country=${countryName}&year=${year}&month=${month}&day=${day}`
    );

    const data = await response.json();
    loading.classList.add("hidden");
    card.classList.remove("hidden");
    card.classList.add("visible");
    reset();

    if (data.length === 0) {
      h1.innerText = "No Holiday!!";
    } else {
      const holiday = data[0];
      h1.innerText = holiday.name;
      h2.innerText = holiday.date;
      h3.innerText = holiday.week_day;
      p.innerText = holiday.location;
      desc.innerText = holiday.description || "No description available.";

      const iconUrl = await fetchUnsplashImage(holiday.name);
      icon.src = iconUrl;
      icon.alt = holiday.name;
    }
  } catch (error) {
    loading.classList.add("hidden");
    window.alert("Something Went Wrong!!");
  }
};

const reset = () => {
  h1.innerText = "";
  h2.innerText = "";
  h3.innerText = "";
  p.innerText = "";
  desc.innerText = "";
  icon.src = "";
  icon.alt = "";
};

form.addEventListener("submit", fetchHoliday);
