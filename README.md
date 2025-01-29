# Image Blur App

Uma aplicação web para aplicar efeitos de desfoque em imagens de forma fácil e rápida.

## 🌟 Funcionalidades

- ✨ Upload de imagens por drag-and-drop ou seleção de arquivo
- 🎚️ Ajuste do nível de desfoque em tempo real
- 🖼️ Visualização em tela cheia
- 💾 Download da imagem processada
- 🔄 Opção para redefinir e trocar imagem
- 📱 Interface responsiva para desktop e mobile

## 🚀 Demo

A aplicação está disponível em:
- Frontend: [https://image-blur-app.netlify.app](https://image-blur-app.netlify.app)
- Backend: [https://image-blur-app.onrender.com](https://image-blur-app.onrender.com)

## 🛠️ Tecnologias Utilizadas

### Backend
- Python 3.9
- Flask (Framework web)
- Pillow (Processamento de imagens)
- Flask-CORS (Suporte a CORS)
- Gunicorn (Servidor WSGI)

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome (Ícones)

## 📦 Instalação e Execução Local

### Backend

1. Clone o repositório:
```bash
git clone https://github.com/wemysson/image-blur-app.git
cd image-blur-app
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python app.py
```

O backend estará disponível em `http://localhost:5000`

### Frontend

1. Navegue até a pasta frontend:
```bash
cd frontend
```

2. Abra o arquivo `index.html` em seu navegador ou use um servidor local como o Live Server do VS Code.

## 🔧 Configuração

### Variáveis de Ambiente
- `PORT`: Porta do servidor (padrão: 5000)
- `PYTHON_VERSION`: Versão do Python (3.9.18)
- `PYTHONUNBUFFERED`: Configuração para logs (true)

## 📝 Uso

1. Acesse a aplicação pelo navegador
2. Arraste uma imagem ou clique para selecionar
3. Use o slider para ajustar o nível de desfoque
4. Clique no ícone no canto inferior direito para tela cheia (Esc para sair)
5. Use os botões para baixar, redefinir ou trocar a imagem

## ⚡ Performance

- Cache de imagens processadas
- Redimensionamento automático de imagens grandes
- Debounce no slider de desfoque
- Compressão otimizada de JPEG

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Wemysson Rodrigues

