let currentCardIndex = 0;
let currentCard = null;
let vocabularySet = [];

function loadVocabularySet(setName) {
  fetch(`vocab_sets/${setName}`)
    .then(response => response.json())
    .then(data => {
      vocabularySet = data.vocabulary;
      currentCardIndex = 0;
      displayFlashcard();
    })
    .catch(error => console.error("Error loading vocabulary set:", error));
}

document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file && file.name.endsWith('.json')) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        vocabularySet = data.vocabulary;
        currentCardIndex = 0;
        displayFlashcard();
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }
});

function displayFlashcard() {
  if (vocabularySet.length === 0) {
    alert("No vocabulary set loaded.");
    return;
  }

  currentCard = vocabularySet[currentCardIndex];
  document.getElementById('word').textContent = `Word (${currentCardIndex + 1}/${vocabularySet.length}): ${currentCard.word}`;
  document.getElementById('phonetic').textContent = `Phonetic: ${currentCard.phonetic}`;
  document.getElementById('classification').textContent = `Classification: ${currentCard.classification}`;
  document.getElementById('meaning').textContent = '';
  document.getElementById('example').textContent = `Example: ${currentCard.examples[0].en}`;
  document.getElementById('translation').classList.add('hidden');
  
  const dictionaryLink = document.getElementById('dictionaryLink');
  dictionaryLink.href = currentCard.link;
  dictionaryLink.textContent = "Dictionary Link";
  dictionaryLink.classList.remove('hidden');
}

function showAnswer() {
  document.getElementById('meaning').textContent = `Definition: ${currentCard.definition}`;
}

function toggleTranslation() {
  const translationElement = document.getElementById('translation');
  if (translationElement.classList.contains('hidden')) {
    translationElement.textContent = `Translation: ${currentCard.examples[0].vi}`;
    translationElement.classList.remove('hidden');
  } else {
    translationElement.classList.add('hidden');
  }
}

function nextFlashcard() {
  currentCardIndex = (currentCardIndex + 1) % vocabularySet.length;
  displayFlashcard();
}

function previousFlashcard() {
  currentCardIndex = (currentCardIndex - 1 + vocabularySet.length) % vocabularySet.length;
  displayFlashcard();
}

document.getElementById('vocabSelector').addEventListener('change', function (event) {
  const selectedSet = event.target.value;
  if (selectedSet) {
    loadVocabularySet(selectedSet);
  }
});

loadVocabularySet('set1.json');
