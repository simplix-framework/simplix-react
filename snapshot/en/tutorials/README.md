# Tutorials

**English** | [한국어](/ko/tutorials/README.md)

Step-by-step tutorials that walk through building complete applications from scratch. Each tutorial starts from zero and builds up to a fully working result, introducing concepts progressively along the way.

## Contents

| Document | Description |
| --- | --- |
| [Petstore OpenAPI](/en/tutorials/petstore-openapi.md) | Generate a fully typed, multi-domain monorepo from the Swagger Petstore OpenAPI spec: scaffold the project with `simplix init`, import the spec with `simplix openapi`, and get Zod schemas, React Query hooks, and MSW mock handlers derived automatically |
| [Project Management App](/en/tutorials/project-app.md) | Build a project management app from scratch: define a contract with project and task entities and Zod schemas, derive React Query hooks, create list and detail views, and wire up create/update mutations with automatic cache invalidation |
| [Auth Protected App](/en/tutorials/auth-protected-app.md) | Add authentication to an existing app: configure `createAuth` with Bearer token scheme, set up automatic token refresh and 401 retry, protect routes with `AuthProvider`, and implement login/logout flows with `useAuth` |
| [Full-Stack Mock](/en/tutorials/full-stack-mock.md) | Build a complete frontend application backed by an in-memory mock store and MSW service worker, with no backend required. Set up `deriveMockHandlers`, seed initial data, and develop against a realistic API simulation with full CRUD support |

---

<p class="page-source"><a href="https://github.com/simplix-framework/simplix-react/blob/main/docs/en/tutorials/README.md" target="_blank" rel="noopener noreferrer">View source</a></p>
