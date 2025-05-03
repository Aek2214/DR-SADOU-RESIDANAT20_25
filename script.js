// Variables to hold sound elements for reuse
const addSound = document.getElementById('addSound');
const removeSound = document.getElementById('removeSound');

// Gestion onglets
document.addEventListener('DOMContentLoaded', () => {
  // Tabs switch
  document.querySelectorAll('nav .tabs li').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelector('nav .tabs li.active').classList.remove('active');
      tab.classList.add('active');
      const selectedTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.toggle('active', section.id === selectedTab);
      });
    });
  });

  // Set up toggle buttons (delegated)
  document.querySelectorAll('.toggle-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if(target) {
        target.classList.toggle('hidden');
      }
    });
  });

  // Set up add course buttons
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      addNewCourse(section);
    });
  });

  // Set up add QCM buttons
  document.querySelectorAll('.add-qcm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      addNewQCM(section);
    });
  });

  // Load all default data
  loadDefaultData();
});

// Fonction audio jouer
function playSound(soundElem) {
  if (!soundElem) return;
  soundElem.pause();
  soundElem.currentTime = 0;
  soundElem.play().catch(() => {/* ignore playback failure due to browser interaction policy*/});
}

// Ajouter un nouveau cours entrée manuelle
function addNewCourse(section) {
  const input = document.getElementById(`${section}-new-course`);
  const name = input.value.trim();
  if(name === '') return alert('Veuillez saisir un nom de cours.');
  // Pour Médical et Biologie, on ajoute dans catégorie Divers si existe sinon la crée
  if(section === 'medical' || section === 'biologie') {
    let container = document.getElementById(`${section}-available-container`);
    let diversCategory = container.querySelector('.category[data-category="Divers"]');
    if(!diversCategory) {
      diversCategory = document.createElement('div');
      diversCategory.className = 'category';
      diversCategory.setAttribute('data-category', 'Divers');
      diversCategory.innerHTML = '<h4>Divers</h4><ul></ul>';
      container.appendChild(diversCategory);
    }
    const ul = diversCategory.querySelector('ul');
    if(Array.from(ul.children).some(li=>li.textContent.includes(name))) {
      alert('Ce cours existe déjà.');
      return;
    }
    const li = document.createElement('li');
    li.innerHTML = `${name} <button type="button" aria-label="Ajouter ce cours">Ajouter</button>`;
    li.querySelector('button').onclick = e => addCourseFromAvailable(e.target, section);
    ul.appendChild(li);
  } else {
    // Chirurgicale: liste plate
    const ul = document.getElementById(`${section}-available-list`);
    if(Array.from(ul.children).some(li=>li.textContent.includes(name))) {
      alert('Ce cours existe déjà.');
      return;
    }
    const li = document.createElement('li');
    li.innerHTML = `${name} <button type="button" aria-label="Ajouter ce cours">Ajouter</button>`;
    li.querySelector('button').onclick = e => addCourseFromAvailable(e.target, section);
    ul.appendChild(li);
  }
  input.value = '';
  playSound(addSound);
}

// Ajouter cours depuis la liste disponible vers la liste révisée
function addCourseFromAvailable(button, section) {
  const li = button.closest('li');
  if(!li) return;
  const text = li.firstChild.textContent.trim();
  const revisedUl = document.getElementById(`${section}-revised-list`);
  if(Array.from(revisedUl.children).some(li=>li.textContent.includes(text))) {
    alert('Ce cours est déjà dans les cours révisés.');
    return;
  }
  const newLi = document.createElement('li');
  newLi.textContent = text + ' ';
  const remBtn = document.createElement('button');
  remBtn.textContent = 'Supprimer';
  remBtn.type = "button";
  remBtn.setAttribute('aria-label', 'Supprimer ce cours révisé');
  remBtn.onclick = e => {
    e.target.closest('li').remove();
    playSound(removeSound);
  };
  newLi.appendChild(remBtn);
  revisedUl.appendChild(newLi);
  playSound(addSound);
}

// Ajouter un nouveau QCM
function addNewQCM(section) {
  const textarea = document.getElementById(`${section}-new-qcm`);
  const val = textarea.value.trim();
  if(val==='') return alert('Veuillez saisir le contenu du QCM.');
  const ul = document.getElementById(`${section}-qcm-list`);
  if(Array.from(ul.children).some(li=>li.textContent === val)) {
    alert('Ce QCM existe déjà.');
    return;
  }
  const li = document.createElement('li');
  li.textContent = val + ' ';
  const btn = document.createElement('button');
  btn.textContent = 'Ajouter';
  btn.type = "button";
  btn.setAttribute('aria-label', 'Ajouter ce QCM');
  btn.onclick = e => addQCMFromAvailable(e.target, section);
  li.appendChild(btn);
  ul.appendChild(li);
  textarea.value = '';
  playSound(addSound);
}

