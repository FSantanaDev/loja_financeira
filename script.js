document.addEventListener('DOMContentLoaded', function () {
  // Referências dos elementos
  const modal = document.getElementById('avaliacaoModal');
  const botoesAbrirModal = document.querySelectorAll('.sobre-botao');
  const botaoFecharModal = document.querySelector('.fechar-modal');
  const formulario = document.getElementById('avaliacaoForm');
  const botaoEnviar = document.getElementById('btnEnviar');
  const checkboxPolitica = document.getElementById('politicaPrivacidade');
  const numeroWhatsApp = '+5592984635305';
  const rendaAnualInput = document.getElementById('rendaAnualAvaliacao');
  const rendaBalancoInput = document.getElementById('rendaBalancoAvaliacao');
  

  // Função para abrir o modal
  function abrirModal() {
    modal.style.display = 'flex';
  }

  // Função para fechar o modal e limpar o formulário
  function fecharModal() {
    modal.style.display = 'none';
    formulario.reset();
    botaoEnviar.disabled = true;
  }

 function formatarEExibir(input) {
        const valor = input.value;
        const valorFormatado = formatarMoeda(valor);
        input.value = valorFormatado;
    }

    // Adicionar eventos de blur para formatar os campos de renda
    rendaAnualInput.addEventListener('blur', function() {
        formatarEExibir(this);
    });

    rendaBalancoInput.addEventListener('blur', function() {
        formatarEExibir(this);
    });








  // Abrir o modal ao clicar nos botões
  botoesAbrirModal.forEach(botao => {
    botao.addEventListener('click', e => {
      e.preventDefault();
      abrirModal();
    });
  });

  // Fechar modal ao clicar no botão de fechar
  botaoFecharModal.addEventListener('click', fecharModal);

  // Prevenir fechamento ao clicar fora do conteúdo do modal
  modal.addEventListener('click', function (e) {
    if (e.target === modal) return;
  });

  // Habilitar botão de envio apenas se a política de privacidade for aceita
  checkboxPolitica.addEventListener('change', function () {
    botaoEnviar.disabled = !this.checked;
  });

  // Aplicar máscara de CPF
  function aplicarMascaraCPF(campo) {
    campo.addEventListener('input', function () {
      let v = campo.value.replace(/\D/g, '').slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      campo.value = v;
    });
  }

  // Aplicar máscara de telefone
  function aplicarMascaraTelefone(campo) {
    campo.addEventListener('input', function () {
      let v = campo.value.replace(/\D/g, '').slice(0, 11);
      v = v.length > 10 
        ? v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
        : v.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
      campo.value = v;
    });
  }

  // Aplicar máscara de CEP
  function aplicarMascaraCEP(campo) {
    campo.addEventListener('input', function () {
      let v = campo.value.replace(/\D/g, '').slice(0, 8);
      campo.value = v.replace(/(\d{5})(\d)/, '$1-$2');
    });
  }

   // Formatar valores como moeda brasileira
     // Formatar valores como moeda brasileira
    function formatarMoeda(valor) {
        console.log("Valor recebido para formatação:", valor);
        if (!valor) return '';

        const numeroLimpo = valor.replace(/\D/g, '');
        const numero = parseFloat(numeroLimpo) / 100;
        const valorFormatado = numero.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        console.log("Valor formatado:", valorFormatado);
        return valorFormatado;
    }

  // Aplicar máscaras aos campos
  aplicarMascaraCPF(document.getElementById('cpfAvaliacao'));
  aplicarMascaraTelefone(document.getElementById('telefoneAvaliacao'));
  aplicarMascaraCEP(document.getElementById('cepAvaliacao'));

  // Preenchimento automático de endereço via ViaCEP
  document.getElementById('cepAvaliacao').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) return limparEndereco();

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (!data.erro) {
          document.getElementById('enderecoAvaliacao').value = data.logradouro || '';
          document.getElementById('bairroAvaliacao').value = data.bairro || '';
          document.getElementById('cidadeAvaliacao').value = data.localidade || '';
          document.getElementById('estadoAvaliacao').value = data.uf || '';
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

  // Função para limpar os campos de endereço
  function limparEndereco() {
    document.getElementById('enderecoAvaliacao').value = '';
    document.getElementById('bairroAvaliacao').value = '';
    document.getElementById('cidadeAvaliacao').value = '';
    document.getElementById('estadoAvaliacao').value = '';
  }

  
  // Envio do formulário
  formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        // Captura dos dados do formulário (os valores de renda já estarão formatados no input devido ao evento blur)
        const nome = document.getElementById('nomeAvaliacao').value;
        const cpf = document.getElementById('cpfAvaliacao').value;
        const email = document.getElementById('emailAvaliacao').value;
        const telefone = document.getElementById('telefoneAvaliacao').value;
        const cep = document.getElementById('cepAvaliacao').value;
        const endereco = document.getElementById('enderecoAvaliacao').value;
        const bairro = document.getElementById('bairroAvaliacao').value;
        const cidade = document.getElementById('cidadeAvaliacao').value;
        const estado = document.getElementById('estadoAvaliacao').value;
        const renda_anual = document.getElementById('rendaAnualAvaliacao').value; // Já formatado
        const renda_balanco = document.getElementById('rendaBalancoAvaliacao').value; // Já formatado

        // Mensagem personalizada para WhatsApp (isso não afeta o EmailJS diretamente)
        const mensagemWhats =
            `Olá, meu nome é ${nome}.\nCPF: ${cpf}\nTelefone: ${telefone}\nCEP: ${cep}\nEndereço: ${endereco} - ${bairro}, ${cidade} - ${estado}\nRenda Anual: ${renda_anual}\nRenda Último Balanço: ${renda_balanco}`;

        // Enviar dados via EmailJS
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
});
