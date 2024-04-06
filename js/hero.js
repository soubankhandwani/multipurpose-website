// Get the element with id "text"
const textElement = document.getElementById("text");

// Get the text content from the element
const textToType = textElement.innerText;

// Array of words/phrases to type
const wordsToType = [
  "Image to PDF Conversion.",
  "Shortening of URL's.",
  "QR Code Scanning.",
  "YT Video Downloading.",
  "Password Generation."
];

// Find the maximum length among all words/phrases
const maxWordLength = Math.max(...wordsToType.map((word) => word.length));

// Initialize variables for current word, word index, and typing index
let currentWordIndex = 0;
let currentWord = wordsToType[currentWordIndex];
let index = 0;

// Function to type text
function typeText() {
  // Display a part of the current word based on the typing index
  textElement.innerText = currentWord.slice(0, index++);

  // Continue typing if there are more characters in the word
  if (index <= currentWord.length) {
    setTimeout(typeText, 80);
  } else {
    // If word is fully typed, start erasing after 3 seconds
    setTimeout(eraseText, 3000);
  }
}

// Function to erase text
function eraseText() {
  // Erase a part of the current word based on the typing index
  textElement.innerText = currentWord.slice(0, index);

  // Continue erasing if there are more characters to erase
  if (index > 0) {
    index--;
    setTimeout(eraseText, 150);
  } else {
    // Move to the next word and start typing after a delay
    currentWordIndex = (currentWordIndex + 1) % wordsToType.length;
    currentWord = wordsToType[currentWordIndex];
    setTimeout(typeText, maxWordLength * 50);
  }
}

// Start typing animation
typeText();
