var MINIMUM_PASSWORD_LENGTH = 8;
var MAXIMUM_PASSWORD_LENGTH = 128;

var STARTING_RANGE_UPPERCASE_CODE = 65;
var ENDING_RANGE_UPPERCASE_CODE = 90;
var STARTING_RANGE_LOWERCASE_CODE = 97;
var ENDING_RANGE_LOWERCASE_CODE = 122;
var STARTING_RANGE_DIGIT_CODE = 48;
var ENDING_RANGE_DIGIT_CODE = 57;

var generateBtn = document.querySelector("#generate");

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

function buildCharacterPool(startingRangeCode, endingRangeCode) {
  var characterPool = [];
  for (var i = startingRangeCode; i <= endingRangeCode; i++) {
    characterPool.push(String.fromCharCode(i));
  }

  return characterPool;
}

function getRandomCharacter(characterPool) {
  var randomIndex = Math.floor(Math.random() * characterPool.length);
  var randomCharacter = characterPool[randomIndex];
  return randomCharacter;
}

function addCharacterToPassword(characterCriteria, randomCharacter) {
  return (characterCriteria.generatedPassword += randomCharacter);
}

function addCharactersToMasterPool(characterCriteria, newCharacterPool) {
  return (characterCriteria.completeCharacterPool =
    characterCriteria.completeCharacterPool.concat(newCharacterPool));
}

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

function writePasswordToPage() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");

  passwordText.value = password;
}

generateBtn.addEventListener("click", writePasswordToPage);
