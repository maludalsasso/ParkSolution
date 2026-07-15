// Importando as funções do Firebase CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    doc, 
    updateDoc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAw0xti3wrnD31-Af0gvfnib3UHzZANrGw",
    authDomain: "parksolution-83d8c.firebaseapp.com",
    projectId: "parksolution-83d8c",
    storageBucket: "parksolution-83d8c.firebasestorage.app",
    messagingSenderId: "7285610852",
    appId: "1:7285610852:web:273695b809c4e9e78ec271",
    measurementId: "G-DMJK6JB7J1"
};

// Inicializar Firebase e obter referência do Banco de Dados (Firestore)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const VALOR_HORA = 10.00; // Valor de exemplo por hora

// --- 1. REGISTRAR ENTRADA ---
document.getElementById('form-entrada')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const placa = document.getElementById('placa-entrada').value.toUpperCase().trim();
    const modelo = document.getElementById('modelo').value.trim();

    if(!placa || !modelo) return alert("Por favor, preencha todos os campos!");

    try {
        // Adiciona um documento na coleção "veiculos"
        await addDoc(collection(db, "veiculos"), {
            placa: placa,
            modelo: modelo,
            entrada: serverTimestamp(), // Pega o horário exato do servidor do Firebase
            status: "ativo",
            saida: null,
            valor_pago: 0
        });

        alert("🚗 Entrada registrada com sucesso! Pode estacionar.");
        document.getElementById('form-entrada').reset();
    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
        alert("Ocorreu um erro ao tentar salvar. Tente novamente.");
    }
});

// --- 2. CALCULAR VALOR NA SAÍDA ---
// --- 2. CALCULAR VALOR NA SAÍDA ---
window.calcularEstadia = async function() {
    const placa = document.getElementById('placa-saida').value.toUpperCase().trim();
    if(!placa) return alert("Por favor, digite sua placa.");

    try {
        // Consulta para achar o veículo ativo com essa placa
        const q = query(
            collection(db, "veiculos"), 
            where("placa", "==", placa), 
            where("status", "==", "ativo")
        );
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Veículo ativo não encontrado. Verifique a placa ou se já foi finalizado.");
            return;
        }

        const veiculoDoc = querySnapshot.docs[0];
        const veiculoDados = veiculoDoc.data();
        
        // Converter o Timestamp do Firebase em data do JS
        const entrada = veiculoDados.entrada.toDate();
        const saida = new Date();

        // 1. Calcular a diferença exata em minutos
        const diferencaMs = saida - entrada;
        const minutosTotal = Math.floor(diferencaMs / (1000 * 60));

        // 2. Aplicar a lógica de frações com 5 minutos de tolerância
        let valorTotal = 0;
        
        // Descobrimos quantas horas cheias e minutos restantes o cliente ficou
        const horasCompletas = Math.floor(minutosTotal / 60);
        const minutosRestantes = minutosTotal % 60;

        let horasCobradas = horasCompletas;

        // Se sobrou algum minuto além das horas completas...
        if (minutosRestantes > 0) {
            if (minutosRestantes <= 5) {
                // Se o que passou da hora cheia for de até 5 minutos, não cobra a próxima hora.
                // Exemplo: 65 minutos (1h 05m) -> cobra apenas 1 hora.
                horasCobradas = Math.max(1, horasCompletas); 
            } else {
                // Se passou da tolerância (ex: 66 minutos / 1h 06m), cobra mais uma hora cheia.
                horasCobradas = horasCompletas + 1;
            }
        }

        // Se o cálculo inicial der menos de 1 hora (ex: ficou 4 minutos), garante a cobrança mínima de 1 hora
        if (horasCobradas === 0 && minutosTotal > 0) {
            horasCobradas = 1;
        }

        // 3. Aplicar os valores de Carro (R$ 10/hora com teto/diária de R$ 35 se passar de 3 horas)
        const VALOR_HORA_CARRO = 10.00;
        const LIMITE_DIARIA_CARRO = 35.00;

        if (horasCobradas > 3) {
            // Passou de 3 horas cobradas (ou seja, a partir de 4 horas/R$ 40), o valor trava na diária
            valorTotal = LIMITE_DIARIA_CARRO;
        } else {
            valorTotal = horasCobradas * VALOR_HORA_CARRO;
        }

        // Formatar tempo para exibição visual do cliente
        const horasExibidas = Math.floor(minutosTotal / 60);
        const minutosExibidos = minutosTotal % 60;

        // Guardar o ID e o Valor para o momento de confirmar o pagamento
        window.currentVeiculoId = veiculoDoc.id;
        window.currentValorTotal = valorTotal;

        // Mostrar a tela de pagamento com os valores calculados
        document.getElementById('busca-saida').classList.add('d-none');
        document.getElementById('tela-pagamento').classList.remove('d-none');
        
        document.getElementById('tempo-permanencia').textContent = `${horasExibidas}h ${minutosExibidos}m`;
        document.getElementById('valor-pagar').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro na conexão. Tente novamente.");
    }
};

// --- 3. FINALIZAR ESTADIA (PAGO) ---
window.finalizarPagamento = async function() {
    if(!window.currentVeiculoId) return;

    try {
        const veiculoRef = doc(db, "veiculos", window.currentVeiculoId);
        
        // Atualiza o status do carro no banco de dados para "pago"
        await updateDoc(veiculoRef, {
            status: "pago",
            saida: serverTimestamp(),
            valor_pago: window.currentValorTotal
        });

        alert("✅ Pagamento registrado! Sua saída foi liberada. Volte sempre!");
        location.reload(); // Atualiza a página para reiniciar o processo
    } catch (error) {
        console.error("Erro ao finalizar:", error);
        alert("Não foi possível confirmar. Tente novamente.");
    }
};