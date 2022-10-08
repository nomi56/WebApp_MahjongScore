call npm run build

cd /d %~dp0

rmdir /S /Q .\docs
move .\build .\docs

