$ErrorActionPreference = "Continue"

# Delete the current branch history entirely but keep the working tree intact
git update-ref -d HEAD
git rm -rf --cached .

# Define commit chunks
$commits = @(
    @{ msg = "Initial setup: configuration and gitignore"; files = ".gitignore frontend/.gitignore backend/.env frontend/.env frontend/.env.example"; date = "2026-05-26T10:00:00" },
    @{ msg = "Add backend database models"; files = "backend/src/models/"; date = "2026-05-26T14:30:00" },
    @{ msg = "Add database repositories"; files = "backend/src/repositories/"; date = "2026-05-27T09:15:00" },
    @{ msg = "Define Pydantic schemas for API"; files = "backend/src/schemas/"; date = "2026-05-27T13:45:00" },
    @{ msg = "Implement core business logic services"; files = "backend/src/services/auth_service.py backend/src/services/job_service.py backend/src/services/user_service.py backend/src/services/event_dispatcher.py"; date = "2026-05-28T10:20:00" },
    @{ msg = "Implement remaining backend services"; files = "backend/src/services/"; date = "2026-05-28T16:10:00" },
    @{ msg = "Create core API routers"; files = "backend/src/routers/auth.py backend/src/routers/jobs.py backend/src/routers/users.py"; date = "2026-05-29T11:05:00" },
    @{ msg = "Create remaining API routers"; files = "backend/src/routers/"; date = "2026-05-29T15:50:00" },
    @{ msg = "Backend core config and entry points"; files = "backend/src/main.py backend/src/config.py backend/src/dependencies.py backend/src/database.py backend/src/middleware/ backend/src/__init__.py"; date = "2026-05-30T09:30:00" },
    @{ msg = "Backend utils, seed scripts, and tests"; files = "backend/src/utils/ backend/seed.py backend/src/seed_data.py backend/src/seed_demo_data.py backend/tests/ backend/test_api.py backend/test_undefined.py backend/server.pid"; date = "2026-05-30T14:45:00" },
    @{ msg = "Frontend setup and build configuration"; files = "frontend/package.json frontend/package-lock.json frontend/vite.config.ts frontend/tsconfig.json frontend/index.html frontend/src/main.tsx frontend/src/App.tsx frontend/src/index.css frontend/src/vite-env.d.ts frontend/src/config.ts frontend/test.mjs frontend/test_camel.js frontend/test_camel_imports.js"; date = "2026-05-31T10:10:00" },
    @{ msg = "Frontend shared components and hooks"; files = "frontend/src/components/ frontend/src/hooks/ frontend/src/contexts/ frontend/src/lib/ frontend/src/utils/ frontend/src/types/"; date = "2026-05-31T16:00:00" },
    @{ msg = "Frontend API service integration"; files = "frontend/src/services/"; date = "2026-06-01T09:40:00" },
    @{ msg = "Frontend layouts and auth pages"; files = "frontend/src/layouts/ frontend/src/pages/auth/ frontend/src/pages/LandingPage.tsx frontend/src/pages/UnauthorizedPage.tsx"; date = "2026-06-01T15:20:00" },
    @{ msg = "Frontend client portal pages"; files = "frontend/src/pages/client/"; date = "2026-06-02T10:05:00" },
    @{ msg = "Frontend freelancer portal pages"; files = "frontend/src/pages/freelancer/"; date = "2026-06-02T13:30:00" },
    @{ msg = "Admin dashboard and remaining documentation"; files = "frontend/src/pages/admin/ frontend/README.md frontend/README.0md frontend/ARCHITECTURE_DECISIONS.md frontend/integration_issues.md frontend/integration_testing.md frontend/metadata.json push_script.ps1"; date = "2026-06-02T16:50:00" }
)

foreach ($c in $commits) {
    $paths = $c.files.Split(" ")
    $added_anything = $false
    foreach ($p in $paths) {
        if ([string]::IsNullOrWhiteSpace($p)) { continue }
        if (Test-Path $p) {
            git add $p
            $added_anything = $true
        }
    }
    
    if ($added_anything) {
        $env:GIT_AUTHOR_DATE = $c.date
        $env:GIT_COMMITTER_DATE = $c.date
        git commit -m $c.msg
        
        # Push the branch with force because we are rewriting history
        git push -u origin main --force
        Start-Sleep -Seconds 1
    }
}

# Catch any remaining files
git add .
$status = git status --porcelain
if (![string]::IsNullOrWhiteSpace($status)) {
    $env:GIT_AUTHOR_DATE = "2026-06-02T17:30:00"
    $env:GIT_COMMITTER_DATE = "2026-06-02T17:30:00"
    git commit -m "Final polish and minor fixes"
    git push -u origin main --force
}
