// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbzwJUBfJSF8jKutZhUKaYJ2tfru9MbLyrnCl4vaufPv8KMwJ_3H0y1OdCdU4rP6yuzA0w/exec";
let dadosAlunos = []; // Armazena os dados vindos da planilha

// ==========================================
// 1. CARREGAMENTO DE DADOS (BACK-END)
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbx428DLzzvUR87YlascQsFtviMhfHT0q7vf21-UPoor88xSAAHJeWYIjQM9T8eOlWn9/exec"; // Use o URL que termina em /exec

async function carregarDados() {
    try {
        // O segredo está no 'redirect: follow'
        const resposta = await fetch(API_URL);
        
        if (!resposta.ok) throw new Error('Erro ao acessar a planilha');

        dadosAlunos = await resposta.json();
        console.log("Dados recebidos com sucesso:", dadosAlunos);

        // Dispara as atualizações visuais
        renderizarTudo();

    } catch (erro) {
        console.error("Erro no carregamento:", erro);
        // Tente usar um proxy se o erro persistir (comum em servidores locais)
        console.log("Dica: Se rodar direto do arquivo HTML no PC, o navegador pode bloquear. Tente usar a extensão 'Live Server' no VS Code.");
    }
}

// Função para garantir que tudo seja preenchido
function renderizarTudo() {
    if (document.querySelector('.podium-container')) renderizarPodio();
    if (document.getElementById('tabelaGeral')) renderizarTabelaRanking();
    if (document.querySelector('.perfil-header')) carregarPerfil();
}

// ==========================================
// 2. SISTEMA DE LOGIN
// ==========================================
function fazerLogin() {
    const matricula = document.getElementById('inputMatricula').value;
    
    // Procura o aluno na lista carregada da planilha
    const aluno = dadosAlunos.find(a => a.matricula.toString() === matricula);
    
    if (aluno) {
        // Guarda os dados no navegador para usar em outras páginas
        localStorage.setItem('alunoLogado', JSON.stringify(aluno));
        window.location.href = 'perfil.html';
    } else {
        alert("Matrícula não encontrada! Verifique o número ou fale com a coordenação.");
    }
}

function carregarPerfil() {
    const aluno = JSON.parse(localStorage.getItem('alunoLogado'));
    if (!aluno) {
        window.location.href = 'index.html'; // Se não estiver logado, volta pro início
        return;
    }
    // Preenche os campos do perfil (IDs devem existir no HTML do perfil)
    document.getElementById('nomeAluno').innerText = aluno.nome;
    document.getElementById('turmaAluno').innerText = aluno.turma;
    document.getElementById('saldoAluno').innerText = `🪙 ${aluno.saldo}.00 EcoCoins`;
}

// ==========================================
// 3. SLIDESHOW (HOME)
// ==========================================
let slideIndex = 1;
function plusSlides(n) { showSlides(slideIndex += n); }
function currentSlide(n) { showSlides(slideIndex = n); }

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (!slides.length) return; // Sai da função se não estiver na home

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    
    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
    for (let i = 0; i < dots.length; i++) dots[i].className = dots[i].className.replace(" active", "");
    
    slides[slideIndex-1].style.display = "block";
    if (dots.length > 0) dots[slideIndex-1].className += " active";
}

// ==========================================
// 4. FILTROS E INTERATIVIDADE
// ==========================================

// Filtro da Loja
function filtrarLoja() {
    const filtro = document.getElementById('categoriaLoja').value.toLowerCase();
    const produtos = document.querySelectorAll('.item-loja-card');

    produtos.forEach(prod => {
        const categoria = prod.querySelector('.categoria-tag').innerText.toLowerCase();
        prod.style.display = (filtro === 'todos' || categoria.includes(filtro)) ? 'block' : 'none';
    });
}

// Filtro do Ranking Geral (Busca + Turma)
function filtrarRankingCompleto() {
    const busca = document.getElementById('buscaNome').value.toLowerCase();
    const turma = document.getElementById('filtroTurmaGeral').value;
    const linhas = document.querySelectorAll('.linha-aluno');

    linhas.forEach(linha => {
        const nome = linha.children[1].innerText.toLowerCase();
        const tAluno = linha.getAttribute('data-turma');
        const bateBusca = nome.includes(busca);
        const bateTurma = (turma === 'todas' || tAluno === turma);
        linha.style.display = (bateBusca && bateTurma) ? "" : "none";
    });
}

// Alternar Abas (Eventos/Loja na Home)
function alternarConteudo(tipo, index, btn) {
    const card = btn.closest('.card');
    card.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    card.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`${tipo}-${index}`).classList.add('active');
    btn.classList.add('active');
}

// ==========================================
// 5. AÇÕES DE COMPRA E INSCRIÇÃO
// ==========================================
function inscreverEvento(url) { window.open(url, '_blank'); }
function comprarItem(url) { 
    const aluno = JSON.parse(localStorage.getItem('alunoLogado'));
    if (!aluno) {
        alert("Você precisa estar logado para comprar!");
        return;
    }
    window.open(url, '_blank'); 
}

// ==========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ==========================================
window.onload = () => {
    carregarDados(); // Puxa os dados da planilha
    
    // Inicia o Slideshow se existir na página
    if (document.getElementsByClassName("mySlides").length > 0) {
        showSlides(slideIndex);
        setInterval(() => plusSlides(1), 5000);
    }
};