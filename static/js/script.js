const API_URL = 'http://localhost:5000';

// Show/Hide sections
function showTrainers() {
    document.getElementById('trainers-section').style.display = 'block';
    document.getElementById('subjects-section').style.display = 'none';
    loadTrainers();
}

function showSubjects() {
    document.getElementById('trainers-section').style.display = 'none';
    document.getElementById('subjects-section').style.display = 'block';
    loadSubjects();
}

// Trainers functionality
async function loadTrainers() {
    try {
        const response = await fetch(`${API_URL}/trainer`);
        const trainers = await response.json();
        displayTrainers(trainers);
    } catch (error) {
        console.error('Error loading trainers:', error);
    }
}

function displayTrainers(trainers) {
    const trainersList = document.getElementById('trainers-list');
    trainersList.innerHTML = trainers.map(trainer => `
        <div class="trainer-card">
            <h3>${trainer.name}</h3>
            <p>Employee ID: ${trainer.empId}</p>
            <p>Subject: ${trainer.subject}</p>
            <button class="delete-btn" onclick="deleteTrainer('${trainer.empId}')">Delete</button>
        </div>
    `).join('');
}

async function deleteTrainer(empId) {
    try {
        await fetch(`${API_URL}/trainer?empId=${empId}`, {
            method: 'DELETE'
        });
        loadTrainers();
    } catch (error) {
        console.error('Error deleting trainer:', error);
    }
}

// Subjects functionality
async function loadSubjects() {
    try {
        const response = await fetch(`${API_URL}/subject`);
        const subjects = await response.json();
        displaySubjects(subjects);
    } catch (error) {
        console.error('Error loading subjects:', error);
    }
}

function displaySubjects(subjects) {
    const subjectsList = document.getElementById('subjects-list');
    subjectsList.innerHTML = subjects.map(subject => `
        <div class="subject-card">
            <h3>${subject.name}</h3>
        </div>
    `).join('');
}

// Event Listeners
document.getElementById('trainer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const trainer = {
        name: document.getElementById('trainer-name').value,
        empId: document.getElementById('trainer-empId').value,
        subject: document.getElementById('trainer-subject').value
    };
    try {
        await fetch(`${API_URL}/trainer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(trainer)
        });
        loadTrainers();
        e.target.reset();
    } catch (error) {
        console.error('Error adding trainer:', error);
    }
});

document.getElementById('subject-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = {
        name: document.getElementById('subject-name').value
    };
    try {
        await fetch(`${API_URL}/subject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subject)
        });
        loadSubjects();
        e.target.reset();
    } catch (error) {
        console.error('Error adding subject:', error);
    }
});

// Initialize the page
showTrainers();