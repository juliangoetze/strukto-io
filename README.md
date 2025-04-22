# strukto-io

[![Website strukto.io](https://img.shields.io/website?url=https%3A%2F%2Fstrukto.io)](https://strukto.io)
**strukto.io** is a web-based, drag-and-drop editor designed for creating and editing Nassi-Shneiderman diagrams (also known as structograms). It provides an intuitive interface to visually represent algorithms and program structures.

**[Visit the live application at strukto.io](https://strukto.io)**

## ✨ Features

* **Visual Editing:** Intuitive drag-and-drop interface for building diagrams.
* **Nassi-Shneiderman Elements:** Support for standard structogram elements (Sequence, Selection, Iteration, etc.).
* **Export:** Ability to export diagrams (e.g., as images or PDF - leveraging html2canvas/jsPDF).
* **Modern Web Tech:** Built with Vue 3, Vite, and TypeScript for a fast and reliable experience.
* *(Add other key features if applicable, e.g., saving/loading, templates)*

## 🛠️ Tech Stack

* **Framework:** [Vue 3](https://vuejs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **State Management:** [Pinia](https://pinia.vuejs.org/)
* **Utility Library:** [VueUse](https://vueuse.org/)
* **Styling:** [Sass](https://sass-lang.com/)
* **Linting:** [ESLint](https://eslint.org/)
* **Formatting:** [Prettier](https://prettier.io/)

## 🚀 Getting Started

Follow these instructions to set up the development environment and run the project locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
* [pnpm](https://pnpm.io/)
* [Git](https://git-scm.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)juliangoetze/strukto-io.git
    cd strukto-io
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    This will start the Vite development server, typically available at `http://localhost:3000`.

## ⚙️ Available Scripts

The following scripts are available via pnpm:

* `pnpm run dev`: Starts the development server with hot module replacement (HMR).
* `pnpm run build`: Compiles and type-checks the application for production. Output is in the `dist` directory.
* `pnpm run build-ignore-errors`: Compiles the application for production, ignoring TypeScript errors.
* `pnpm run preview`: Serves the production build locally to preview it.
* `pnpm run lint`: Runs ESLint to check for code style issues and potential errors in `.ts` and `.vue` files within the `src` directory.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  **Fork** the repository.
2.  Create a new **branch** for your feature or bugfix (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3.  Make your **changes**.
4.  Ensure your code **lints** (`pnpm run lint`).
5.  **Commit** your changes with clear messages (consider using [Conventional Commits](https://www.conventionalcommits.org/)).
6.  **Push** your branch to your fork (`git push origin feature/your-feature-name`).
7.  Open a **Pull Request** to the main repository's `main` (or `master`) branch.

Please report bugs or suggest features by opening an issue on the GitHub repository.

## 📄 License

This project is licensed under the [Your License Name] License. See the `LICENSE.md` file for details (if available).

---

*Generated README structure based on standard open-source practices.*