# Contributing to AegisFlow

We welcome contributions to AegisFlow! Please follow these guidelines to help us maintain a high-quality codebase.

## Repository Structure
- `/frontend`: React application built with Vite and Tailwind CSS.
- `/backend`: FastAPI Python application containing AI agents, APIs, and middleware.
- `/tests`: Integration and unit tests for the backend.

## Coding Conventions
- **Frontend**: Use TypeScript strictly. No `any` types. Ensure components are accessible (WCAG 2.2 AA). Use functional components and React hooks. Keep code formatted and linted (`npm run lint`).
- **Backend**: Use Python 3.10+ type hints. Validate all schemas with Pydantic. Ensure models compile without syntax errors.
- **Formatting**: Run `npm run lint` for the frontend and `flake8`/`black` for the backend before committing.

## Branch Naming
Follow the conventional branch naming strategy:
- `feat/description-of-feature`
- `fix/description-of-bug`
- `docs/description-of-changes`
- `refactor/description-of-refactor`

## Commit Message Format
Use [Conventional Commits](https://www.conventionalcommits.org/):
```
type(scope): subject

body
```
*Example:* `feat(ai): implement semantic cache for copilot engine`

## Pull Request Process
1. Fork the repository and create a new branch.
2. Ensure your code passes all linting and type checks.
3. Add or update tests as necessary.
4. Submit a Pull Request with a clear description of the problem solved.
5. Wait for a maintainer to review and approve your changes.
