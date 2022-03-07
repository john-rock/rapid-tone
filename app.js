const apiURL = "https://api.color.pizza/v1/";

// Get complementary color from hex value
function getComplimentaryColor(hex) {
  // strip # from hex value
  hex = hex.replace("#", "");

  // convert hex value to RGB
  r = parseInt(hex.substring(0, 2), 16);
  g = parseInt(hex.substring(2, 4), 16);
  b = parseInt(hex.substring(4, 6), 16);

  // get the highest and lowest RGB values
  r = Math.min(255, r + 128);
  g = Math.min(255, g + 128);
  b = Math.min(255, b + 128);

  // convert RGB values to HEX
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  // pad with 0s
  if (r.length < 2) {
    r = "0" + r;
  }
  if (g.length < 2) {
    g = "0" + g;
  }
  if (b.length < 2) {
    b = "0" + b;
  }

  // return HEX value
  return "#" + r + g + b;
}

async function getColors() {
  const response = await fetch(apiURL);
  const data = await response.json();

  // create variable that is equal to anything between 0 and the length of the colors array
  const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const randomIndex = random(0, data.colors.length);

  // Color config
  const color = data.colors[randomIndex];
  const colorHex = color.hex;
  const colorR = color.rgb.r;
  const colorG = color.rgb.g;
  const colorB = color.rgb.b;
  const colorComplement = getComplimentaryColor(colorHex);
  const colorName = color.name;

  // DOM elements
  const body = document.body;
  const colorNameElement = document.querySelector(".color-name");
  const colorHexElement = document.querySelector(".color-hex");
  const colorRgbElement = document.querySelector(".color-rgb");
  const footer = document.querySelector("footer");

  // Generate an array of complimentary
  const colors = chroma
    .scale([colorHex, colorComplement])
    .mode("lch")
    .colors(6);

  // Remove first color form array becuase it is the same as the original color
  colors.shift();

  // Build html for the comp colors
  const compColors = colors
    .map((color) => {
      return `
      <div class="color-box" style="background-color: ${color}"></div>
    `;
    })
    .join("");

  // Insert complementary color boxes into DOM
  document
    .getElementById("color-comp")
    .insertAdjacentHTML("afterbegin", compColors);

  // Check to see if the background is too light to read text
  // Adjust text so its readable
  // TODO: Improve this logic
  if (color.luminance >= 130) {
    colorNameElement.style.filter = "invert(70%)";
    colorHexElement.style.filter = "invert(70%)";
    colorRgbElement.style.filter = "invert(70%)";
    footer.style.filter = "invert(70%)";
  } else {
    document.body.style.color = colorComplement;
  }

  body.style.backgroundColor = colorHex;
  body.style.color = colorComplement;
  colorNameElement.textContent = colorName;
  colorHexElement.textContent = colorHex;
  colorRgbElement.textContent = `rgb(${colorR}, ${colorG}, ${colorB})`;
  document.querySelector("footer").style.opacity = 1;
}

getColors();
