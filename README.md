# Sabor & Receita

Aplicação web para explorar um catálogo de receitas culinárias com destaque na página inicial, busca por título e filtro por categoria.

Projeto desenvolvido em React para apresentação da disciplina de Web Development: Framework.

## Preview das funcionalidades

- Catálogo de receitas com cards visuais
- Busca por título em tempo real
- Filtro por categoria
- Página de detalhe de cada receita com informações do chef
- Layout responsivo com identidade visual própria

## Tecnologias utilizadas

- React
- React Router DOM
- CSS (arquivos por componente/página)
- Create React App (react-scripts)

## Como rodar localmente

Pré-requisito: Node.js e npm instalados.

1. Entre na pasta do projeto

2. Instale as dependências

	npm install

3. Rode o servidor de desenvolvimento

	npm start

4. Acesse no navegador: http://localhost:3000

## Estrutura do projeto

```
Sabor_Receita/
├── public/
│   ├── images/          # Imagens públicas das receitas
│   ├── index.html       # HTML base da aplicação
│   └── robots.txt
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── Header.js / Header.css
│   │   ├── Footer.js / Footer.css
│   │   ├── Layout.js / Layout.css
│   │   └── RecipeCard.js / RecipeCard.css
│   ├── data/
│   │   └── recipes.js   # Base local de receitas
│   ├── pages/           # Páginas da aplicação
│   │   ├── Home.js / Home.css
│   │   ├── Recipes.js / Recipes.css
│   │   └── RecipeDetail.js / RecipeDetail.css
│   ├── styles/
│   │   └── global.css   # Estilos globais
│   ├── App.js           # Configuração de rotas
│   └── index.js         # Ponto de entrada
├── package.json
└── README.md
```

## Professora

Lisiane Reips — Disciplina de Web Development: Framework