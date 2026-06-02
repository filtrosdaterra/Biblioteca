// db.js
const STORAGE_KEY = 'readify_livros';
const PERFIL_KEY = 'readify_perfil';
const LEITURA_ATUAL_KEY = 'readify_leituraAtualId';

const DB_NAME = 'ReadifyDB';
const STORE_NAME = 'pdfs';
let db = null;

// Abrir IndexedDB
function abrirIndexedDB() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) {
            resolve(db);
            return;
        }
        const request = indexedDB.open(DB_NAME, 2);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

// Salvar PDF (blob) associado ao livro.id
async function salvarPDF(id, file) {
    try {
        const db = await abrirIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.put(file, id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Erro ao salvar PDF:', error);
        return false;
    }
}

// Carregar PDF
async function carregarPDF(id) {
    try {
        const db = await abrirIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        return null;
    }
}

// Remover PDF
async function removerPDF(id) {
    try {
        const db = await abrirIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        return false;
    }
}

// --- Perfil do usuário ---
function getPerfil() {
    const perfil = localStorage.getItem(PERFIL_KEY);
    if (perfil) return JSON.parse(perfil);
    return {
        nome: 'Filipe Leitor',
        bio: '📚 Amante de livros e leitor ávido. Sempre em busca de novas histórias.',
        fotoUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
    };
}

function salvarPerfil(perfil) {
    localStorage.setItem(PERFIL_KEY, JSON.stringify(perfil));
}

// --- Livros (localStorage) ---
function getLivros() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function saveLivros(livros) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
}

async function adicionarLivro(livro, pdfFile = null) {
    const livros = getLivros();
    livro.id = Date.now().toString();
    livro.dataAdicao = new Date().toISOString();
    livro.favorito = livro.favorito || false;
    livro.progressoPagina = livro.progressoPagina || 0;
    livro.totalPaginas = livro.totalPaginas || 0;
    livro.avaliacao = livro.avaliacao || 0;
    livro.comentario = livro.comentario || '';
    livros.push(livro);
    saveLivros(livros);
    
    if (pdfFile) {
        await salvarPDF(livro.id, pdfFile);
    }
    return livro.id;
}

async function atualizarLivro(id, novosDados, novoPdfFile = null) {
    const livros = getLivros();
    const index = livros.findIndex(l => l.id == id);
    if (index !== -1) {
        livros[index] = { ...livros[index], ...novosDados };
        saveLivros(livros);
        if (novoPdfFile) {
            await salvarPDF(id, novoPdfFile);
        }
        return true;
    }
    return false;
}

async function removerLivro(id) {
    let livros = getLivros();
    livros = livros.filter(l => l.id != id);
    saveLivros(livros);
    if (getLeituraAtualId() == id) {
        localStorage.removeItem(LEITURA_ATUAL_KEY);
    }
    await removerPDF(id);
}

function getLeituraAtualId() {
    return localStorage.getItem(LEITURA_ATUAL_KEY);
}

function setLeituraAtualId(id) {
    if (id) localStorage.setItem(LEITURA_ATUAL_KEY, id);
    else localStorage.removeItem(LEITURA_ATUAL_KEY);
}

function getLeituraAtual() {
    const id = getLeituraAtualId();
    if (!id) return null;
    return getLivros().find(l => l.id == id) || null;
}

function getFavoritos() {
    return getLivros().filter(l => l.favorito === true);
}

// Dados iniciais
async function inicializarDadosExemplo() {
    if (getLivros().length === 0) {
        const exemplos = [
            { titulo: "Textos cruéis demais para serem lidos rapidamente", autor: "Igor Pires", ano: "2020", categoria: "Poesia", capaUrl: "https://m.media-amazon.com/images/I/61mzLkXJdXL._SY466_.jpg", avaliacao: 4, comentario: "Intenso e profundo. Cada poema toca a alma.", favorito: true, totalPaginas: 120, progressoPagina: 90 },
            { titulo: "A Empregada", autor: "Freida McFadden", ano: "2022", categoria: "Suspense", capaUrl: "https://m.media-amazon.com/images/I/41ziC4vXKBL._SY445_SX342_ML2_.jpg", avaliacao: 5, comentario: "Muito suspense, leitura viciante!", favorito: false, totalPaginas: 280, progressoPagina: 0 },
            { titulo: "É Assim que Acaba", autor: "Colleen Hoover", ano: "2016", categoria: "Romance", capaUrl: "https://m.media-amazon.com/images/I/91r5G8RxqfL.jpg", avaliacao: 3, comentario: "História emocionante, mas um pouco arrastada.", favorito: false, totalPaginas: 368, progressoPagina: 368 }
        ];
        for (const l of exemplos) {
            await adicionarLivro(l);
        }
        const todos = getLivros();
        if (todos.length) setLeituraAtualId(todos[0].id);
    }
}

inicializarDadosExemplo();