const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const notification = document.getElementById("notification");

// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

// let transactions = dummyTransactions;

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorageTransactions !== null ? localStorageTransactions : [];

function updateLocaleStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}


function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    showNotification();
  } else {
    const existingTransaction = transactions.find(transaction => transaction.text === text.value);
    if (existingTransaction) {
      // If a transaction with the same name already exists, update its amount
      existingTransaction.amount += +amount.value;
    } else {
      // Otherwise, add a new transaction
      const transaction = {
        id: generateID(),
        text: text.value,
        amount: +amount.value,
      };
      transactions.push(transaction);
    }
    addTransactionDOM();
    updateValues();
    updateLocaleStorage();
    text.value = "";
    amount.value = "";
    updateChart();
  }
}


  function addTransactionDOM(transaction) {
    list.innerHTML = "";
    transactions.forEach(transaction => {
      const sign = transaction.amount < 0 ? "-" : "+";
      const item = document.createElement("li");
      item.classList.add(sign === "+" ? "plus" : "minus");
      item.innerHTML = `
          ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span
          ><button class="delete-btn" onclick="removeTransaction(${transaction.id
        })"><i class="fa fa-times"></i></button>
    `;
      list.appendChild(item);
    });
  }

  function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts
      .reduce((accumulator, value) => (accumulator += value), 0)
      .toFixed(2);
    const income = amounts
      .filter((value) => value > 0)
      .reduce((accumulator, value) => (accumulator += value), 0)
      .toFixed(2);
    const expense = (
      amounts
        .filter((value) => value < 0)
        .reduce((accumulator, value) => (accumulator += value), 0) * -1
    ).toFixed(2);
    balance.innerText = `$${total}`;
    moneyPlus.innerText = `$${income}`;
    moneyMinus.innerText = `$${expense}`;
  }

  function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    updateLocaleStorage();
    init();
    updateChart();
  }

  // Init
  function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
  }

  function updateChart() {
    const labels = transactions.map(transaction => transaction.text);
    const amounts = transactions.map(transaction => transaction.amount);
    const colors = generateRandomColors(amounts.length);

    const existingChart = Chart.getChart("myChart");

    if (existingChart) {
      existingChart.data.labels = labels;
      existingChart.data.datasets[0].data = amounts;
      existingChart.data.datasets[0].backgroundColor = colors;
      existingChart.update();
    } else{
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Transaction Amount',
          data: amounts,
          //backgroundColor: 'rgba(75, 192, 192, 0.2)',
          backgroundColor: colors,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}

function generateRandomColors(numColors) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
    colors.push(randomColor);
  }
  return colors;
}

  init();
  updateChart();

  form.addEventListener("submit", addTransaction);
