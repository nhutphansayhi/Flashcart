let currentCardIndex = 0;
let currentCard = null;
let vocabularySet = [];

// Lựa chọn bộ từ vựng từ danh sách tải lên
function loadVocabularySet(setName) {
  fetch(`vocab_sets/${setName}`)
    .then(response => response.json())
    .then(data => {
      vocabularySet = data;
      currentCardIndex = 0;
      displayFlashcard();
    })
    .catch(error => console.error("Error loading vocabulary set:", error));
}

// Xử lý tải tệp từ người dùng
document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file && file.name.endsWith('.json')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        vocabularySet = JSON.parse(e.target.result);
        currentCardIndex = 0;
        displayFlashcard();
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }
});

// Hiển thị flashcard
function displayFlashcard() {
  if (vocabularySet.length === 0) {
    alert("No vocabulary set loaded.");
    return;
  }

  currentCard = vocabularySet[currentCardIndex];
  document.getElementById('word').textContent = currentCard.word;
  document.getElementById('meaning').textContent = '';
  document.getElementById('example').textContent = '';
  document.getElementById('answer').classList.add('hidden');
}

// Hiển thị nghĩa và ví dụ
function showAnswer() {
  document.getElementById('meaning').textContent = currentCard.meaning;
  document.getElementById('example').textContent = `Example: ${currentCard.example}`;
  document.getElementById('answer').classList.remove('hidden');
}

// Chuyển sang flashcard tiếp theo
function nextFlashcard() {
  currentCardIndex = (currentCardIndex + 1) % vocabularySet.length;
  displayFlashcard();
}

// Quay lại flashcard trước đó
function previousFlashcard() {
  currentCardIndex = (currentCardIndex - 1 + vocabularySet.length) % vocabularySet.length;
  displayFlashcard();
}

// Khi trang web được tải, ta sẽ đăng ký sự kiện cho việc chọn bộ từ vựng từ dropdown
document.getElementById('vocabSelector').addEventListener('change', function(event) {
  const selectedSet = event.target.value;
  if (selectedSet) {
    loadVocabularySet(selectedSet);
  }
});

// Mã mặc định khi trang tải lên là bộ từ vựng đầu tiên
loadVocabularySet('set1.json');
