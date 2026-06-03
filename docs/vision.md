# **READIFY: DOCUMENTO DE VISÃO**

---

## 1. Visão Geral do Sistema

O **Readify** é uma aplicação web voltada para o gerenciamento pessoal de leitura, funcionando como uma biblioteca digital individual. O sistema permite que usuários registrem livros, acompanhem seu progresso de leitura, realizem avaliações e armazenem conteúdos para consulta futura.

O principal objetivo do projeto é fornecer uma solução simples, intuitiva e acessível para organização de leituras, promovendo maior controle e engajamento com o hábito de leitura.

---

## 2. Problema e Motivação

Atualmente, muitos leitores não possuem uma ferramenta centralizada para:

* Organizar livros lidos e não lidos
* Acompanhar progresso de leitura
* Registrar opiniões e avaliações
* Acessar conteúdos digitais de forma prática

O Readify surge como uma solução para esse problema, oferecendo um ambiente unificado onde todas essas funcionalidades estão integradas.

---

## 3. Objetivos do Sistema

### 3.1 Objetivo Geral

Desenvolver uma aplicação funcional para gerenciamento de leitura pessoal.

### 3.2 Objetivos Específicos

* Permitir cadastro e organização de livros
* Possibilitar acompanhamento do progresso de leitura
* Implementar sistema de avaliação e resenhas
* Disponibilizar leitura de arquivos PDF dentro da aplicação
* Criar uma interface simples e responsiva

---

## 4. Escopo do Produto

### 4.1 Funcionalidades Principais

* Cadastro de livros
* Listagem da biblioteca
* Sistema de favoritos
* Acompanhamento de leitura atual
* Leitor de PDF integrado
* Perfil do usuário com estatísticas

### 4.2 Funcionalidades Futuras (não implementadas)

* Sistema de login/autenticação
* Sincronização em nuvem
* Compartilhamento de livros
* Sistema de recomendações

---

## 5. Público-Alvo

O sistema é destinado a:

* Estudantes
* Leitores frequentes
* Usuários que desejam organizar leituras pessoais

---

## 6. Arquitetura do Sistema

O Readify segue uma arquitetura baseada em **frontend com persistência local**, sem utilização de servidor backend.

### 6.1 Camadas

* **Interface (Frontend):** HTML, CSS e JavaScript
* **Lógica de Aplicação:** manipulação de dados via JavaScript
* **Persistência de Dados:**

  * localStorage → dados dos livros
  * IndexedDB → armazenamento de PDFs

### 6.2 Fluxo de Funcionamento

1. O usuário interage com a interface
2. Os dados são processados via JavaScript
3. As informações são armazenadas localmente
4. O sistema recupera e exibe os dados dinamicamente

---

## 7. Tecnologias Utilizadas

### 7.1 Linguagens

* JavaScript
* HTML
* CSS

### 7.2 Bibliotecas

* PDF.js (renderização de arquivos PDF)
* Font Awesome (ícones)

### 7.3 Armazenamento

* localStorage
* IndexedDB

### 7.4 Justificativa das Escolhas

As tecnologias foram escolhidas visando:

* Simplicidade de implementação
* Independência de servidor
* Facilidade de execução em ambiente local

---

## 8. Organização da Equipe

### Vitória – Backend (Rotas da API – conceitual)

Responsável pela definição das rotas e estrutura lógica de comunicação do sistema.

### Filipe – Backend (Lógica e Banco de Dados)

Responsável pela implementação das funcionalidades principais, manipulação de dados e integração com armazenamento local.

### Taís – Integração Front-End + API

Responsável pela comunicação entre interface e lógica do sistema, além da exibição dinâmica dos dados.

### Tales – Testes e Organização

Responsável pela validação do sistema, testes de funcionalidades e organização do repositório.

---

## 9. Estrutura do Sistema

O sistema é composto por múltiplas telas, incluindo:

* Home
* Meus Livros
* Cadastro de Livros
* Detalhes do Livro
* Favoritos
* Perfil
* Leitor de PDF

Cada tela possui uma responsabilidade específica dentro do fluxo da aplicação.

---

## 10. Requisitos do Sistema

### 10.1 Requisitos Funcionais

* O sistema deve permitir cadastrar livros
* O sistema deve permitir visualizar livros cadastrados
* O sistema deve permitir atualizar progresso de leitura
* O sistema deve permitir favoritar livros
* O sistema deve permitir leitura de PDFs

### 10.2 Requisitos Não Funcionais

* Interface responsiva
* Boa usabilidade
* Execução em navegador web
* Persistência local de dados

---

## 11. Limitações do Sistema

* Não possui autenticação de usuários
* Dados não são sincronizados online
* Dependência do armazenamento local do navegador
* Não suporta múltiplos usuários

---

## 12. Considerações Finais

O Readify é um projeto educacional que aplica conceitos fundamentais de desenvolvimento de sistemas, incluindo organização de dados, construção de interfaces e manipulação de estados no frontend.

Apesar de suas limitações, o sistema cumpre seu propósito como um MVP funcional, demonstrando de forma prática a implementação de uma aplicação web completa sem dependência de backend.
