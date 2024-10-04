# Frontend Challenge: To-Do List Application (Next.js + ShadCN)

## Objective

Build a simple, responsive To-Do List application using **Next.js** and styled with **ShadCN**. The app allows users to create, view, edit, and delete tasks, with data stored persistently in the browser’s local storage.

## Requirements

### Next.js:
- Use **Next.js** to build the frontend application.
- Manage the tasks' state using **useState** and **useEffect**.
- Persist tasks using **localStorage**, ensuring they remain after page refreshes.

### ShadCN:
- Use **ShadCN** to create a clean, responsive, and modern UI for the To-Do List.
- Ensure the app looks great on both mobile and desktop.

## Features

- **Add Task**: Users can add new tasks with a title, description (optional), and status (pending, in-progress, completed).
- **View Tasks**: Display a list of all tasks, showing their title, description, and status.
- **Edit Task**: Users can edit a task's title, description, or status.
- **Delete Task**: Users can delete tasks from the list.
- **Persist Data**: Tasks persist across page reloads using **localStorage**.
- **Filter Tasks**: Users can filter tasks by status (pending, in-progress, completed).

## Responsiveness

Ensure the app is fully responsive, providing an optimal experience across mobile, tablet, and desktop devices.

## Steps

### Task Data Management:
1. Use **useState** to manage the list of tasks.
2. On the initial load, retrieve tasks from **localStorage** using **useEffect** and update the state.
3. For each task addition, deletion, or edit, update both the state and **localStorage**.

### UI Design:
1. Use **ShadCN** components (e.g., buttons, inputs, modals) to design an intuitive UI.
2. Implement modals for editing tasks and confirmation dialogs for deletions.
3. Use **ShadCN** form components to add dynamic form validation for task creation and editing.

## Bonus (Optional)

- **Dark Mode**: Implement a dark mode toggle using ShadCN's theme features.
- **Drag-and-Drop**: Add drag-and-drop functionality to reorder tasks in the list.
- **Search**: Add a search bar to filter tasks by title.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Navigate to the project directory:
   ```bash
   cd your-repo-name
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3001` to view the app.