// Ajouter QCM de la liste disponible vers sélectionnée
function addQCMFromAvailable(button, section) {
  const li = button.closest('li');
  if(!li) return;
  const text = li.firstChild.textContent.trim();
  const selectedUl = document.getElementById(`${section}-selected-qcm`);
  if(Array.from(selectedUl.children).some(li=>li.textContent.includes(text))) {
    alert('Ce QCM est déjà sélectionné.');
    return;
  }
  const newLi = document.createElement('li');
  newLi.textContent = text + ' ';
  const remBtn = document.createElement('button');
  remBtn.textContent = 'Supprimer';
  remBtn.type = "button";
  remBtn.setAttribute('aria-label', 'Supprimer ce QCM sélectionné');
  remBtn.onclick = e => {
    e.target.closest('li').remove();
    playSound(removeSound);
  };
  newLi.appendChild(remBtn);
  selectedUl.appendChild(newLi);
  playSound(addSound);
}

// Données initiales Medica, Chirurgical et Biologie (comme exposé avant, possible à charger ici)
const medicalData = {
  "Médecine légale": [
    "Asphyxies mécaniques",
    "Mort subite",
    "Responsabilité médicale",
    "Examen de cadavre"
  ],
  "Neurologie": [
    "Hypertension intra crânienne",
    "Attente isolées des nerfs crâniens",
    "Neuropathies périphériques",
    "Céphalée",
    "Les épilepsies",
    "La sclérose en plaque",
    "Accident vasculaire cérébral",
    "Myasthénie, myopathie",
    "La maladie de parkinson",
    "Maladie d’Alzheimer"
  ],
  "Psychiatrie": [
    "Les urgences psychiatriques",
    "Psychotropes",
    "Troubles anxieux",
    "Troubles de l'humeur",
    "Schizophrénie",
    "Troubles du sommeil",
    "Psychiatrie médico-légale",
    "Les troubles délirants"
  ]
  // etc. Vous pouvez étendre avec le reste des catégories à partir de vos données.
};

const chirurgicalData = [
  "Appendicite aigue : signes, diagnostique et traitement",
  "Péritonite appendiculaire : signes, diagnostique et traitement",
  "Péritonites par perforation d’ulcère gastroduodénal"
  // etc.
];

const biologieData = {
  "ANATOMIE": [
    "Anatomie de l’œil",
    "Anatomie de l’oreille",
    "Polygone de Willis"
    // etc.
  ],
  "PHYSIOLOGIE": [
    "La vision",
    "L’audition"
    // etc.
  ]
  // etc.
};

function loadMedicalData() {
  const container = document.getElementById('medical-available-container');
  container.innerHTML = ''; // Clear existing
  for (const category in medicalData) {
    const catDiv = document.createElement('div');
    catDiv.classList.add('category');
    catDiv.setAttribute('data-category', category);
    catDiv.innerHTML = `<h4>${category}</h4><ul></ul>`;
    const ul = catDiv.querySelector('ul');
    medicalData[category].forEach(course => {
      const li = document.createElement('li');
      li.innerHTML = `${course} <button type="button" aria-label="Ajouter ce cours">Ajouter</button>`;
      li.querySelector('button').onclick = e => addCourseFromAvailable(e.target,'medical');
      ul.appendChild(li);
    });
    container.appendChild(catDiv);
  }
}

function loadChirurgicalData() {
  const ul = document.getElementById('chirurgical-available-list');
  ul.innerHTML = '';
  chirurgicalData.forEach(course => {
    const li = document.createElement('li');
    li.innerHTML = `${course} <button type="button" aria-label="Ajouter ce cours">Ajouter</button>`;
    li.querySelector('button').onclick = e => addCourseFromAvailable(e.target, 'chirurgical');
    ul.appendChild(li);
  });
}

function loadBiologieData() {
  const container = document.getElementById('biologie-available-container');
  container.innerHTML = '';
  for (const category in biologieData) {
    const catDiv = document.createElement('div');
    catDiv.classList.add('category');
    catDiv.setAttribute('data-category', category);
    catDiv.innerHTML = `<h4>${category}</h4><ul></ul>`;
    const ul = catDiv.querySelector('ul');
    biologieData[category].forEach(course => {
      const li = document.createElement('li');
      li.innerHTML = `${course} <button type="button" aria-label="Ajouter ce cours">Ajouter</button>`;
      li.querySelector('button').onclick = e => addCourseFromAvailable(e.target,'biologie');
      ul.appendChild(li);
    });
    container.appendChild(catDiv);
  }
}

function loadDefaultData() {
  loadMedicalData();
  loadChirurgicalData();
  loadBiologieData();
}
