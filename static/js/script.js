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
        
        // Fetch trainers for each subject
        const subjectsWithTrainers = await Promise.all(subjects.map(async (subject) => {
            const trainersResponse = await fetch(`${API_URL}/trainer/${subject.name}/topic`);
            const trainers = await trainersResponse.json();
            return {
                ...subject,
                trainers: trainers
            };
        }));
        
        displaySubjects(subjectsWithTrainers);
    } catch (error) {
        console.error('Error loading subjects:', error);
        showError('Failed to load subjects');
    }
}

function displaySubjects(subjects) {
    const subjectsList = document.getElementById('subjects-list');
    subjectsList.innerHTML = subjects.map(subject => `
        <div class="subject-card">
            <h3><i class="fas fa-book"></i> ${subject.name}</h3>
            <div class="trainers-list">
                <h4><i class="fas fa-chalkboard-teacher"></i> Trainers:</h4>
                ${subject.trainers && subject.trainers.length > 0 
                    ? `<ul>
                        ${subject.trainers.map(trainer => `
                            <li>
                                <span><i class="fas fa-user"></i> ${trainer.name}</span>
                                <span class="trainer-id">(ID: ${trainer.empId})</span>
                            </li>
                        `).join('')}
                       </ul>`
                    : '<p class="no-trainers">No trainers assigned to this subject</p>'
                }
            </div>
        </div>
    `).join('');
}

// Add this new function
async function getTrainerByEmpId(empId) {
    try {
        const response = await fetch(`${API_URL}/trainer/employee/${empId}`);
        const trainer = await response.json();
        
        if (response.ok) {
            displaySearchResults(trainer, 'id');
        } else {
            showError('Trainer not found');
        }
    } catch (error) {
        console.error('Error fetching trainer:', error);
        showError('Failed to fetch trainer details');
    }
}

// Add these new functions

async function getTrainersBySubject(subject) {
    try {
        const response = await fetch(`${API_URL}/trainer/${subject}/topic`);
        const trainers = await response.json();
        
        if (response.ok) {
            displaySearchResults(trainers, 'subject');
        } else {
            showError('No trainers found for this subject');
        }
    } catch (error) {
        console.error('Error fetching trainers by subject:', error);
        showError('Failed to fetch trainers');
    }
}

function displaySearchResults(results, searchType) {
    const resultsContainer = document.getElementById('results-container');
    const clearButton = document.getElementById('clear-search');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `<p class="no-results">No results found</p>`;
    } else {
        const title = searchType === 'subject' ? 
            `<h3>Trainers teaching this subject:</h3>` : 
            `<h3>Trainer Details:</h3>`;
            
        const trainersHtml = Array.isArray(results) ? results : [results];
        
        resultsContainer.innerHTML = `
            ${title}
            ${trainersHtml.map(trainer => `
                <div class="trainer-card" style="animation: fadeIn 0.5s ease">
                    <h3><i class="fas fa-user"></i> ${trainer.name}</h3>
                    <p><i class="fas fa-id-badge"></i> Employee ID: ${trainer.empId}</p>
                    <p><i class="fas fa-book"></i> Subject: ${trainer.subject}</p>
                </div>
            `).join('')}
        `;
    }
    
    clearButton.style.display = 'block';
    document.getElementById('trainers-list').style.display = 'none';
}

function clearSearch() {
    document.getElementById('search-empId').value = '';
    document.getElementById('search-subject').value = '';
    document.getElementById('results-container').innerHTML = '';
    document.getElementById('clear-search').style.display = 'none';
    document.getElementById('trainers-list').style.display = 'block';
    loadTrainers();
}

// Add this new function
async function searchTrainersBySubject(subject) {
    try {
        const response = await fetch(`${API_URL}/trainer/${subject}/topic`);
        const trainers = await response.json();
        
        const resultsDiv = document.getElementById('subject-search-results');
        resultsDiv.classList.add('active');
        
        if (trainers.length === 0) {
            resultsDiv.innerHTML = `
                <div class="search-result-card">
                    <p>No trainers found for subject: ${subject}</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = `
                <h3>Trainers teaching ${subject}:</h3>
                ${trainers.map(trainer => `
                    <div class="search-result-card">
                        <h4><i class="fas fa-user"></i> ${trainer.name}</h4>
                        <p><i class="fas fa-id-badge"></i> Employee ID: ${trainer.empId}</p>
                        <p><i class="fas fa-book"></i> Subject: ${trainer.subject}</p>
                    </div>
                `).join('')}
            `;
        }
    } catch (error) {
        console.error('Error searching trainers:', error);
        showError('Failed to search trainers');
    }
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

document.getElementById('search-subject-trainers-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('search-subject-input').value;
    await searchTrainersBySubject(subject);
});

// Initialize the page
showTrainers();