document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('financial-assessment-form');
    const formMessage = document.getElementById('form-message');

    // Elementos relacionados à câmera
    const openCameraButton = document.getElementById('open-camera-button');
    const cameraPreview = document.getElementById('camera-preview');
    const capturedImageCanvas = document.getElementById('captured-image-canvas');
    const cameraImageDataInput = document.getElementById('camera-image-data');
    const cameraErrorMessage = document.getElementById('camera-error-message');
    const captureContext = capturedImageCanvas.getContext('2d');
    let cameraStream = null; // Variável para armazenar o stream da câmera

    // Função para iniciar a câmera
    async function startCamera() {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            cameraPreview.srcObject = cameraStream;
            cameraPreview.style.display = 'block';
            openCameraButton.textContent = 'Capturar Imagem';
            openCameraButton.onclick = captureImage; // Altera a função do botão
            cameraErrorMessage.style.display = 'none';
        } catch (error) {
            console.error('Erro ao acessar a câmera:', error);
            cameraErrorMessage.textContent = 'Erro ao acessar a câmera. Verifique as permissões do seu navegador.';
            cameraErrorMessage.style.display = 'block';
        }
    }

    // Função para capturar a imagem da câmera
    function captureImage() {
        if (cameraPreview.srcObject) {
            capturedImageCanvas.width = cameraPreview.videoWidth;
            capturedImageCanvas.height = cameraPreview.videoHeight;
            captureContext.drawImage(cameraPreview, 0, 0, capturedImageCanvas.width, capturedImageCanvas.height);
            const imageDataURL = capturedImageCanvas.toDataURL('image/jpeg');
            cameraImageDataInput.value = imageDataURL;

            // Para a stream da câmera
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraPreview.srcObject = null;
                cameraStream = null;
            }

            cameraPreview.style.display = 'none';
            openCameraButton.textContent = 'Recapturar / Usar Outra Foto';
            openCameraButton.onclick = startCamera; // Volta a função do botão para abrir a câmera novamente
        }
    }

    // Event listener para o botão de abrir a câmera
    if (openCameraButton) {
        openCameraButton.onclick = startCamera;
    }

    // Event listener para o envio do formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const cameraImageData = cameraImageDataInput.value;
        const documentFile = document.getElementById('document-upload').files[0];
        const comments = document.getElementById('comments').value;

        const serviceId = 'service_ieoueu8';
        const templateId = 'template_kt8aqia';
        const publicKey = 'xXUgi_Qu_LDOR391F';

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('comments', comments);

        // Prioriza a imagem da câmera se ela foi capturada
        if (cameraImageData) {
            const byteString = atob(cameraImageData.split(',')[1]);
            const mimeString = cameraImageData.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            formData.append('document', blob, 'captured_image.jpg'); // Use 'document' como nome para consistência no template
        } else if (documentFile) {
            formData.append('document', documentFile, documentFile.name); // Use 'document' como nome para consistência no template
        }

        emailjs.sendForm(serviceId, templateId, this)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                formMessage.classList.remove('hidden', 'error');
                formMessage.classList.add('success');
                formMessage.textContent = 'Sua solicitação foi enviada com sucesso!';
                form.reset();
                // Limpa a prévia da câmera e restaura o botão
                if (cameraStream) {
                    cameraStream.getTracks().forEach(track => track.stop());
                    cameraPreview.srcObject = null;
                    cameraStream = null;
                }
                openCameraButton.textContent = 'Abrir Câmera';
                openCameraButton.onclick = startCamera;
            }, (error) => {
                console.log('FAILED...', error);
                formMessage.classList.remove('hidden', 'success');
                formMessage.classList.add('error');
                formMessage.textContent = 'Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.';
            });
    });
});