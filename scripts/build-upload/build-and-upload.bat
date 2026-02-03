@echo off
setlocal
set "ROOT=%~dp0..\.."
pushd "%ROOT%"

call npm run build
if errorlevel 1 (
  echo Build failed.
  popd
  exit /b 1
)

git add src\data\portfolio.json docs

echo.
set /p COMMIT_MSG=Commit message (leave blank for default): 
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update site"

git commit -m "%COMMIT_MSG%"
if errorlevel 1 (
  echo Commit failed (maybe no changes).
)

git push
if errorlevel 1 (
  echo Push failed.
  popd
  exit /b 1
)

popd
endlocal
