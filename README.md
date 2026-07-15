# 🚗 ParkSolution - Sistema de Autoatendimento para Estacionamento

O **ParkSolution** é uma solução web simples e responsiva desenvolvida para pátios de estacionamento que operam de forma autônoma (sem necessidade de cancelas físicas ou operadores de pátio constantes). 

Através de um **QR Code** impresso nas vagas ou na entrada, o próprio cliente utiliza o celular para registrar a entrada do veículo e, na hora de sair, calcula o valor da estadia e realiza o pagamento via **Pix Copia e Cola**.

---

## 📱 Como funciona o Fluxo do Cliente?

1. **Entrada:** O cliente estaciona, escaneia o QR Code, insere a Placa e o Modelo do veículo e clica em **Confirmar Entrada**.
2. **Saída:** Ao retornar, o cliente acessa a aba **Pagar e Sair**, digita sua placa e o sistema calcula automaticamente o tempo de permanência e o valor.
3. **Pagamento:** O cliente visualiza as instruções de Pix, efetua o pagamento no aplicativo do seu banco e clica em **Liberar Veículo** para dar baixa no sistema.

---

## 📐 Regras de Cobrança (Carro)

O cálculo de tarifa foi estruturado com as seguintes regras de negócio:
* **Tarifa Base:** R$ 10,00 por hora (ou fração).
* **Tolerância:** 5 minutos de carência sobre a hora cheia. 
  * *Exemplo 1:* Até 1h e 05m de permanência, o valor cobrado é de **R$ 10,00**.
  * *Exemplo 2:* A partir de 1h e 06m, o sistema cobra a segunda fração, totalizando **R$ 20,00**.
* **Teto Máximo (Diária):** R$ 35,00 para permanências superiores a 3 horas de cobrança (a partir de 4 horas).

---

## 🛠️ Tecnologias Utilizadas

* **HTML5** & **CSS3** (Interface limpa e otimizada para dispositivos móveis)
* **Bootstrap 5** (Design responsivo e componentes dinâmicos)
* **JavaScript (ES6+)** (Consumo de APIs e lógica de controle de tempo)
* **Firebase Cloud Firestore** (Banco de dados NoSQL em tempo real para armazenamento seguro das estadias)

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o repositório:
```bash
git clone [https://github.com/seu-usuario/parksolution.git](https://github.com/seu-usuario/parksolution.git)

## 2. Configurar o Banco de Dados (Firebase):
Crie um projeto no Firebase Console.

Ative o Cloud Firestore em Modo de Teste.

Registre um aplicativo do tipo Web para obter suas credenciais de configuração.

Substitua o objeto firebaseConfig dentro do seu arquivo app.js pelas suas credenciais:

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

## 3. Executar o app:
Basta abrir o arquivo index.html em qualquer navegador ou utilizar a extensão Live Server no VS Code para rodar o ambiente local.

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
