# Deekshith's Portfolio

A clean, modern, and highly interactive personal portfolio built with Next.js, Sanity CMS, and Tailwind CSS.

[**Explore the live site**](https://deekshith-goud.vercel.app)

[Report Bug](https://github.com/Deekshith-goud/Deekshith-Portfolio/issues) · [Request Feature](https://github.com/Deekshith-goud/Deekshith-Portfolio/issues)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Sanity](https://img.shields.io/badge/Sanity-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)

---

## Features

- **Next.js App Router**: Fast, optimized, and modern web application framework.
- **Tailwind CSS**: Beautifully styled, responsive, and customizable user interface.
- **Sanity CMS**: Headless content management for blogs, projects, and site data.
- **Dark Mode**: Fully supported light and dark themes using `next-themes`.
- **SEO Optimized**: Dynamic metadata and structured data for better search ranking.
- **Analytics**: Integrated with Umami for privacy-focused tracking.
- **Syntax Highlighting**: Beautiful code blocks using React Refractor.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Content Management:** [Sanity.io](https://sanity.io)
- **Deployment:** [Vercel](https://vercel.com)
- **Analytics:** [Umami](https://umami.is)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

## Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have [Bun](https://bun.sh/) installed as your package manager.

### 1. Clone the repository

```bash
git clone https://github.com/Deekshith-goud/Deekshith-Portfolio.git
cd Deekshith-Portfolio
```

### 2. Install dependencies

```bash
bun install
```

### 3. Setup Environment Variables

Rename the `.env.example` file to `.env.local`:

```bash
mv .env.example .env.local
```

The minimal variables required to boot this project locally are:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`

### 4. Create a Sanity Project (Content Backend)

To populate the portfolio with your own data, you need a Sanity project:

```bash
bun create sanity@latest -- --template clean --create-project "My Portfolio" --dataset production
```

* Follow the prompts to create an account and configure the studio.
* Once created, open your Sanity studio folder, grab the `projectId` from `sanity.config.ts`, and add it to your `.env.local` file along with the dataset name (usually `production`).
* Set `NEXT_PUBLIC_SANITY_API_VERSION` to the current date (e.g., `YYYY-MM-DD`).

*(Note: If you plan to use an access token, generate one from the Sanity manage dashboard and add it to your `.env.local` as well).*

### 5. Run the Development Server

```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to view your site. 
*Note: The site might appear empty initially. To add your own data, visit your embedded studio at [http://localhost:3000/studio](http://localhost:3000/studio).*

## Scripts & Testing

Here is a list of commands you can run to manage the project locally:

- `bun run dev`: Starts the development server.
- `bun run build`: Builds the app for production (runs linting first).
- `bun run start`: Starts the production server.
- `bun run lint`: Runs ESLint to find and fix code style issues.
- `bun test`: Runs the Jest test suite.
- `bun run test:watch`: Runs Jest tests in watch mode for active development.

## Project Structure

Want to dive deeper into the codebase? Check out the [Project Structure Guide](./PROJECT_STRUCTURE.md) for a comprehensive breakdown of the application architecture.

## Contributing

Contributions, issues, and feature requests are welcome.
Feel free to check the [issues page](https://github.com/Deekshith-goud/Deekshith-Portfolio/issues). If you're contributing, please read our [Contributing Guidelines](./CONTRIBUTING.md) first.

## License

This project is [MIT](./LICENSE) licensed. 

Feel free to fork and use this repository as inspiration. If you do, a link back to the original source ([deekshith-goud.vercel.app](https://deekshith-goud.vercel.app)) in your footer would be greatly appreciated.
