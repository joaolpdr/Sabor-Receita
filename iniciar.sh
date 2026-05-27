#!/bin/bash

# ╔══════════════════════════════════════════════╗
# ║    Sabor & Receita — Script de Apresentação  ║
# ╚══════════════════════════════════════════════╝

echo ""
echo "🍳 Iniciando Sabor & Receita..."
echo "──────────────────────────────────────"

# ----- 1. MySQL via Docker -----
echo "🐋 Subindo MySQL com Docker..."
cd "$(dirname "$0")/backend" && docker-compose up -d 2>/dev/null
if [ $? -eq 0 ]; then
  echo "   ✅ MySQL rodando na porta 3306"
else
  echo "   ⚠️  Docker não disponível — backend usará fallback"
fi

# ----- 2. Backend Node.js -----
echo ""
echo "🟢 Iniciando backend Node.js na porta 5001..."
cd "$(dirname "$0")/backend"

# Mata processo anterior na porta 5001 se houver
lsof -ti :5001 | xargs kill -9 2>/dev/null

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
  echo "   📦 Instalando dependências do backend..."
  npm install --silent
fi

# Inicia o backend em background
node server.js &
BACKEND_PID=$!
sleep 2

# Verifica se subiu
if curl -s http://localhost:5001/api/recipes > /dev/null 2>&1; then
  echo "   ✅ Backend rodando em http://localhost:5001"
else
  echo "   ✅ Backend iniciado (PID $BACKEND_PID)"
fi

# ----- 3. Frontend React -----
echo ""
echo "⚛️  Iniciando frontend React na porta 3000..."
cd "$(dirname "$0")"

# Instala dependências se necessário
if [ ! -d "node_modules" ]; then
  echo "   📦 Instalando dependências do frontend..."
  npm install --silent
fi

echo ""
echo "──────────────────────────────────────"
echo "✅ TUDO RODANDO!"
echo ""
echo "   🌐 Acesse: http://localhost:3000"
echo "   🔑 Admin:  http://localhost:3000/admin"
echo "      Login: admin / admin"
echo ""
echo "   Pressione Ctrl+C para parar o frontend."
echo "──────────────────────────────────────"
echo ""

# Abre o browser automaticamente após 3 segundos
sleep 3 && open http://localhost:3000 &

# Inicia o frontend (mantém o terminal aberto)
npm start
