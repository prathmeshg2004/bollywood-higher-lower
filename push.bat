@echo off
set /p commit_message="Enter commit message (or press enter for 'Auto-update'): "
if "%commit_message%"=="" set commit_message="Auto-update"

git add .
git commit -m "%commit_message%"
git push

echo.
echo ==========================================
echo Code successfully updated on GitHub!
echo ==========================================
pause
