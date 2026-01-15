# ⚙️ Configurações Recomendadas - Vercel Dashboard

## 🎯 Configuração Inicial do Projeto

### Build & Development Settings

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Development Command: npm run dev
```

### Root Directory
```
./
```

## 🔐 Environment Variables

Vá em: **Settings** → **Environment Variables**

### Production, Preview, Development (todas)

```env
VITE_SUPABASE_PROJECT_ID
Value: olwqbdosvdzlhouadntr
Environments: ✓ Production ✓ Preview ✓ Development

VITE_SUPABASE_URL
Value: https://olwqbdosvdzlhouadntr.supabase.co
Environments: ✓ Production ✓ Preview ✓ Development

VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sd3FiZG9zdmR6bGhvdWFkbnRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzI0OTEsImV4cCI6MjA4NDAwODQ5MX0.G-SwrgZ_C5QWDWkY7unDaQsWkvZp2U_HGMFJJtaEKzY
Environments: ✓ Production ✓ Preview ✓ Development
```

⚠️ **Importante**: Marque todas as três opções (Production, Preview, Development) para cada variável.

## 🔄 Git Integration

### Recomendações

```
Production Branch: main (ou master)
✓ Automatic Deployments on Push
✓ Preview Deployments for Pull Requests
✓ Comments on Pull Requests
```

### Ignored Build Step (opcional)
Se quiser controlar quando fazer deploy:

```bash
# Só fazer deploy se houver mudanças em src/ ou package.json
git diff HEAD^ HEAD --quiet . ':!*.md' ':!*.txt'
```

## 🚀 Performance & Optimization

### Recomendações de Configuração

**Settings** → **Functions**
```
Function Region: Washington, D.C., USA (iad1)
(ou escolha a região mais próxima dos seus usuários)
```

**Settings** → **General**
```
Node.js Version: 18.x (ou 20.x)
```

## 🔒 Security Headers (opcional)

Adicione em `vercel.json` (já configurado):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 📊 Analytics & Monitoring

### Vercel Analytics (Recomendado)

**Settings** → **Analytics**
```
✓ Enable Web Analytics
✓ Enable Speed Insights
```

### Configuração no código (se ativar Analytics):

```bash
npm install @vercel/analytics
```

Em `src/main.tsx`:
```typescript
import { inject } from '@vercel/analytics';

inject();
```

## 🌍 Domains & HTTPS

### Domínio Customizado (opcional)

**Settings** → **Domains**
```
1. Adicione seu domínio
2. Configure DNS conforme instruções
3. HTTPS é automático (Let's Encrypt)
```

### Redirect Rules (se necessário)

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

## 🔔 Notifications

**Settings** → **Notifications**

Recomendado ativar:
```
✓ Deployment Failed
✓ Deployment Ready (opcional)
✓ Comments on Pull Requests
```

## 🔐 Security

### Recomendações

**Settings** → **Security**
```
✓ Deployment Protection (para produção)
✓ Vercel Authentication (se projeto privado)
```

### Password Protection (opcional)
Para proteger preview deployments:
```
Settings → Deployment Protection
→ Password Protection
```

## 📈 Logs & Monitoring

### Acessar Logs

```
Dashboard → Deployments → [Selecione deployment] → Logs
```

### Configurar Alertas

```
Settings → Integrations
→ Adicione integração com Slack/Discord para alertas
```

## ⚡ Edge Config (Avançado)

Para configurações dinâmicas sem redeploy:

```
Dashboard → Storage → Edge Config
→ Create Edge Config
```

## 🎨 Open Graph Images

Para preview em redes sociais, adicione em `index.html`:

```html
<meta property="og:title" content="Cadastro de Clientes" />
<meta property="og:description" content="Sistema de gestão de clientes" />
<meta property="og:image" content="/og-image.png" />
```

## 📝 Checklist Final

Antes do primeiro deploy:

- [ ] Variáveis de ambiente configuradas
- [ ] Branch de produção definida
- [ ] Auto-deploy ativado
- [ ] Preview deployments ativados
- [ ] Analytics ativado (opcional)
- [ ] Domínio configurado (opcional)
- [ ] Notificações configuradas
- [ ] Security headers verificados

## 🔗 Links Úteis

- Dashboard: https://vercel.com/dashboard
- Documentação: https://vercel.com/docs
- Status: https://www.vercel-status.com/
- Community: https://github.com/vercel/vercel/discussions

---

**Última atualização**: 2026-01-15
