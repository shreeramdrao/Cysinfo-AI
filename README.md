
# Cysinfo AI

Cysinfo AI is an interactive AI solution designed to provide in-depth cybersecurity insights using fine-tuned LLMs and Generative AI. This README provides instructions for setting up and running the project.

## Features
- Cybersecurity insights powered by fine-tuned LLM.
- Real-time query resolution.
- Contextual awareness and advanced NLP capabilities.

---

## Prerequisites

Ensure the following tools and dependencies are installed on your system before proceeding:

- **Node.js** (v16 or above)
- **npm** (Node Package Manager)
- **yarn** (optional but recommended)
- **Ollama** (for LLM server setup)

---

## Getting Started

### Step 1: Extract Node Modules
The required `node_modules` files are zipped for convenience. Follow these steps:
1. Locate the zipped `node_modules` file in the project directory.
2. Extract the file using any archiving tool (e.g., WinRAR, 7-Zip, or `unzip` on Linux).

---

### Step 2: Download the Fine-Tuned Model
The fine-tuned model for this project is hosted on Google Drive. Download and save it to a specific directory as follows:

1. Use the following link to download the fine-tuned model:
   [Download Model](https://drive.google.com/file/d/1XbesSz_NihtpyTUyxCKWiqBA5ktB9pgv/view?usp=sharing)
2. Save the model in the `models` directory within the project folder:
   ```
   <project-root>/models/
   ```

---

### Step 3: Install and Set Up Ollama
1. **Install Ollama**:
   Follow the official documentation for installing Ollama on your system.
2. **Start the Ollama Server**:
   Run the following command to start the Ollama server:
   ```bash
   ollama serve
   ```

---

### Step 4: Clone the Repository
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/shreeramdrao/Cysinfo-AI.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Cysinfo-AI
   ```

---

### Step 5: Install Yarn
1. Install Yarn globally using npm:
   ```bash
   npm install --global yarn
   ```
2. Verify the installation:
   ```bash
   yarn --version
   ```

---

### Step 6: Install Dependencies and Run the Project
1. Install project dependencies using Yarn:
   ```bash
   yarn install
   ```
2. Start the development server:
   ```bash
   yarn dev
   ```

---

## Project Directory Structure
```
Cysinfo-AI/
├── models/                  # Directory to store fine-tuned models
├── node_modules/            # Extracted node modules
├── src/                     # Source code for the project
├── public/                  # Static files  
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation
```

---

## Contributing
Feel free to open issues or submit pull requests for bug fixes, enhancements, or new features.

