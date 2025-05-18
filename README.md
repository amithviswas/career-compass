
# CareerCompass: Your AI-Powered Career Mentor

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/) [![Genkit](https://img.shields.io/badge/Genkit_(Firebase%20AI)-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/docs/genkit)

**🚀 [Live Preview](https://carrercompassavr.netlify.app/)**

CareerCompass is a comprehensive web application built with Next.js, React, and Genkit, designed to empower users in their career journey. It offers a suite of AI-driven tools for resume analysis, ATS-optimized resume building, personalized cover letter generation, LinkedIn profile enhancement, mock interview simulations with real-time feedback, soft skills analysis, and career advice via an AI chatbot.

## ✨ Key Features

*   **🧠 AI Career Dashboard:** Personalized resume analysis, skill gap identification, strengths/weaknesses breakdown, and a structured 4-week action plan.
*   **📄 ATS Resume Maker:** Transform raw resume text into a structured, editable, ATS-friendly resume. Includes an inline editor and preparation for PDF export.
*   **✉️ Cover Letter Generator:** Create tailored, professional cover letters based on your resume details and specific job descriptions.
*   **🔗 LinkedIn Profile Optimizer:** Receive AI-driven suggestions to enhance your LinkedIn headline, summary, and skills section for target roles.
*   **🎙️ Mock Interview Simulator:** Practice for interviews with AI-generated Multiple Choice Questions (MCQs) and descriptive questions tailored to specific job roles and companies. Get instant feedback, scores (1-10), and improvement tips after each answer.
*   **🤝 Soft Skills & Personality Analysis:** Discover key soft skills and understand your working style based on your resume text, with suggestions for ideal job environments.
*   **💡 Job Role Suggester:** Get AI-powered suggestions for suitable job roles and career paths based on your resume analysis.
*   **🤖 AI Career Advisor Chatbot:** Ask career-related questions, get advice, and find motivational support through an interactive chatbot interface with dynamic prompt suggestions.
*   **🔒 User Authentication:** Secure login and signup functionality (currently mocked for public showcase, easily adaptable to full Firebase Auth).
*   **📱 Responsive Design:** Modern, professional, and fully responsive user interface built with ShadCN UI and Tailwind CSS.

## 🛠️ Tech Stack

*   **Frontend:**
    *   Next.js 15 (App Router)
    *   React 18
    *   TypeScript
    *   Tailwind CSS
    *   ShadCN UI Components
*   **AI Integration:**
    *   Genkit (Google AI SDK) - primarily utilizing Gemini models
*   **State Management:**
    *   React Context API
*   **Form Handling:**
    *   React Hook Form
    *   Zod (for schema validation)
*   **Authentication:**
    *   Firebase Authentication (mock implementation in current public version)
*   **UI/UX:**
    *   Lucide React (for icons)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/amithviswas/career-compass.git
    cd career-compass
    ```
    
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory of the project. Add your Firebase and Google AI (Genkit) API keys:

    ```env
    # Firebase Configuration (Optional - mock auth is default)
    # NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
    # NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
    # NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
    # NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
    # NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
    # NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID

    # Genkit and Google AI (Gemini)
    # Ensure you have a Google AI Studio API key or have Google Cloud application default credentials set up.
    # Genkit uses GOOGLE_API_KEY or GOOGLE_APPLICATION_CREDENTIALS from the environment.
    # If using GOOGLE_API_KEY:
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY
    ```
    *   **Note on Firebase Auth:** The current public version uses a mocked authentication system in `src/contexts/AuthContext.tsx` for easier setup. To use actual Firebase Authentication, you'll need to uncomment the Firebase-related code in that file and `src/lib/firebase.ts`, and ensure your Firebase project is correctly configured with these credentials.
    *   **Google AI API Key:** You can obtain a `GOOGLE_API_KEY` from [Google AI Studio](https://aistudio.google.com/).

4.  **Run the development server for the Next.js app:**
    ```bash
    npm run dev
    ```
    This will start the Next.js application, typically available at `http://localhost:9002`.

5.  **Run the Genkit development server (in a separate terminal):**
    The AI flows are served by Genkit.
    ```bash
    npm run genkit:dev
    ```
    Or, for automatic reloading on changes to AI flow files:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit development server, often on `http://localhost:3400`. Your Next.js app communicates with this server for AI functionalities.

## 📜 Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode with Turbopack.
*   `npm run build`: Builds the app for production.
*   `npm run start`: Starts a Next.js production server.
*   `npm run lint`: Runs the linter.
*   `npm run typecheck`: Performs TypeScript type checking.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.

## 💡 AI Functionality Details

This project leverages Genkit to interface with Google's generative AI models (e.g., Gemini). All AI-driven logic is encapsulated in "flows" located in the `src/ai/flows/` directory. These flows handle tasks such as:
*   Parsing and analyzing resume text.
*   Generating structured content (summaries, bullet points, plans).
*   Evaluating interview answers.
*   Crafting creative text (cover letters, LinkedIn headlines).
*   Responding to chat queries.

A local Genkit server (started with `npm run genkit:dev` or `npm run genkit:watch`) must be running for the AI features to work.

## 🔮 Future Enhancements (Potential Ideas)

*   Persistent storage of user-generated artifacts (resumes, cover letters, interview results) in Firestore.
*   Deeper integration with LinkedIn API for direct profile data import/export.
*   Advanced analytics on mock interview performance over time.
*   Job search aggregation and application tracking features.
*   Community features for peer review or sharing career journeys.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/your-username/career-compass/issues) (if you have one).

## 📄 License

This project is [MIT Licensed](LICENSE.md) (or your chosen license). *(Consider adding a LICENSE.md file if you haven't).*

---

Happy career building!
