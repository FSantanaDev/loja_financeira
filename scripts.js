document.addEventListener('DOMContentLoaded', function () {
    // --- Referências dos elementos do Modal de Avaliação ---
    const modal = document.getElementById('avaliacaoModal');
    const botoesAbrirModal = document.querySelectorAll('.abrir-modal'); // Seletor genérico para abrir o modal
    const botaoFecharModal = document.querySelector('.fechar-modal');
    const formularioAvaliacao = document.getElementById('avaliacaoForm');
    const botaoEnviarAvaliacao = document.getElementById('btnEnviar');
    const checkboxPolitica = document.getElementById('politicaPrivacidade');
    const numeroWhatsApp = '+5592999889392';
    const rendaAnualInput = document.getElementById('rendaAnualAvaliacao');
    const rendaBalancoInput = document.getElementById('rendaBalancoAvaliacao');
    const cpfAvaliacaoInput = document.getElementById('cpfAvaliacao');
    const telefoneAvaliacaoInput = document.getElementById('telefoneAvaliacao');
    const cepAvaliacaoInput = document.getElementById('cepAvaliacao');
    const enderecoAvaliacaoInput = document.getElementById('enderecoAvaliacao');
    const bairroAvaliacaoInput = document.getElementById('bairroAvaliacao');
    const cidadeAvaliacaoInput = document.getElementById('cidadeAvaliacao');
    const estadoAvaliacaoInput = document.getElementById('estadoAvaliacao');

    // --- Referências dos elementos da Navegação ---
    const menuToggle = document.getElementById('menuToggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    const menuDesktop = document.getElementById('menu-desktop');
    const navLinksDropdown = menuDropdown.querySelectorAll('.menu-link');
    const navLinksDesktop = menuDesktop.querySelectorAll('.menu-link');



    const formularioContato = document.getElementById('formulario'); // MUDADO: Pegar o formulário pelo ID 'formulario'
    const nomeContatoInput = document.getElementById('nome'); // MUDADO: Pegar o campo nome pelo ID 'nome'
    const mensagemContatoInput = document.getElementById('mensagem'); // MUDADO: Pegar o campo mensagem pelo ID 'mensagem'




    // --- Funções do Modal ---
    function abrirModal() {
        modal.style.display = 'flex';
        // Opcional: Para focar no primeiro campo do formulário ao abrir o modal
        document.getElementById('nomeAvaliacao').focus();
    }

    function fecharModal() {
        modal.style.display = 'none';
        formularioAvaliacao.reset();
        botaoEnviarAvaliacao.disabled = true;
        // Limpar máscaras após reset, se necessário (valores formatados)
        rendaAnualInput.value = '';
        rendaBalancoInput.value = '';
        cpfAvaliacaoInput.value = '';
        telefoneAvaliacaoInput.value = '';
        cepAvaliacaoInput.value = '';
        limparEndereco(); // Função para limpar os campos de endereço
    }

    // --- Funções de Formatação e Máscaras ---
    function formatarMoeda(valor) {
        if (!valor) return '';
        const numeroLimpo = valor.replace(/\D/g, '');
        const numero = parseFloat(numeroLimpo) / 100;
        // Garante que o número não seja NaN antes de formatar
        if (isNaN(numero)) return '';
        const valorFormatado = numero.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valorFormatado;
    }

    function formatarEExibir(input) {
        const valor = input.value;
        const valorFormatado = formatarMoeda(valor);
        input.value = valorFormatado;
    }

    function aplicarMascaraCPF(campo) {
        campo.addEventListener('input', function () {
            let v = campo.value.replace(/\D/g, '').slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            campo.value = v;
        });
    }

    function aplicarMascaraTelefone(campo) {
        campo.addEventListener('input', function () {
            let v = campo.value.replace(/\D/g, '').slice(0, 11);
            v = v.length > 10
                ? v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                : v.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
            campo.value = v;
        });
    }

    function aplicarMascaraCEP(campo) {
        campo.addEventListener('input', function () {
            let v = campo.value.replace(/\D/g, '').slice(0, 8);
            campo.value = v.replace(/(\d{5})(\d)/, '$1-$2');
        });
    }

    function limparEndereco() {
        enderecoAvaliacaoInput.value = '';
        bairroAvaliacaoInput.value = '';
        cidadeAvaliacaoInput.value = '';
        estadoAvaliacaoInput.value = '';
    }

    // --- Funções da Navegação ---
    function fecharMenuDropdown() {
        menuDropdown.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');

        // REVERTE AS CLASSES DO ÍCONE DE HAMBÚRGUER PARA O ESTADO ORIGINAL
        menuToggle.querySelector('span:nth-child(1)').classList.remove('rotate-45', 'translate-y-2');
        menuToggle.querySelector('span:nth-child(2)').classList.remove('opacity-0');
        menuToggle.querySelector('span:nth-child(3)').classList.remove('-rotate-45', '-translate-y-2');
    }

    function rolarParaSecao(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Obtém a altura da navegação fixa
            const navHeight = document.getElementById('navegacao').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - navHeight, // Ajusta para a altura da nav fixa
                behavior: 'smooth'
            });
        }
    }

    // --- Event Listeners ---

    // Eventos do Modal
    botoesAbrirModal.forEach(botao => {
        botao.addEventListener('click', e => {
            e.preventDefault();
            abrirModal();
        });
    });

    botaoFecharModal.addEventListener('click', fecharModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) { // Fecha o modal apenas se clicar no overlay (fora do conteúdo)
            fecharModal();
        }
    });

    checkboxPolitica.addEventListener('change', function () {
        botaoEnviarAvaliacao.disabled = !this.checked;
    });

    rendaAnualInput.addEventListener('blur', function () {
        formatarEExibir(this);
    });

    rendaBalancoInput.addEventListener('blur', function () {
        formatarEExibir(this);
    });

    // Aplica máscaras aos campos de formulário do modal
    aplicarMascaraCPF(cpfAvaliacaoInput);
    aplicarMascaraTelefone(telefoneAvaliacaoInput);
    aplicarMascaraCEP(cepAvaliacaoInput);

    // Preenchimento automático de endereço via ViaCEP
    cepAvaliacaoInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length !== 8) {
            limparEndereco();
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    enderecoAvaliacaoInput.value = data.logradouro || '';
                    bairroAvaliacaoInput.value = data.bairro || '';
                    cidadeAvaliacaoInput.value = data.localidade || '';
                    estadoAvaliacaoInput.value = data.uf || '';
                } else {
                    alert('CEP não encontrado.');
                    limparEndereco();
                }
            })
            .catch(() => {
                alert('Erro ao consultar o CEP.');
                limparEndereco();
            });
    });

    // Envio do formulário de avaliação (EmailJS e WhatsApp)
    formularioAvaliacao.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nomeAvaliacao').value;
        const cpf = document.getElementById('cpfAvaliacao').value;
        const email = document.getElementById('emailAvaliacao').value;
        const telefone = document.getElementById('telefoneAvaliacao').value;
        const cep = document.getElementById('cepAvaliacao').value;
        const endereco = document.getElementById('enderecoAvaliacao').value;
        const bairro = document.getElementById('bairroAvaliacao').value;
        const cidade = document.getElementById('cidadeAvaliacao').value;
        const estado = document.getElementById('estadoAvaliacao').value;
        const renda_anual = document.getElementById('rendaAnualAvaliacao').value;
        const renda_balanco = document.getElementById('rendaBalancoAvaliacao').value;

        const mensagemWhats =
            `Olá, meu nome é ${nome}.\nCPF: ${cpf}\nTelefone: ${telefone}\nCEP: ${cep}\nEndereço: ${endereco} - ${bairro}, ${cidade} - ${estado}\nRenda Anual: ${renda_anual}\nRenda Último Balanço: ${renda_balanco}`;

        emailjs.sendForm('service_ieoueu8', 'template_kt8aqia', this)
            .then(() => {
                alert('Dados enviados com sucesso!');
                window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagemWhats)}`, '_blank');
                fecharModal();
            })
            .catch(() => {
                alert('Erro ao enviar os dados. Tente novamente.');
            });
    });

    // --- Eventos da Navegação ---
    menuToggle.addEventListener('click', function() {
        menuDropdown.classList.toggle('hidden');
        const isExpanded = menuDropdown.classList.contains('hidden') ? 'false' : 'true';
        this.setAttribute('aria-expanded', isExpanded);

        // Animar o ícone de hambúrguer (toggle)
        this.querySelector('span:nth-child(1)').classList.toggle('rotate-45');
        this.querySelector('span:nth-child(2)').classList.toggle('opacity-0');
        this.querySelector('span:nth-child(3)').classList.toggle('-rotate-45');
        this.querySelector('span:nth-child(1)').classList.toggle('translate-y-2');
        this.querySelector('span:nth-child(3)').classList.toggle('-translate-y-2');
    });

    // Adiciona evento de clique para os links do menu dropdown (mobile)
    navLinksDropdown.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            fecharMenuDropdown(); // Esta função agora também reverte o ícone
            const targetId = this.getAttribute('href').substring(1);
            rolarParaSecao(targetId);
        });
    });

    // Adiciona evento de clique para os links do menu desktop (mantendo a rolagem suave)
    navLinksDesktop.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            rolarParaSecao(targetId);
        });
    });

     // --- Evento de envio do Formulário de Contato (WhatsApp) ---
    if (formularioContato) { // Verifica se o formulário de contato existe na página
        formularioContato.addEventListener('submit', function (e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            const nomeContato = nomeContatoInput.value;
            const mensagemContato = mensagemContatoInput.value;

            // Construir a mensagem para o WhatsApp
            const mensagemWhatsContato = `Olá, meu nome é ${nomeContato} e minha mensagem é: ${mensagemContato}`;

            // Abrir o WhatsApp em uma nova aba/janela
            window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagemWhatsContato)}`, '_blank');

            // Opcional: Resetar o formulário após o envio
            formularioContato.reset();
        });
    }
    
    
});







