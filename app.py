from flask import Flask, request, jsonify, render_template
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

# Sua configuração de e-mail para o Gmail
EMAIL_ADDRESS = "seu_email@gmail.com"  # Substitua pelo seu e-mail do Gmail
EMAIL_PASSWORD = "sua_senha_ou_senha_de_aplicativo"  # Use sua senha ou senha de aplicativo
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_STARTTLS = True
EMAIL_DESTINATARIO = "email_da_financeira@exemplo.com" # Email para onde os dados serão enviados

def enviar_email(destinatario, assunto, corpo):
    msg = MIMEText(corpo)
    msg['Subject'] = assunto
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = destinatario

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            if SMTP_STARTTLS:
                server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, destinatario, msg.as_string())
        print(f"E-mail enviado para {destinatario}")
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar_dados_email', methods=['POST'])
def enviar_dados_email():
    if request.is_json:
        data = request.get_json()
        nome = data.get('nome')
        renda_mensal = data.get('rendaMensal')
        renda_anual = data.get('rendaAnual')
        balanco = data.get('balanco')
        email_cliente = data.get('email')

        assunto_email = "Novo envio de formulário da Landing Page"
        corpo_email = f"Dados do formulário:\nNome: {nome}\nRenda Mensal: R$ {renda_mensal}\nRenda Anual: R$ {renda_anual}\nÚltimo Balanço: {balanco}\nEmail do Cliente: {email_cliente}"

        if enviar_email(EMAIL_DESTINATARIO, assunto_email, corpo_email):
            return jsonify({'success': True, 'message': 'Dados enviados com sucesso por e-mail!'}), 200
        else:
            return jsonify({'success': False, 'error': 'Falha ao enviar os dados por e-mail.'}), 500
    else:
        return jsonify({'success': False, 'error': 'Requisição inválida. Esperava JSON.'}), 400

if __name__ == '__main__':
    app.run(debug=True)