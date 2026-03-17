# Primero – Coding Agent Instructions

## Overview

Primero is a web application built and maintained by UNICEF that helps social workers manage case files for vulnerable children. It is a [Digital Public Good](https://www.digitalpublicgoods.net/r/primero). The backend is a **Ruby on Rails** API and the frontend is a **React/Redux** single-page application served via Webpack.

---

## Repository Layout

```
primero/
├── app/
│   ├── controllers/        # Rails API controllers
│   ├── models/             # ActiveRecord models
│   ├── services/           # Business-logic service objects
│   ├── javascript/         # React/Redux frontend (see below)
│   │   ├── components/     # React components (feature folders)
│   │   ├── libs/           # Shared JS utilities
│   │   └── packs/          # Webpack entry points
│   └── views/              # Minimal Rails view templates
├── config/                 # Rails configuration & YAML configs
├── db/                     # Migrations and seeds
├── doc/                    # Developer documentation
├── docker/                 # Docker/Compose files for local dev
├── spec/                   # RSpec tests (mirrors app/ structure)
├── ansible/                # Production deployment playbooks
└── .github/                # CI workflows (GitHub Actions)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language (backend) | Ruby `3.3.x` (see `.ruby-version`) |
| Framework (backend) | Ruby on Rails (API mode) |
| Language (frontend) | JavaScript / React 18 |
| Node version | Node `22.x` (see `.nvmrc`) |
| Database | PostgreSQL (14 or 15) |
| Search | Apache Solr (optional; required for FTR/GBV/KPI) |
| Auth | Devise + JWT |
| Tests (backend) | RSpec |
| Tests (frontend) | Jest |
| Linter (backend) | RuboCop (`.rubocop.yml`) |
| Linter (frontend) | ESLint (`.eslintrc.js`) |
| Bundler | Bundler (Ruby), npm (JS) |

---

## Getting Started (Development)

Full setup instructions: [`doc/getting_started_development.md`](doc/getting_started_development.md)

Quick reference:

```bash
# Copy sample config files
cp config/database.yml.development config/database.yml
cp config/locales.yml.development  config/locales.yml
cp config/mailers.yml.development  config/mailers.yml

# Install dependencies
bundle install
npm ci

# Start Docker services (Postgres, optionally Solr)
cd docker && sudo ./build.sh postgres solr
sudo ./compose.local.sh up -d postgres
cd ..

# Prepare the database
rails db:create db:migrate db:seed
RAILS_ENV=test rails db:migrate
rails primero:i18n_js

# Set required secret environment variables (add to ~/.bashrc)
for v in PRIMERO_SECRET_KEY_BASE DEVISE_SECRET_KEY DEVISE_JWT_SECRET_KEY; do
  echo "export ${v}=$(openssl rand -hex 16)" >> ~/.bashrc
done

# Run the servers (two terminals)
rails s            # backend on :3000
npm run dev        # webpack dev server

# Default login: primero / primer0!
```

---

## Running Tests

### Backend (RSpec)
```bash
rspec spec
# Single file:
rspec spec/models/child_spec.rb
```

### Frontend (Jest)
```bash
npm run test
# Single file:
npx jest app/javascript/components/MyComponent
```

---

## Running Linters

### Ruby – RuboCop
```bash
# All files under app/
rubocop -c .rubocop.yml app

# Auto-fix a single file
rubocop -c .rubocop.yml -A path/to/file.rb

# Only files changed on your branch
git diff --cached origin/develop --name-only | grep '\.rb$' | grep -wv 'db/*' | xargs rubocop -c .rubocop.yml
```

### JavaScript – ESLint
```bash
npm run lint
```

Linting is **enforced** for all files under `app/`. Fix all linting errors before opening a pull request.

---

## Branching & Pull Requests

- Target the **`develop`** branch for new features and bug fixes.
- Create a feature branch from `develop`:
  ```bash
  git checkout develop
  git checkout -b <issue_number>_short_description
  ```
- All RSpec tests must pass before opening a PR.
- See [`CONTRIBUTING.md`](CONTRIBUTING.md) for full contribution guidelines.

---

## Key Documentation

| Document | Purpose |
|----------|---------|
| [`doc/getting_started_development.md`](doc/getting_started_development.md) | Full local development setup |
| [`doc/ui_ux.md`](doc/ui_ux.md) | Frontend UI/UX conventions |
| [`doc/api.md`](doc/api.md) | REST API documentation |
| [`doc/webhooks.md`](doc/webhooks.md) | Webhook integration guide |
| [`doc/transifex.md`](doc/transifex.md) | i18n / translation workflow |
| [`ansible/README.md`](ansible/README.md) | Production deployment (Ansible) |
| [`docker/README.md`](docker/README.md) | Docker setup details |
| [`spec/README.md`](spec/README.md) | Test-suite conventions |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution guidelines |

---

## Important Conventions

- **Backend**: Follow Rails conventions. Services live in `app/services/`. Complex business logic should not live in controllers or models.
- **Frontend**: Each UI feature has its own folder under `app/javascript/components/`. Shared utilities go in `app/javascript/libs/`. Use the existing Redux store patterns.
- **i18n**: All user-facing strings must use the i18n helpers. Run `rails primero:i18n_js` after adding new locale keys.
- **Migrations**: Always provide a `down` method. Run `RAILS_ENV=test rails db:migrate` after adding migrations.
- **Secrets**: Never commit secrets. Use environment variables (see setup above).

---

## CI / Build Pipelines

CI runs on GitHub Actions (`.github/workflows/`). The main workflow is `app.yml`. It runs RSpec and Jest tests. Ensure both test suites pass locally before pushing.

---

## Known Issues / Workarounds

- Several npm packages emit `requires a peer of` warnings. These are known and harmless (e.g. `mui-datatables` is behind on dependencies; `jsdom` requires `canvas` which is mocked).
- Solr is **disabled by default** but required for FTR, GBV and KPI features. Set `SOLR_ENABLED=true` and start the `solr` container to enable it.
- PostgreSQL 14 is the current default; PostgreSQL 15 is supported. PostgreSQL 10/11 are no longer supported. See [`doc/postgres_upgrade.md`](doc/postgres_upgrade.md) for upgrade guidance.
