# Quick Start for Windows

## Setup and Run

### Option 1: Using Two Terminal Windows

**Terminal 1 - Backend:**
```cmd
cd backend
npm install
npm run seed
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm install
npm run dev
```

### Option 2: Using PowerShell Script

Save this as `start.ps1`:

```powershell
Write-Host "🚀 Mini Support Desk - Quick Start" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Backend
Write-Host "`n📦 Setting up backend..." -ForegroundColor Cyan
Set-Location backend
npm install
npm run seed
Start-Process npm -ArgumentList "run", "dev" -NoNewWindow
Set-Location ..

Start-Sleep -Seconds 3

# Frontend
Write-Host "`n📦 Setting up frontend..." -ForegroundColor Cyan
Set-Location frontend
npm install
Start-Process npm -ArgumentList "run", "dev" -NoNewWindow
Set-Location ..

Write-Host "`n✨ Application is starting!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to stop servers`n" -ForegroundColor Gray
```

Run: `powershell -ExecutionPolicy Bypass -File start.ps1`

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api
