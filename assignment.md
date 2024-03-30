### Assignment Overview:

Develop a full-stack web application that allows users to drag and drop a file containing a structured list of categories with a hierarchical parent-child relationship.
The application will display a preview of the parsed hierarchical data and, upon user confirmation, store it in a PostgreSQL database.

### Frontend:

**Framework:** Use React or any React framework (e.g., Next.js) to create the frontend.

**Functionality:**
- Implement drag-and-drop functionality for users to upload a file.
- Parse the uploaded file to display a hierarchical structure of categories.
- Allow the user to review this structure and confirm before data is sent to the backend.

**Extra Features:**
- Validate the file format (e.g., .txt) before parsing.
- Add loading indicators and error handling for a better user experience.

### Backend (Axum):

**Server:** Utilize Axum as the backend framework for building efficient and reliable web services in Rust.

**API Endpoint:** Create an endpoint to receive the hierarchical data from the frontend.

**Database Interaction:**
- Integrate with a PostgreSQL database to store the hierarchical data.
- Design and implement the database schema to efficiently represent the categories and their relationships.

### Database (PostgreSQL):

**Schema:**
- Design a schema to store the category hierarchy. This should include a `categories` table with columns for `id`, `name`, `parent_id` (with nulls for root categories), and possibly other relevant metadata.

### Assignment Deliverables:

- Source code for both frontend and backend, organized in a Git repository.
- README files providing detailed instructions for setting up and running the application, including database setup.
- A script or detailed instructions for creating the necessary database schema in PostgreSQL.

### Extension Opportunities:

- Implementing authentication and authorization to manage who can upload and modify the category structure.
- Adding the ability to edit the category hierarchy from the frontend, including adding, renaming, and deleting categories.
- Incorporating advanced visualization techniques to display the hierarchical data more effectively.
- Enhancing the application's scalability or performance, possibly through optimizing database queries or frontend state management.
- Integrating additional features like search functionality to easily navigate through categories or filtering options to refine displayed data.
- Or anything else that improves user experience, application performance, or code maintainability are all valuable contributions.
