const apiURL = 'https://api.color.pizza/v1/';

// Get complementary color from hex value
function getComplimentaryColor(hex) {
  // strip # from hex value
  hex = hex.replace('#', '');

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
    r = '0' + r;
  }
  if (g.length < 2) {
    g = '0' + g;
  }
  if (b.length < 2) {
    b = '0' + b;
  }

  // return HEX value
  return '#' + r + g + b;
}

async function getColors() {
  const response = await fetch(apiURL);
  const data = await response.json();

  // create variable that is equal to anything between 0 and the length of the colors array
  const randomIndex = Math.floor(Math.random() * data.colors.length);

  const color = data.colors[randomIndex];
  const colorHex = color.hex;
  const colorR = color.rgb.r;
  const colorG = color.rgb.g;
  const colorB = color.rgb.b;
  const colorComplement = getComplimentaryColor(colorHex);
  const colorName = color.name;

  // Check to see if the background is too light to read text
  if (color.luminance >= 130) {
    console.log('yes');
    document.body.style.filter = 'invert(70%)';
  } else {
    document.body.style.color = colorComplement;
  }

  const body = document.body;
  const colorNameElement = document.querySelector('.color-name');
  const colorHexElement = document.querySelector('.color-hex');
  const colorRgbElement = document.querySelector('.color-rgb');

  body.style.backgroundColor = colorHex;
  body.style.color = colorComplement;
  colorNameElement.textContent = colorName;
  colorHexElement.textContent = colorHex;
  colorRgbElement.textContent = `rgb(${colorR}, ${colorG}, ${colorB})`;
  document.querySelector('footer').style.opacity = 1;
}

getColors();
