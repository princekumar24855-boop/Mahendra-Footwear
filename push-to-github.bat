@echo off
echo =============================================
echo  Mahendra Footwear - GitHub Push Script
echo =============================================
cd /d "c:\Users\pprin\OneDrive\Desktop\mahendrafootwear"

git init
git add .
git commit -m "Mahendra Footwear - Complete E-commerce Website with Firebase"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/princekumar24855-boop/Mahendra-Footwear.git
git push -u origin main

echo.
echo =============================================
echo  Done! Code pushed to GitHub successfully!
echo =============================================
pause
