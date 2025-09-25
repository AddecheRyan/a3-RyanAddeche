##  Fraternity Task Manager

**Render Link**: https://a3-ryan-addeche.vercel.app/

A task management application designed for fraternities to organize and track responsibilities across different roles. The application allows users to create, assign, update, and delete tasks while maintaining user-specific data persistence through MongoDB.

### Application Overview

The Fraternity Task Manager serves as a workspace where the president can efficiently manage their fraternities tasks. Users can create tasks and assign them to specific officer roles (President, Vice President, Treasurer, Secretary), track completion status, and maintain a clean, organized workflow.

### Key Features

- **User Authentication**: Secure login/registration system with session management
- **Task Management**: Create, read, update, and delete tasks
- **Role-Based Assignment**: Assign tasks to specific officer positions
- **Real-Time Updates**: Dynamic task completion status with visual indicators
- **Persistent Storage**: All data stored in MongoDB Atlas for reliability
- **Responsive Design**: Clean, professional interface using Bootstrap

### Challenges Faced

1. **MongoDB Integration**: Initially struggled with asynchronous database connections and ensuring proper error handling
2. **User Authentication**: Implementing session-based authentication
3. **Dynamic UI Updates**: Creating responsive task cards that update in real-time without page refreshes
4. **Data Consistency**: Ensuring user-specific data isolation and proper task assignment logic

### Authentication Strategy

I chose to implement a simple username/password authentication system using Express sessions. This approach was selected because it provides a solid foundation for user management while being straightforward to implement and debug. The system creates new accounts automatically upon registration and maintains user sessions throughout the application lifecycle.

### CSS Framework

**Bootstrap 5.3.0** was selected as the primary CSS framework for several reasons:
- Comprehensive component library with cards, forms, and navigation elements
- Professional aesthetic
- Prior experience with bootstrap

**Custom CSS Modifications**: Minimal custom CSS was added, primarily for:
- Custom color schemes for different officer roles
- Font Awesome icon integration
- Animations and hover effects
- Task completion visual indicators (strikethrough text)

### Express Middleware Packages

- **express-session**: Manages user sessions and authentication state across requests
- **express.json()**: Parses incoming JSON payloads from client requests
- **express.urlencoded()**: Handles form data submission from HTML forms
- **express.static()**: Serves static files (CSS, JavaScript, images) from the public directory
- **Custom logger middleware**: Simple request logging for debugging purposes
- **Custom requireAuth middleware**: Protects routes by checking for valid user sessions

## Technical Achievements

- **Clean Code Implementation**: Removed all console.log statements from both client and server code for a production-ready application with silent error handling and clean console output.

## Design/Evaluation Achievements

- **Accessibility Improvements**: Implemented accessibility features including ARIA labels, semantic HTML structure, keyboard navigation support, and screen reader compatibility to achieve high accessibility scores.

### CRAP Design Principles Analysis

**Contrast**: The most emphasized element on each page is the task creation form, which uses a bright green header that stands out against the light background. This high contrast draws immediate attention to the primary action users can take. The navigation bar uses a deep blue that creates strong contrast with the white text, ensuring clear visibility and hierarchy.

**Repetition**: Throughout the site, I consistently used Bootstrap's color scheme with specific colors for each officer role: yellow for President, blue for Vice President, green for Treasurer, and primary blue for Secretary. The card-based layout is repeated across all task sections, and the same button styling is used consistently for create and delete actions. Font Awesome icons are repeated throughout for visual consistency.

**Alignment**: All content is properly aligned using Bootstrap's grid system, with the create task form aligned to the left and task lists organized in a 2x2 grid on the right. Form elements are left-aligned within their containers, and the navigation bar uses flexbox alignment to position the brand on the left and user controls on the right. Task cards use consistent padding and margin alignment.

**Proximity**: Related elements are grouped together through proximity - the task creation form is contained in its own card, separate from the task display areas. In each officer's task section, individual tasks are grouped closely together with consistent spacing. The navigation elements are positioned near each other, while the main brand is separated to establish a clear visual difference.