import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);



    useEffect(() => {
        const incomeIntervalId = setInterval(() => {
            repeatMonthlyIncomes();
        }, 24 * 60 *60 * 1000); // Every 24 hours

        const expenseIntervalId = setInterval(() => {
            repeatMonthlyExpenses();
        },  24 * 60 *60 * 1000); // Every 24 hours

        // besser auf Server Seite das Interval bestimmten und einleiten.
        return () => {
            clearInterval(incomeIntervalId);
            clearInterval(expenseIntervalId);
        };
    }, [incomes, expenses]);

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income);
            await getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`);
            await getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const totalIncome = () => {
        return incomes.reduce((acc, income) => acc + income.amount, 0);
    };

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
            await getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const repeatExpense = async (id) => {
        try {
            const expenseToRepeat = expenses.find(expense => expense._id === id);
            if (!expenseToRepeat) {
                setError("Ausgabe nicht gefunden");
                return;
            }

            const newExpense = {
                ...expenseToRepeat,
                _id: String(Date.now()), // Neue ID generieren
                date: new Date(), // Optional: aktuelles Datum setzen
                repeated: false
            };

            await axios.post(`${BASE_URL}add-expense`, newExpense);
            await getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const repeatMonthlyExpenses = async () => {
        try {
            const today = new Date();
            const todayDay = today.getDate();

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

            await getExpenses(); // Aktualisiere die Ausgaben nach der Wiederholung
            console.log("Wiederkehrende Ausgaben wurden erfolgreich erstellt.");
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const repeatMonthlyIncomes = async () => {
        try {
            const today = new Date();
            const todayDay = today.getDate();

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

            await getIncomes(); // Aktualisiere die Einnahmen nach der Wiederholung
            console.log("Wiederkehrende Einnahmen wurden erfolgreich erstellt.");
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`);
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense);
            await getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`);
            await getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || "Ein Fehler ist aufgetreten");
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((acc, expense) => acc + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

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
