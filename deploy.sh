#!/bin/bash
# 1. Atualizar repositório
log "Executando git fetch..."
git fetch || { log "Erro no git fetch"; exit 1; }

log "Executando git reset..."
git reset --hard origin/main || { log "Erro no git reset"; exit 1; }

# 2. Instalar dependências
log "Executando npm install..."
npm install || { log "Erro no npm install"; exit 1; }

# 3. Build e migrações
log "Executando npm run deploy..."
npm run build || { log "Erro no npm run build"; exit 1; }

log "Deploy concluído com sucesso!"
exit 0