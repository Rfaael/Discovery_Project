//FECHA E ABRE O MODAL.
const toggleModal = () => {
    document.querySelector("div.modal-overlay")
        .classList
        .toggle("active");
}

const storage = {
    get() {
        return JSON.parse(localStorage.getItem("finances:")) || [];
    },
    set(transactions) {
        localStorage.setItem("finances:", JSON.stringify(transactions));
    }
}

//GERAL PARA OBTER OS DADOS PRINCIPAIS => /TOTAL/SAIDA/ENTRADA/.
const transaction = {
    all: storage.get(),
    add(newTransaction) {
        transaction.all.push(newTransaction);
        app.reload();
    },
    remove(index){ 
        transaction.all.splice( index, 1);
        console.log(transaction.all)
        app.reload();
    },
    incomes() {
        let totalIncomes = 0;
        transaction.all.forEach((item) => {
            if (Number(item.amount) > 0) {
                totalIncomes += item.amount;
            }
        })
        return totalIncomes;
    },
    expense() {
        //SOMA TODAS AS SAIDAS.
        let totalExpense = 0;
        transaction.all.forEach((item) => {
            if(Number(item.amount) < 0){
                totalExpense += item.amount;
            }
        })
        return totalExpense;
    }
    ,
    total() {
        //FAZER A SUBTRACAO DE INCOMES COM EXPENSE PARA OBTER O VALOR FINAL.
        return transaction.incomes() + transaction.expense();
    }   
}

const utils = {
    //FORMATACAO DOS DA MOEDA!
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value;
    },
    formatAmount(value){
        value = Number(value) * 100;
        return value;
    },
    formatDate(date){
        const splitedDate = date.split("-").reverse().join("/");
        
        return splitedDate;
    }
}


const DOM = {
    transacitonsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {

        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLtransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transacitonsContainer.appendChild(tr);
    },
    innerHTMLtransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = utils.formatCurrency(transaction.amount);
          
        const Html = `
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                    <td>
                        <img onclick="transaction.remove(${index})"src="./assets/minus.svg" alt="remover transacao">
                    </td>
        `;
        return Html;
    },
    updateBalance() {
        document
            .getElementById("incomeDisplay")
            .innerHTML = utils.formatCurrency(transaction.incomes());
        document
            .getElementById("expenseDisplay")
            .innerHTML = utils.formatCurrency(transaction.expense());
        document
            .getElementById("totalDisplay")
            .innerHTML = utils.formatCurrency(transaction.total());
    },
    clearBalance(){
        DOM.transacitonsContainer.innerHTML = "";
    }
}

const form  = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),
    getValues(){
        return {
            description: form.description.value,
            amount: form.amount.value,
            date: form.date.value
        }
    },
    formatValues(){
        let { description, date, amount } = this.getValues();
        
        amount = utils.formatAmount(amount);
        date   = utils.formatDate(date);
        
        return {
            description,
            amount,
            date
        }
    },
    validateFields(){
        const { description, date, amount } = this.getValues();
        if (description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Preencha corretamente os dados....");
        }
    },
    clearFields(){
        document.querySelector("input#description").value = ""
        document.querySelector("input#amount").value = ""
        document.querySelector("input#date").value = ""
    }
    ,
    submit(event) {
        event.preventDefault();
        try {
            //verificar se todas as informacoes foram preenchidas.
            form.validateFields();
            //formatacao dos dados.
            const Transaction = form.formatValues();
            //salvar os dados recebidos./Atualizar a aplicacao!
            transaction.add(Transaction)
            //apagar os dados do formulario.
            form.clearFields();
            //fechar modal.
            toggleModal()
        }catch(error){
            alert(error.message)
        }
    
    }
}


storage.set("teste")

storage.get();

const app = {
    init() {
        transaction.all.forEach((item, index) => {
            DOM.addTransaction(item, index)
        })
        DOM.updateBalance();

        storage.set(transaction.all);
    },
    reload() {
        DOM.clearBalance();
        this.init();
    }
}

app.init();


