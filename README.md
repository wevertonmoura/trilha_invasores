# 🌲 Trilha dos Invasores - Sistema de Gestão de Inscrições

Este é um projeto de alta performance desenvolvido para o **Grupo Invasores**, focado na gestão de inscrições para eventos de ecoturismo. O sistema prioriza uma experiência de usuário fluida ("nível Apple") e um controle rigoroso de escassez de vagas.

## 🚀 Tecnologias Utilizadas

* **Frontend:** Next.js (App Router) com TypeScript.
* **Estilização:** Tailwind CSS com animações customizadas.
* **Backend:** Supabase (PostgreSQL + Realtime).
* **Validação:** Zod (Esquemas de dados rigorosos).
* **Deploy:** Vercel com CI/CD.

## 🛠️ Funcionalidades Principais

* **Splash Screen Inteligente:** Animação de entrada que utiliza `sessionStorage` para ser exibida apenas uma vez por sessão.
* **Controle Dinâmico de Vagas:** Bloqueio automático do formulário de inscrição assim que o limite de 30 vagas é atingido.
* **Proteção de Rota:** Verificação no lado do cliente que impede acessos diretos à página de inscrição se as vagas estiverem esgotadas.
* **UX Otimizada:** Máscaras de entrada para telefones e feedback visual de erros em tempo real.
* **Painel Administrativo:** Área restrita para visualização da lista oficial de participantes.

## 📦 Estrutura do Projeto

* `/app`: Rotas e lógica de páginas.
* `/components`: Componentes modulares (Header, Footer, Botões).
* `/public`: Ativos visuais (Logos e imagens de fundo otimizadas).
* `/lib`: Configuração do cliente Supabase.

## 🔧 Configuração e Deploy

Para rodar este projeto localmente ou fazer manutenção:

1.  Clone o repositório: `git clone https://github.com/wevertonmoura/trilha_invasores.git`
2.  Instale as dependências: `npm install`
3.  Configure as variáveis de ambiente no arquivo `.env.local`:
    * `NEXT_PUBLIC_SUPABASE_URL`
    * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  Suba as alterações para o GitHub para deploy automático na Vercel.

## 📅 Evento
* **Destino:** Cachoeira do Brennand.
* **Data:** 18 de Janeiro de 2026.