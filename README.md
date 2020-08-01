
<h1 align="center">
  <br/>
  <img src="https://user-images.githubusercontent.com/55251721/78802105-ca55de80-7993-11ea-9187-3a97342a8dfb.png" width=80 />
  <br/>
  NoteList
</h1>
<h2 align="center">
  Aplicação para salvar anotações <br/>
  <br/>
  <a href="https://github.com/rafaelnrabelo/NoteList-Web#testando">
    <img src="https://img.shields.io/badge/Testing-Install-%23DA552F" alt="testing"/>
  </a>
  <a href="https://github.com/rafaelnrabelo/NoteList-Web/releases/latest">
    <img src="https://img.shields.io/badge/Last%20Release-2.1.1-%23DA552F" alt="release"/>
  </a>
  <br/>
  <br/>
  <img src="https://user-images.githubusercontent.com/55251721/87205886-d7f66980-c2de-11ea-8c30-c469dbbf911f.png" />
</h2>

## Features
  - Login com Facebook.
  - Sincronização das notas em nuvem.
  - Tema Dark e Light.
  - Lista de Tarefas.
  - Cadastro de anotações.
  - Editar anotação.
  - Apagar anotação.
  
#### Dependências do Front-end
  - ReactJS
  - React Icons
  - Axios
  - React-Facebook-Login
  - Material-ui
    
   
## Testando:
   1. Clone o repositorio usando `git clone https://github.com/rafaelnrabelo/NoteList-Web.git`
   2. Mova para a pasta clonada usando `cd NoteList`
   
  #### Web
  Abra o <a href="https://notelistweb.netlify.app">
    Site
    </a> ou siga os passos abaixo para rodar sua propria aplicação.
   1. Instale todas dependecias usando `yarn install`
   2. Adicione a url de conexão do backend no campo `API_URL` no arquivo `.env.json` na pasta `src`
   3. Adicione o ID do seu app do Facebook no campo `FACEBOOK_ID` no arquivo `.env.json` na pasta `src`
   4. Execute `yarn start` para iniciar a aplicação web.
