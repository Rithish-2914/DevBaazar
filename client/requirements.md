## Packages
date-fns | Formatting dates for projects and content
lucide-react | High quality icons
react-hook-form | Form state management
@hookform/resolvers | Zod validation for forms
zod | Schema validation

## Notes
Auth state is maintained via HTTP-only cookies.
All api calls must include `credentials: "include"`.
The backend provides `api` and schemas via `@shared/routes` and `@shared/schema`.
Dynamic routes must be protected if unauthenticated.
