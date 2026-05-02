# AI Research System

## Overview
This project is an automated, multi-agent research pipeline designed to gather information from the web, scrape relevant context, and compile structured reports. It leverages the LangChain and LangGraph frameworks, running on the Google Gemini model. 

Recently, the system has been upgraded from a terminal-based script to a full-stack web application, featuring a Python backend and a React-based 3D user interface.

## Architecture

The project is divided into two primary components:

### 1. The Python Backend
The backend serves as the orchestration layer for our AI agents. It uses FastAPI to expose a single endpoint that triggers the research process.

- **agents.py**: Defines the individual AI agents (Research Agent and Reader Agent) using standard LangChain Tool Calling architecture.
- **tools.py**: Contains the functional tools the agents use, specifically web searching (via Tavily) and web scraping (via BeautifulSoup).
- **pipeline.py**: The core orchestration file that links the agents and output chains together, passing state sequentially from search, to read, to draft, and finally to critic review.
- **server.py**: A FastAPI wrapper that allows the React frontend to communicate with the Python pipeline.

### 2. The React Frontend
The frontend provides an interactive, visual interface for the research system. 

- Built with Vite and React.
- Utilizes React Three Fiber to render dynamic 3D elements that visually respond to the system's processing state.
- Features a modern, glass-like design aesthetic using vanilla CSS.

## Setup and Installation

### Prerequisites
Ensure you have Python 3.10+ and Node.js installed on your machine. You will also need active API keys for Google Gemini and Tavily.

### Backend Setup
1. Open a terminal in the root directory.
2. Create and activate a virtual environment.
3. Install the required Python dependencies:
   `pip install -r requirements.txt`
4. Copy the `.env.example` file to `.env` and fill in your API keys:
   - `GEMINI_API_KEY`
   - `TAVILY_API_KEY`
5. Start the backend server:
   `python -m uvicorn server:app --reload`

### Frontend Setup
1. Open a separate terminal and navigate to the UI directory:
   `cd ui`
2. Install the necessary Node packages:
   `npm install`
3. Start the frontend development server:
   `npm run dev`

Once both servers are running, open your web browser to the local address provided by Vite (typically `http://localhost:5173`) to interact with the application.

## Usage
Simply type your desired research topic into the search bar and press enter. The system will activate the background agents, visually indicate its processing state, and eventually present a comprehensive markdown report alongside a critical evaluation.
