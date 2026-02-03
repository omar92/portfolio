@echo off
setlocal
set "ROOT=%~dp0..\.."
pushd "%ROOT%"

set "VITE_BASE=/"
set "VITE_OUT_DIR=docs-local"

call npm run build
if errorlevel 1 (
  echo Build failed.
  popd
  exit /b 1
)

pushd "%ROOT%\docs-local"
python -m http.server 8001
popd

popd
endlocal
