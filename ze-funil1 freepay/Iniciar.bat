@echo off
title Ze Delivery - Servidor PIX
echo.
echo  ===================================
echo    Ze Delivery - Iniciando...
echo  ===================================
echo.

cd /d "%~dp0"

:: Tenta encontrar o node.exe nos caminhos mais comuns
set NODE_EXE=
if exist "C:\Program Files\nodejs\node.exe"      set NODE_EXE=C:\Program Files\nodejs\node.exe
if exist "C:\Program Files (x86)\nodejs\node.exe" set NODE_EXE=C:\Program Files (x86)\nodejs\node.exe

:: Se nao achou pelo caminho fixo, tenta pelo PATH normal
if "%NODE_EXE%"=="" (
    where node.exe >nul 2>&1
    if %errorlevel%==0 set NODE_EXE=node.exe
)

if "%NODE_EXE%"=="" (
    echo  ERRO: Node.js nao foi encontrado no computador.
    echo.
    echo  Instale em: https://nodejs.org  (versao LTS)
    echo.
    pause
    exit /b 1
)

echo  Node.js encontrado. Iniciando servidor...
echo.

:: Abre o navegador apos 3 segundos (tempo para o servidor subir)
start "" cmd /c "ping -n 4 127.0.0.1 >nul && start http://localhost:3000"

:: Inicia o servidor (fica rodando aqui)
"%NODE_EXE%" server.js

echo.
echo  Servidor encerrado.
pause
