# Thinking Twice Website

## Overview
The Thinking Twice Website is a modern web application designed to showcase our team, blog posts, and provide a contact form for users to get in touch with us. The site features a clean and responsive design, ensuring a great user experience across devices.

## Features
- **Team Page**: Displays information about our team members, including their roles, bios, and social media links.
- **Blog Page**: Lists all blog posts with titles, excerpts, and links to full articles.
- **Contact Form**: A user-friendly form for inquiries, enhanced for better aesthetics and functionality, including options to "Get a Demo" and "Schedule a Demo".
- **Solutions and Problems Sections**: Highlighting the solutions we offer and the problems we aim to solve.

## Project Structure
```
thinking-twice-website
├── src
│   ├── components
│   │   ├── BlogList.tsx
│   │   ├── BlogPostCard.tsx
│   │   ├── ContactForm.tsx
│   │   ├── TeamMember.tsx
│   │   └── TeamSection.tsx
│   ├── pages
│   │   ├── index.tsx
│   │   ├── blog.tsx
│   │   ├── team.tsx
│   │   └── contact.tsx
│   ├── data
│   │   ├── blogPosts.ts
│   │   └── team.ts
│   └── styles
│       └── contactForm.module.css
├── public
│   └── favicon.ico
├── package.json
├── tsconfig.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd thinking-twice-website
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the development server, run:
```
npm start
```
Visit `http://localhost:3000` in your browser to view the application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.