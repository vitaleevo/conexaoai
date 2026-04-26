# Deployment Workflow

## Source of truth

The only valid deployment source is GitHub.

- Frontend changes must be committed and pushed to GitHub.
- Backend changes must be committed and pushed to GitHub.
- Cloudflare Workers must deploy the frontend from the validated GitHub revision.
- Railway must deploy from the GitHub-connected backend project.
- Do not use manual file edits in Cloudflare or Railway as a release process.
- Do not use local-only changes as production changes.

## Required operational flow

1. Create a branch from `main`.
2. Make the frontend and/or backend changes locally.
3. Run local validation before pushing.
4. Push the branch to GitHub.
5. Open a Pull Request to `main`.
6. Wait for GitHub Actions to pass.
7. Merge into `main`.
8. Deploy the frontend with Cloudflare CLI from the validated commit and let Railway deploy the backend from GitHub.

## Local validation

### Frontend

```bash
cd frontend
npm ci
npm run lint
npm run build
npm run preview
```

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py check
```

## GitHub requirements

Configure these repository rules in GitHub:

- Protect the `main` branch.
- Require pull requests before merge.
- Require the `CI` workflow to pass before merge.
- Restrict direct pushes to `main`.

## Cloudflare requirements

- Authenticate with `wrangler login`.
- Keep frontend runtime variables in Cloudflare Worker secrets/settings.
- Use `npm run deploy` from `frontend` after the target commit is in GitHub.
- Keep `wrangler.jsonc` versioned with the app.

## Railway requirements

- Connect the backend service to the GitHub repository.
- Set automatic deploys from `main`.
- Keep runtime environment variables only in Railway service settings.
- Do not treat manual redeploy clicks as the release source; the source must remain the GitHub commit on `main`.

## Release rule

Production is updated only after:

- code exists in GitHub,
- CI passes,
- code is merged to `main`,
- Cloudflare deploy is run from that GitHub revision,
- Railway picks up that GitHub revision automatically.
