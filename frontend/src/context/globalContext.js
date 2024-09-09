import React, { useContext, useState } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Abrufen der Einkommen
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    // Hinzufügen eines Einkommens
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    // Löschen eines Einkommens
    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    // Gesamteinkommen berechnen
    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

    // Wiederholen eines Einkommens
    const repeatIncome = async (id) => {
        try {
            const incomeToRepeat = incomes.find(income => income._id === id);
            if (!incomeToRepeat) {
                setError("Einkommen nicht gefunden");
                return;
            }

            const newIncome = {
                ...incomeToRepeat,
                _id: String(Date.now()), // Neue ID generieren
                date: new Date(), // Optional: aktuelles Datum setzen
                repeated: false
            };

            await axios.post(`${BASE_URL}add-income`, newIncome);
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

        // Wiederholen eines Ausgaben
        const repeatExpense = async (id) => {
            try {
                const expenseToRepeat = expenses.find(income => income._id === id);
                if (!expenseToRepeat) {
                    setError("Einkommen nicht gefunden");
                    return;
                }
    
                const newExpense = {
                    ...expenseToRepeat,
                    _id: String(Date.now()), // Neue ID generieren
                    date: new Date(), // Optional: aktuelles Datum setzen
                    repeated: false
                };
    
                await axios.post(`${BASE_URL}add-expense`, newExpense);
                getExpenses();
            } catch (err) {
                setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
            }
        };
    
// Funktion zur monatlichen Wiederholung von Ausgaben/Einnahmen
const repeatMonthlyTransactions = async () => {
    try {
        // Aktualisierte Daten abrufen
        await getIncomes();
        await getExpenses();

        const today = new Date();

        // Filtere die wiederkehrenden Einträge, deren Datum heute ist
        const incomesToRepeat = incomes.filter(income => income.repeated && new Date(income.date).getDate() === today.getDate());
        const expensesToRepeat = expenses.filter(expense => expense.repeated && new Date(expense.date).getDate() === today.getDate());

        // Wiederhole Einkommen
        for (const income of incomesToRepeat) {
            const newIncome = {
                ...income,
                _id: String(Date.now()), // Neue ID generieren
                date: new Date(),
                repeated: false
            };
            await addIncome(newIncome);
        }

        // Wiederhole Ausgaben
        for (const expense of expensesToRepeat) {
            const newExpense = {
                ...expense,
                _id: String(Date.now()), // Neue ID generieren
                date: new Date(), // Datum auf nächsten Monat setzen
                repeated: false
            };
            await addExpense(newExpense);
        }

        console.log("Wiederkehrende Einträge wurden erfolgreich erstellt.");
    } catch (err) {
        setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
    }
};

// Starte den monatlichen Wiederholungsprozess
setInterval(() => {
    repeatMonthlyTransactions(); // Funktion wird täglich ausgeführt, überprüft die Daten und wiederholt monatlich
}, 24 * 60 * 60 * 1000); // Alle 24 Stunden in Millisekunden

    
    // Abrufen der Ausgaben
    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    // Hinzufügen einer Ausgabe
    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    // Löschen einer Ausgabe
    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    // Gesamtausgaben berechnen
    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };

    // Gesamtkontostand berechnen
    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    // Transaktionshistorie abrufen
    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0, 7);
    };

    const allTransactions = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history;
    };

    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            allTransactions,
            transactionHistory,
            error,
            repeatIncome,
            repeatExpense,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
