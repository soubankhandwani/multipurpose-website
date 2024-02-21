const textElement = document.getElementById("text");
const textToType = textElement.innerText;
const wordsToType = [
  "Image to PDF Conversion.",
  "Shortening of URL's.",
  "QR Code Scanning.",
  "YT Video Downloading.",
  "Password Generation."
];

const maxWordLength = Math.max(...wordsToType.map((word) => word.length));

let currentWordIndex = 0;
let currentWord = wordsToType[currentWordIndex];

let index = 0;
function typeText() {
  textElement.innerText = currentWord.slice(0, index++);

  if (index <= currentWord.length) {
    setTimeout(typeText, 80);
  } else {
    setTimeout(eraseText, 3000);
  }
}

function eraseText() {
  textElement.innerText = currentWord.slice(0, index);

  if (index > 0) {
    index--;
    setTimeout(eraseText, 150);
  } else {
    currentWordIndex = (currentWordIndex + 1) % wordsToType.length;
    currentWord = wordsToType[currentWordIndex];
    setTimeout(typeText, maxWordLength * 50);
  }
}

typeText();
