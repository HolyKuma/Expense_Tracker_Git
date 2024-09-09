const axios = require('axios');

const BASE_URL = "http://localhost:5000/api/v1/";

// Funktion, um die Einnahmen abzurufen
const getIncomes = async () => {
    const response = await axios.get(`${BASE_URL}get-incomes`);
    return response.data;
};

// Funktion, um die Ausgaben abzurufen
const getExpenses = async () => {
    const response = await axios.get(`${BASE_URL}get-expenses`);
    return response.data;
};

// Funktion zum Wiederholen von monatlichen Ausgaben
const repeatMonthlyExpenses = async () => {
    try {
        const today = new Date();
        const todayDay = today.getDate();

        // Hole die Ausgaben
        const expenses = await getExpenses();
        const expensesToRepeat = expenses.filter(expense => expense.repeated && new Date(expense.date).getDate() === todayDay);

        for (const expense of expensesToRepeat) {
            const newExpense = {
                ...expense,
                _id: String(Date.now()), // Neue ID generieren
                date: today.toISOString(), // Setze das Datum auf das heutige Datum im ISO-Format
                repeated: false // Wiederholung stoppen
            };

            await axios.post(`${BASE_URL}add-expense`, newExpense);
        }

        console.log("Wiederkehrende Ausgaben wurden erfolgreich erstellt.");
    } catch (err) {
        console.error("Ein Fehler ist aufgetreten:", err.response?.data?.message || err.message);
    }
};

// Funktion zum Wiederholen von monatlichen Einnahmen
const repeatMonthlyIncomes = async () => {
    try {
        const today = new Date();
        const todayDay = today.getDate();

        // Hole die Einnahmen
        const incomes = await getIncomes();
        const incomesToRepeat = incomes.filter(income => income.repeated && new Date(income.date).getDate() === todayDay);

        for (const income of incomesToRepeat) {
            const newIncome = {
                ...income,
                _id: String(Date.now()), // Neue ID generieren
                date: today.toISOString(), // Setze das Datum auf das heutige Datum im ISO-Format
                repeated: false // Wiederholung stoppen
            };

            await axios.post(`${BASE_URL}add-income`, newIncome);
        }

        console.log("Wiederkehrende Einnahmen wurden erfolgreich erstellt.");
    } catch (err) {
        console.error("Ein Fehler ist aufgetreten:", err.response?.data?.message || err.message);
    }
};

// Setze das Intervall auf 24 Stunden
setInterval(() => {
    repeatMonthlyIncomes();
}, 24 * 60 * 60 * 1000); // Alle 24 Stunden

setInterval(() => {
    repeatMonthlyExpenses();
}, 24 * 60 * 60 * 1000); // Alle 24 Stunden
