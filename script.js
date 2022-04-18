// Max Range for Password
var MINIMUM_PASSWORD_LENGTH = 8;
var MAXIMUM_PASSWORD_LENGTH = 128;

// ASCII Character Code Ranges for build character pools
var STARTING_RANGE_UPPERCASE_CODE = 65;
var ENDING_RANGE_UPPERCASE_CODE = 90;
var STARTING_RANGE_LOWERCASE_CODE = 97;
var ENDING_RANGE_LOWERCASE_CODE = 122;
var STARTING_RANGE_DIGIT_CODE = 48;
var ENDING_RANGE_DIGIT_CODE = 57;

// Selector to generate password.  See Week 4 Modules/Activities.
var generateBtn = document.querySelector("#generate");

// Recursive prompts until we get valid password length.
function getPasswordLength() {
  var passwordLength = Number.parseInt(
    prompt(
      "How long would you like your password? (Must be minimum of 8 Characters and no more than 128 characters)"
    )
  );

  if (Number.isNaN(passwordLength)) {
    alert(
      "Your requested length was not a number or not defined.  Please input a numeric value for password length."
    );
    getPasswordLength();
  }

  if (
    passwordLength < MINIMUM_PASSWORD_LENGTH ||
    passwordLength > MAXIMUM_PASSWORD_LENGTH
  ) {
    alert(
      "Your password does not meet the length requirements of code.  Please try again."
    );
    getPasswordLength();
  }

  return passwordLength;
}

// Get criteria for what type of password we should be adding to our pool.
function getCharacterCriteria() {
  var wantsNumbers = confirm("Would you like numbers?");
  var wantsLowerCaseLetters = confirm("Would you like lowercase letters?");
  var wantsUpperCaseLetters = confirm("Would you like uppercase letters?");
  var wantsSpecialCharacters = confirm("Would you like special characters?");

  var characterCriteria = {
    wantsNumbers,
    wantsLowerCaseLetters,
    wantsUpperCaseLetters,
    wantsSpecialCharacters,
  };

  if (
    !characterCriteria.wantsNumbers &&
    !characterCriteria.wantsLowerCaseLetters &&
    !characterCriteria.wantsUpperCaseLetters &&
    !characterCriteria.wantsSpecialCharacters
  ) {
    alert(
      "No character types were selected.  Please ensure that at least one type is selected to generate your password."
    );
    getCharacterCriteria();
  }
  return characterCriteria;
}

// Build Array with ascii character ranges for us to use to build passwords
function buildCharacterPool(startingRangeCode, endingRangeCode) {
  var characterPool = [];
  for (var i = startingRangeCode; i <= endingRangeCode; i++) {
    characterPool.push(String.fromCharCode(i));
  }

  return characterPool;
}

// Get a random character from a specific character pool.  Arrays are 0 based.
function getRandomCharacter(characterPool) {
  var randomIndex = Math.floor(Math.random() * characterPool.length);
  var randomCharacter = characterPool[randomIndex];
  return randomCharacter;
}

// Mutate generated password.
function addCharacterToPassword(characterCriteria, randomCharacter) {
  return (characterCriteria.generatedPassword += randomCharacter);
}

// Create master pool for remaining characters
function addCharactersToMasterPool(characterCriteria, newCharacterPool) {
  return (characterCriteria.completeCharacterPool =
    characterCriteria.completeCharacterPool.concat(newCharacterPool));
}

// Basic Random Shuffle.  Used to shuffle passwords and arrays.
function shuffleString(str) {
  var strAsArray = str.split("");
  var currentIndex = strAsArray.length;

  while (currentIndex !== 0) {
    var randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    var tmpValue = strAsArray[currentIndex];
    strAsArray[currentIndex] = strAsArray[randomIndex];
    strAsArray[randomIndex] = tmpValue;
  }

  return strAsArray.join("");
}

// Function brings it all together.  This is what the UI will run when the button is pressed.
function generatePassword() {
  var requestedPasswordLength = getPasswordLength();
  var characterCriteria = getCharacterCriteria();

  characterCriteria.generatedPassword = "";
  characterCriteria.completeCharacterPool = [];

  if (characterCriteria.wantsNumbers) {
    var numberCharacterPool = buildCharacterPool(
      STARTING_RANGE_DIGIT_CODE,
      ENDING_RANGE_DIGIT_CODE
    );

    var randomDigit = getRandomCharacter(numberCharacterPool);
    addCharacterToPassword(characterCriteria, randomDigit);
    addCharactersToMasterPool(characterCriteria, numberCharacterPool);
  }

  if (characterCriteria.wantsLowerCaseLetters) {
    var lowercaseCharacterPool = buildCharacterPool(
      STARTING_RANGE_LOWERCASE_CODE,
      ENDING_RANGE_LOWERCASE_CODE
    );

    var randomLowerCaseLetter = getRandomCharacter(lowercaseCharacterPool);
    addCharacterToPassword(characterCriteria, randomLowerCaseLetter);
    addCharactersToMasterPool(characterCriteria, lowercaseCharacterPool);
  }

  if (characterCriteria.wantsUpperCaseLetters) {
    var uppercaseCharacterPool = buildCharacterPool(
      STARTING_RANGE_UPPERCASE_CODE,
      ENDING_RANGE_UPPERCASE_CODE
    );

    var randomUppercaseLetter = getRandomCharacter(uppercaseCharacterPool);
    addCharacterToPassword(characterCriteria, randomUppercaseLetter);
    addCharactersToMasterPool(characterCriteria, uppercaseCharacterPool);
  }

  if (characterCriteria.wantsSpecialCharacters) {
    // Valid Special Characters.  ASCII ranges wasn't clean enough in my opinion.
    var specialCharacterPool = [
      "!",
      "#",
      "$",
      "%",
      "&",
      "*",
      "+",
      "-",
      ".",
      "^",
    ];

    var randomSpecialCharacter = getRandomCharacter(specialCharacterPool);
    addCharacterToPassword(characterCriteria, randomSpecialCharacter);
    addCharactersToMasterPool(characterCriteria, specialCharacterPool);
  }

  // Shuffle the Character Pool to make it more random
  characterCriteria.completeCharacterPool = shuffleString(
    characterCriteria.completeCharacterPool.join("")
  ).split("");

  // Now that required characters are selected.  Fill out with random characters from master pool until password is completed.
  for (
    var i = characterCriteria.generatedPassword.length;
    i < requestedPasswordLength;
    i++
  ) {
    var randomCharacter = getRandomCharacter(
      characterCriteria.completeCharacterPool
    );
    characterCriteria.generatedPassword += randomCharacter;
  }

  // Shuffle Password to make it even more random
  return shuffleString(characterCriteria.generatedPassword);
}

// Write generated password to the DOM.
function writePasswordToPage() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");

  passwordText.value = password;
}

// Add Event Listener to button that is on the page.
generateBtn.addEventListener("click", writePasswordToPage);
