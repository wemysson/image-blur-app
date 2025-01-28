# Aplicativo de Desfoque de Imagem

Este é um aplicativo web que permite aos usuários fazer upload de imagens e aplicar efeitos de desfoque em tempo real.

## Estrutura do Projeto

```
image-blur-app/
├── frontend/           # Código do frontend para o Netlify
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── config.js
│   │   └── main.js
│   ├── index.html
│   └── netlify.toml
├── app.py             # Versão local do backend
├── app_prod.py        # Versão de produção do backend
├── requirements.txt   # Dependências para desenvolvimento
└── requirements_prod.txt  # Dependências para produção
```

## Como Publicar

### Frontend (Netlify)

1. Faça login no [Netlify](https://app.netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Faça upload da pasta `frontend/`
4. Aguarde o deploy

### Backend (Heroku ou similar)

1. Crie uma conta no [Heroku](https://heroku.com) ou plataforma similar
2. Crie um novo aplicativo
3. Faça deploy do arquivo `app_prod.py` e `requirements_prod.txt`
4. Copie a URL do backend
5. Atualize a URL no arquivo `frontend/js/config.js`

## Desenvolvimento Local

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Execute o servidor local:
```bash
python app.py
```

3. Acesse http://localhost:5000

## Funcionalidades

- Upload de imagem por arraste ou seleção
- Ajuste de desfoque em tempo real
- Visualização em tela cheia
- Download da imagem processada
