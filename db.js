// db.js
const STORAGE_KEY = 'readify_livros';
const LEITURA_ATUAL_KEY = 'readify_leituraAtualId';
const PERFIL_KEY = 'readify_perfil';

// ========== LIVROS (localStorage) ==========
function getLivros() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function saveLivros(livros) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(livros));
}

function adicionarLivro(livro) {
    const livros = getLivros();
    livro.id = Date.now().toString();
    livro.dataAdicao = new Date().toISOString();
    livro.favorito = livro.favorito || false;
    livro.progresso = livro.progresso || 0;
    livro.progressoPagina = livro.progressoPagina || 0;
    livro.totalPaginas = livro.totalPaginas || 0;
    livro.avaliacao = livro.avaliacao || 0;
    livro.comentario = livro.comentario || '';
    livros.push(livro);
    saveLivros(livros);
    return livro.id;
}

function atualizarLivro(id, novosDados) {
    const livros = getLivros();
    const index = livros.findIndex(l => l.id == id);
    if (index !== -1) {
        livros[index] = { ...livros[index], ...novosDados };
        saveLivros(livros);
        return true;
    }
    return false;
}

function removerLivro(id) {
    let livros = getLivros();
    livros = livros.filter(l => l.id != id);
    saveLivros(livros);
    if (getLeituraAtualId() == id) {
        localStorage.removeItem(LEITURA_ATUAL_KEY);
    }
    removerPDF(id);
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

// ========== PERFIL (localStorage) ==========
function getPerfil() {
    const padrao = {
        nome: 'Filipe Jorge',
        bio: 'Apaixonado por livros e tecnologia 📚',
        fotoUrl: 'https://scontent-for2-2.cdninstagram.com/v/t51.82787-19/709092560_18094208231464344_3844619437791965228_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-for2-2.cdninstagram.com&_nc_cat=100&_nc_oc=Q6cZ2gFtpNGeMUUqT-dZkz92s78EvcLld_Ga6Jt5AngT37GzHi9vaio8T8VKqiWmOiBKkL8Y-GpIs5bvc-aqp43FNw17&_nc_ohc=FvX-fS5xXRcQ7kNvwFgkUWe&_nc_gid=Qhvd35_8dUP50HdEmH-Ndg&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_Af9Nbrfmqngp5fmnlOtmWzFS80McSQoRYVVDYgxOb8oThA&oe=6A37EF97&_nc_sid=7a9f4b'
    };
    const dados = localStorage.getItem(PERFIL_KEY);
    return dados ? JSON.parse(dados) : padrao;
}

// FUNÇÃO CORRIGIDA: agora o nome é atualizarPerfil (igual ao que é chamado no HTML)
function atualizarPerfil(novoPerfil) {
    localStorage.setItem(PERFIL_KEY, JSON.stringify(novoPerfil));
}

// ========== RESENHAS ==========
function getResenhas() {
    return getLivros().filter(l => l.comentario && l.comentario.trim() !== '');
}

// ========== INDEXEDDB PARA PDFs ==========
const DB_NAME = 'ReadifyPDFs';
const STORE_NAME = 'pdfs';
let db = null;

function abrirIndexedDB() {
    return new Promise((resolve, reject) => {
        if (db && db.name === DB_NAME) {
            resolve(db);
            return;
        }
        const request = indexedDB.open(DB_NAME, 1);
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

async function salvarPDF(id, file) {
    const db = await abrirIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(file, id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function carregarPDF(id) {
    const db = await abrirIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function removerPDF(id) {
    const db = await abrirIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ========== DADOS INICIAIS ==========
function inicializarDadosExemplo() {
    if (getLivros().length === 0) {
        const exemplos = [
            { titulo: "Textos cruéis demais para serem lidos rapidamente", autor: "Igor Pires", ano: "2020", categoria: "Poesia", capaUrl: "https://m.media-amazon.com/images/I/61mzLkXJdXL._SY466_.jpg", avaliacao: 4, comentario: "Leitura intensa e reflexiva. Recomendo!", favorito: true, totalPaginas: 120, progressoPagina: 90 },
            { titulo: "A Empregada", autor: "Freida McFadden", ano: "2022", categoria: "Suspense", capaUrl: "https://m.media-amazon.com/images/I/41ziC4vXKBL._SY445_SX342_ML2_.jpg", avaliacao: 5, comentario: "", favorito: false, totalPaginas: 280, progressoPagina: 0 },
            { titulo: "É Assim que Acaba", autor: "Colleen Hoover", ano: "2016", categoria: "Romance", capaUrl: "https://m.media-amazon.com/images/I/91r5G8RxqfL.jpg", avaliacao: 3, comentario: "Gostei, mas esperava mais do final.", favorito: false, totalPaginas: 368, progressoPagina: 368 }
        ];
        for (const l of exemplos) {
            adicionarLivro(l);
        }
        const todos = getLivros();
        if (todos.length) setLeituraAtualId(todos[0].id);
    }
}
inicializarDadosExemplo();