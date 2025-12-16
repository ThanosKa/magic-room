# Contributing to Magic Room

Thank you for your interest in contributing to Magic Room! 🎉

We welcome contributions from everyone. By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Table of Contents

- [Ground Rules](#ground-rules)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Style and Conventions](#style-and-conventions)
- [Pull Requests](#pull-requests)
- [Filing Issues](#filing-issues)
- [Security](#security)

## Ground Rules

### Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to kazakis.th@gmail.com.

### Transparency

We value transparency in our development process. All changes should be documented through issues and pull requests. We use conventional commits for clear change documentation.

### No Secrets in Commits

Never commit sensitive information like API keys, passwords, or personal data. Use environment variables and `.env.example` files instead.

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js 20 or higher
- pnpm package manager
- Git
- Accounts for: Clerk, Supabase, Stripe, OpenRouter, Upstash Redis

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/magic-room.git
cd magic-room
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/ThanosKa/magic-room.git
```

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Fill in all required environment variables (see README.md for details)

### Database Setup

Set up your local Supabase instance and run the migrations from `supabase/migrations/`.

### Create a Branch

Create a feature branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

## Development Workflow

### Run Locally

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Quality Gates

Before committing, ensure all quality checks pass:

```bash
# Lint code
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test:run

# Check test coverage
pnpm test:coverage
```

### SEO Audit (if applicable)

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Run SEO audit
pnpm seo:audit
```

### Commit Your Changes

We use [conventional commits](https://conventionalcommits.org/) for clear commit messages:

```bash
# For features
git commit -m "feat: add dark mode toggle"

# For bug fixes
git commit -m "fix: resolve image upload validation error"

# For documentation
git commit -m "docs: update API documentation"

# For refactoring
git commit -m "refactor: optimize image processing logic"
```

## Style and Conventions

### TypeScript

- **Strict mode enabled**: All code must pass TypeScript strict checks
- **No `any` types**: Use proper typing or `unknown` when type is uncertain
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/aliases
- **Zod validation**: Use Zod schemas for runtime validation and type safety

### React/Next.js

- **App Router**: Use Next.js 15 App Router conventions
- **Server Components default**: Use server components unless client-side interactivity is required
- **Client components**: Mark with `'use client'` directive when needed
- **File naming**: Use `kebab-case` for files, `PascalCase` for components

### Styling

- **Tailwind CSS v4**: Use utility-first approach
- **shadcn/ui**: Use provided components from the design system
- **Custom styles**: Add to `app/globals.css` or component-specific styles
- **Responsive design**: Mobile-first approach with responsive utilities

### State Management

- **Zustand**: Use for global state (user credits, generation status)
- **Server state**: Use Supabase for persistent data
- **Local state**: Use React hooks for component-specific state

### Code Quality

- **ESLint**: Follow all linting rules - no warnings allowed
- **Prettier**: Code formatting is handled automatically
- **Imports**: Group imports (React, third-party, local) with empty lines between groups
- **Error handling**: Use try/catch blocks and proper error types

### Testing

- **Vitest**: Write unit tests for utilities, components, and API routes
- **Test coverage**: Aim for >80% coverage on new code
- **Test naming**: Use descriptive test names with `describe` and `it` blocks
- **Mocking**: Mock external services (Supabase, OpenRouter, etc.)

### Logging

- **Pino**: Use structured logging throughout the application
- **Log levels**: Use appropriate levels (info, warn, error)
- **Context**: Include relevant context in log messages

## Pull Requests

### Before Submitting

1. **Update your branch** with the latest changes from main:

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run all quality checks**:

```bash
pnpm lint && pnpm type-check && pnpm test:run
```

3. **Test your changes** thoroughly, including:
   - Happy path functionality
   - Error scenarios
   - Edge cases
   - Mobile responsiveness

### Creating the PR

1. **Use the PR template** - fill out all sections completely
2. **Link related issues** - reference any issues your PR addresses
3. **Draft PRs** - mark as draft if work is in progress
4. **Screenshots** - include before/after screenshots for UI changes
5. **Testing checklist** - complete all items in the template

### PR Template Requirements

- **Summary**: Clear description of changes
- **Testing**: List of manual tests performed
- **Screenshots**: Visual changes documented
- **Breaking changes**: Clearly marked if any
- **Checklist**: All items checked off

### After Submitting

- **Respond to feedback** promptly
- **Make requested changes** and push to your branch
- **Re-request review** when changes are ready
- **Merge**: Only maintainers can merge after approval

## Filing Issues

### Bug Reports

Use the [bug report template](https://github.com/ThanosKa/magic-room/issues/new?template=bug_report.md) and include:

- **Clear title** describing the issue
- **Steps to reproduce** with detailed instructions
- **Expected vs actual behavior**
- **Screenshots/logs** when applicable
- **Environment details** (browser, OS, Node version)
- **Additional context**

### Feature Requests

Use the [feature request template](https://github.com/ThanosKa/magic-room/issues/new?template=feature_request.md) and include:

- **Problem statement** - what's the issue you're trying to solve?
- **Proposed solution** - what do you suggest?
- **Alternatives considered** - what other options did you think about?
- **Additional context** - screenshots, examples, etc.

### Questions and Discussions

For general questions or discussions:

- Check existing [discussions](https://github.com/ThanosKa/magic-room/discussions)
- Start a new discussion if needed
- Use the [Q&A category](https://github.com/ThanosKa/magic-room/discussions/categories/q-a) for questions

## Security

See [SECURITY.md](SECURITY.md) for reporting security vulnerabilities.

---

Thank you for contributing to Magic Room! 🚀
