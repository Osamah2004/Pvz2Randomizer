// Modal open/close logic
const addLevelBtn = document.getElementById('addLevel');
const modal = document.getElementById('addLevelModal');
const closeModalBtn = document.getElementById('closeModal');
const form = document.getElementById('levelForm');
const formError = document.getElementById('formError');

addLevelBtn.onclick = () => {
  modal.style.display = 'flex';
  form.reset();
  formError.textContent = '';
};
closeModalBtn.onclick = () => {
  modal.style.display = 'none';
};
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = 'none';
};

// Firestore references (assume firebase and db are globally available)
async function addLevelToFirestore(level) {
  await db.collection('levels').add(level);
}

async function loadLevels() {
  const tbody = document.getElementById('levelsTableBody');
  tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
  try {
    const snapshot = await db.collection('levels').orderBy('name').get();
    tbody.innerHTML = '';
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="6">No levels found.</td></tr>';
      return;
    }
    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${data.name}</td>
        <td>${data.description || ''}</td>
        <td>${data.difficulty}</td>
        <td>${data.mod}</td>
        <td>${data.author}</td>
        <td><a href="${data.link}" class="fakeButton" target="_blank">level link</a></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="6">Error loading levels.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', loadLevels);

form.onsubmit = async function(e) {
  e.preventDefault();
  formError.textContent = '';
  // Validate Level Name
  const name = form.levelName.value.trim();
  if (name.length < 3 || name.length > 25) {
    formError.textContent = 'Level Name must be 3-25 characters.';
    return;
  }
  // Validate Description
  const desc = form.description.value.trim();
  if (desc.length > 75) {
    formError.textContent = 'Description max 75 characters.';
    return;
  }
  // Validate Difficulty
  if (!form.difficulty.value) {
    formError.textContent = 'Please select a difficulty.';
    return;
  }
  // Validate Mod
  const mod = form.mod.value.trim();
  if (!mod || mod.length > 3) {
    formError.textContent = 'Mod is required (max 3 chars).';
    return;
  }
  // Author
  let author = form.author.value.trim();
  if (!author) author = 'anonymous';
  // Validate Link
  const link = form.link.value.trim();
  const mf = /^https:\/\/(www\.)?mediafire\.com\/.+/.test(link);
  const gd = /^https:\/\/(www\.)?drive\.google\.com\/.+/.test(link);
  if (!link || (!mf && !gd)) {
    formError.textContent = 'Link must be a valid Mediafire or Google Drive URL.';
    return;
  }
  // Send to Firestore
  try {
    await addLevelToFirestore({
      name,
      description: desc,
      difficulty: form.difficulty.value,
      mod,
      author,
      link
    });
    modal.style.display = 'none';
    loadLevels();
  } catch (err) {
    formError.textContent = 'Error submitting level.';
  }
}; 