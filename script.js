document.addEventListener('DOMContentLoaded', function() {

    // Carrega cor salva se existir
    chrome.storage.sync.get(['backgroundColor', 'textColor'], function(result) {
        if (result.backgroundColor) {
            document.body.style.backgroundColor = result.backgroundColor;

            if (result.textColor) {
                document.body.style.color = result.textColor;
            } else {
                const corTexto = getContrastColor(result.backgroundColor);
                document.body.style.color = corTexto;
            }
        }
    });

    // Configuração do botão de mudar cor
    document.getElementById('mudarCorBtn').addEventListener('click', MudarCorFundo);

    // Configuração do botão de reset
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.body.style.backgroundColor = '#f9f9f9';
        document.body.style.color = '#333';
        chrome.storage.sync.remove(['backgroundColor', 'textColor']);
    });
});

function MudarCorFundo(){
    const pegarCor = document.getElementById('pegarCor');
    const corEscolhida = pegarCor.value;

    document.body.style.backgroundColor = corEscolhida;

    const corTexto = getContrastColor(corEscolhida);
    document.body.style.color = corTexto;

    // Mostrar popup
    mostrarPopup(corEscolhida);

    // Copiar para area de transferência
    copiarParaAreaTransferencia(corEscolhida);

    chrome.storage.sync.set({
        backgroundColor: corEscolhida,
        textColor: corTexto
    });
}

function getContrastColor(hexColor) {
    if (!hexColor || hexColor.length < 7) return '#000000';

    try {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    } catch (e) {
        return '#000000';
    }
}

// Popup
function mostrarPopup(cor) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '15px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.backgroundColor = '#fff';
    popup.style.color = '#333';
    popup.style.padding = '10px 15px';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = '10000';
    popup.style.fontWeight = 'bold';
    popup.style.border = `2px solid ${cor}`;
    popup.textContent = `Cor: ${cor.toUpperCase()}`;

    document.body.appendChild(popup);

    setTimeout(() => {
        if (popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 2000);
}
// Função para copiar para área de transferência
function copiarParaAreaTransferencia(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log('Cor copiada: ', texto);
        })
        .catch(err => {
            console.error('Falha ao copiar: ', err);
            // Fallback para método antigo se o moderno falhar
            copiarFallback(texto);
        });
}
function copiarFallback(texto) {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        console.log('Cor copiada (fallback): ', texto);
    } catch (err) {
        console.error('Falha ao copiar (fallback): ', err);
    }

    document.body.removeChild(textarea);
}