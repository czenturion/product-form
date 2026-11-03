# Product Form

Form for creating a product card in [TableCRM](https://tablecrm.com/) through its REST API.

**Demo:** [product-form-sepia.vercel.app](https://product-form-sepia.vercel.app/dashboard/products/new)

## Features

- Validation with a Zod schema connected to React Hook Form
- Categories are loaded from the API, with search inside the dropdown
- Grouped sections: main info, pricing, SEO, address and coordinates
- SEO keywords typed as a comma-separated string are sent as an array
- Toast notifications for success and API errors
- Submit button is locked while the request is in progress

## Stack

Next.js (App Router), React 19, TypeScript, React Hook Form, Zod, shadcn/ui, Tailwind CSS 4, Sonner

## Run locally

```bash
npm install
echo "NEXT_PUBLIC_API_TOKEN=your_tablecrm_token" > .env.local
npm run dev
```

Open http://localhost:3000 — it redirects to the form.

## Project structure

```
src/app/dashboard/products/new/page.tsx  page with the form
src/components/ProductForm.tsx           form, schema and submit logic
src/lib/api.ts                           TableCRM API requests and types
src/components/ui/                       shadcn/ui components
```
