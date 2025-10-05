# Virofund MVP

Virofund is a Next.js MVP for co-founder matchmaking, designed with a modern atomic folder structure and a scalable, maintainable codebase. This project leverages [shadcn/ui](https://ui.shadcn.com/) for UI components, ensuring consistency and rapid development.

---

## 🚀 Technologies Used

- **Next.js** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS** (with custom color variables)
- **shadcn/ui** (Radix primitives)
- **Zustand** (state management)
- **Firebase** (user storage)

---

## 🏗️ Folder Structure

This project uses an **atomic design** folder structure:

- `src/components/atoms/` – Smallest, reusable UI elements (Button, Input, etc.)
- `src/components/molecules/` – Combinations of atoms (Form, Section, etc.)
- `src/components/organisms/` – Complex UI blocks (not yet implemented)
- `src/components/pages/` – Page-level components
- `src/components/ui/` – shadcn/ui wrappers and customizations
- `src/components/wrappers/` – Utility wrappers (e.g., access token checker)
- `src/lib/` – Business logic, constants, utilities
- `src/store/` – Zustand stores
- `src/types/` – TypeScript types

All new UI components should be created using [shadcn/ui](https://ui.shadcn.com/) primitives for consistency.

---

## 🎨 Color Variables

Tailwind CSS is configured with custom color variables for easy theming.  
You can find and modify these in [`src/app/globals.css`](src/app/globals.css):

```css
:root {
  --color-background: oklch(1 0 0);
  --color-primary: oklch(69.588% 0.14907 162.508);
  --color-secondary: oklch(88.574% 0.10735 162.993);
  --color-accent: oklch(0.968 0.007 247.896);
  --color-destructive: oklch(50.54% 0.19049 27.505);
  --color-border: oklch(0.929 0.013 255.508);
  --color-input: oklab(87.168% -0.00188 -0.00925);
  /* ...see full list in globals.css... */
}
```

**Dark mode** is supported via the `.dark` class, with its own set of variables.

---

## 📝 Contribution Guidelines

- **All new features must be submitted as a Pull Request (PR).**
- PRs should include a clear description and reference related issues if applicable.
- All UI components must use [shadcn/ui](https://ui.shadcn.com/) primitives.
- Follow the atomic folder structure for new components.
- Ensure code is linted (`npm run lint`) and passes all checks before submitting.
- Write clear, concise commit messages.

---

## 🛠️ Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 📁 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives/overview/introduction)

---

## 💡 Notes

- All authentication and onboarding flows use Firebase and REST APIs.
- Color variables and theming are centralized in [`src/app/globals.css`](src/app/globals.css).
- For any questions, please open an issue or start a discussion.

---

**Happy coding!**
