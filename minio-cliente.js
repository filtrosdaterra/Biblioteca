// minio-client.js
// Cliente JavaScript para comunicação com MinIO (via presigned URLs)

const MINIO_ENDPOINT = 'http://localhost:9000';
const BUCKET_NAME = 'readify-pdfs';

// Função para fazer upload do PDF para o MinIO
async function uploadPDFToMinIO(livroId, file) {
    // Primeiro, pede ao backend uma URL assinada (presigned URL)
    const response = await fetch(`http://localhost:3000/get-upload-url?filename=livros/${livroId}.pdf`);
    const { url } = await response.json();
    
    // Faz o upload direto para o MinIO
    const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': 'application/pdf'
        }
    });
    
    if (uploadResponse.ok) {
        // Salva a referência no localStorage
        const livros = getLivros();
        const livro = livros.find(l => l.id == livroId);
        if (livro) {
            livro.pdfKey = `livros/${livroId}.pdf`;
            livro.totalPaginas = await getPDFPages(file);
            saveLivros(livros);
        }
        return true;
    }
    return false;
}

// Função para obter URL de download do PDF
async function getPDFDownloadURL(livroId) {
    const response = await fetch(`http://localhost:3000/get-download-url?filename=livros/${livroId}.pdf`);
    const { url } = await response.json();
    return url;
}

// Função para extrair número de páginas do PDF
async function getPDFPages(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const typedarray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            resolve(pdf.numPages);
        };
        reader.readAsArrayBuffer(file);
    });
}