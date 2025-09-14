# 🎓 Institute Management System

<p align="center">
  <img src="https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white&style=for-the-badge" alt="Flask">
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge" alt="Python">
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" alt="MongoDB">
</p>

---

## 🎯 About
A powerful **Institute Management System** built with Flask and MongoDB, designed to streamline trainer and subject management in educational institutions.

---

## 🌟 Features

✨ **Trainer Management**
- Add new trainers with unique employee IDs
- View all trainers in the system
- Search trainers by employee ID
- Remove trainers from the system

🎯 **Subject Management**
- Add new subjects to the curriculum
- View all subjects with assigned trainers
- Search trainers by subject
- Track which trainers teach specific subjects

📊 **Smart Search**
- Find trainers by employee ID
- Search trainers by subject expertise
- View subject-wise trainer distribution

---

## 🛠️ Technology Stack

- **Backend**: Flask (Python)
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **API**: RESTful Architecture

---

## 🚀 Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/VitthalSutar/task
cd task
```

2️⃣ **Set up virtual environment**
```bash
python -m venv venv
.\venv\Scripts\activate
```

3️⃣ **Install dependencies**
```bash
pip install -r requirements.txt
```

4️⃣ **Start MongoDB service**
- Ensure MongoDB is running on localhost:27017

5️⃣ **Run the application**
```bash
python task.py
```

---

## 💻 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trainer` | Add new trainer |
| GET | `/trainer` | Get all trainers |
| DELETE | `/trainer` | Remove trainer |
| GET | `/trainer/<id>` | Get trainer by ID |
| GET | `/trainer/<subject>/topic` | Get trainers by subject |
| POST | `/subject` | Add new subject |
| GET | `/subject` | Get all subjects |
| GET | `/subject/<id>` | Get subject with trainers |

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


## 🤝 Contact

Created by Vitthal Sutar - feel free to reach out!

- GitHub: [@yourusername](https://github.com/VitthalSutar)
- Email: gameranish7105@gmail.com

---

<p align="center">Made with ❤️ for better education management</p>