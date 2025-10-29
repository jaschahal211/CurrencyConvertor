const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdown) {
  for (let currencyCode in countryList) {
    const option = document.createElement("option");
    option.innerText = currencyCode;
    option.value = currencyCode;

    if (select.name === "from" && currencyCode === "USD") {
      option.selected = true;
    }
    if (select.name === "to" && currencyCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Update flag when currency is changed
function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  element.parentElement.querySelector("img").src = newSrc;
}

// Handle the button click
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const amountInput = document.querySelector(".amount input");
  let amountVal = parseFloat(amountInput.value);
  if (isNaN(amountVal) || amountVal < 1) {
    amountVal = 1;
    amountInput.value = "1";
  }

  const fromCurr = fromCurrency.value;
  const toCurr = toCurrency.value;

  const URL = `${BASE_URL}/${fromCurr}`;
  console.log("Fetching URL:", URL);

  try {
    const response = await fetch(URL);
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error("HTTP error: " + response.status);
    }

    const data = await response.json();
    console.log("Data object:", data);

    if (!data.rates || !data.rates[toCurr]) {
      throw new Error("Rate for target currency not found");
    }

    const rate = data.rates[toCurr];
    const finalVal = (amountVal * rate).toFixed(2);

    msg.innerText = `${amountVal} ${fromCurr} = ${finalVal} ${toCurr}`;
  } catch (err) {
    console.error("Error in fetching/conversion:", err);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  }
});
