import React, { useState } from 'react';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';
import moment from 'moment';

ChartJs.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

function Chart() {
    const { incomes, expenses } = useGlobalContext();
    const [viewMode, setViewMode] = useState('currentMonth'); // Zustand für die Auswahl der Ansicht

    // Aktuelles Datum
    const currentDate = moment();

    // Funktion, um das Jahr und den Monat (YYYY-MM) zu extrahieren
    const getYearMonth = (date) => moment(date).format('YYYY-MM');

    // Funktion, um den Monatsnamen zu extrahieren
    const getMonthName = (date) => moment(date).format('MMMM');

    // Funktion, um das Datum im Format "DD.MM" zu erhalten
    const getDay = (date) => moment(date).format('DD.MM');

    // Daten für den aktuellen Monat anzeigen
    const showCurrentMonth = () => {
        // Filtere alle Daten für den aktuellen Monat
        const currentMonthDates = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).isSame(currentDate, 'month'))
            .map(entry => dateFormat(entry.date))
            .sort((a, b) => moment(a, 'DD.MM').diff(moment(b, 'DD.MM'))); // Sortiere die Tage nach Datum

        // Erhalte einzigartige Datumswerte (Tage)
        const uniqueDays = Array.from(new Set(currentMonthDates));

        const incomeData = uniqueDays.map(day => {
            const incomeEntries = incomes.filter(inc => dateFormat(inc.date) === day);
            const totalIncome = incomeEntries.reduce((sum, income) => sum + income.amount, 0);
            return totalIncome;
        });

        const expenseData = uniqueDays.map(day => {
            const expenseEntries = expenses.filter(exp => dateFormat(exp.date) === day);
            const totalExpense = expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
            return totalExpense;
        });

        return {
            labels: uniqueDays,
            incomeData,
            expenseData
        };
    };

    // Daten für das gesamte Jahr anzeigen
    const showFullYear = () => {
        // Gruppiere nach Jahr und Monat für das gesamte Jahr
        const allYearMonths = [...incomes, ...expenses]
            .map(entry => getYearMonth(entry.date))
            .sort(); // Sortiere nach Jahr und Monat (YYYY-MM)

        // Erhalte einzigartige Jahr-Monat Kombinationen
        const uniqueYearMonths = Array.from(new Set(allYearMonths));

        // Extrahiere nur die Monatsnamen für die x-Achse, sortiert nach Jahr
        const uniqueMonths = uniqueYearMonths.map(date => getMonthName(date));

        const incomeData = uniqueYearMonths.map(yearMonth => {
            const incomeEntries = incomes.filter(inc => getYearMonth(inc.date) === yearMonth);
            const totalIncome = incomeEntries.reduce((sum, income) => sum + income.amount, 0);
            return totalIncome;
        });

        const expenseData = uniqueYearMonths.map(yearMonth => {
            const expenseEntries = expenses.filter(exp => getYearMonth(exp.date) === yearMonth);
            const totalExpense = expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
            return totalExpense;
        });

        return {
            labels: uniqueMonths,
            incomeData,
            expenseData
        };
    };

    // Wähle die anzuzeigenden Daten basierend auf der Auswahl des Nutzers
    const { labels, incomeData, expenseData } = viewMode === 'currentMonth' ? showCurrentMonth() : showFullYear();

    const data = {
        labels, // Labels für die x-Achse
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: 'green',
                borderColor: 'green',
                tension: 0.3,
                fill: false,
            },
            {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'red',
                borderColor: 'red',
                tension: 0.3,
                fill: false,
            }
        ]
    };

    const options = {
        scales: {
            x: {
                type: 'category', // Standard x-Achse, um konsistente Kategorien darzustellen
                title: {
                    display: true,
                    text: viewMode === 'currentMonth' ? 'Day' : 'Month',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount',
                },
            },
        },
    };

    return (
        <ChartStyled>
            <div>
                <button onClick={() => setViewMode('currentMonth')}>Aktueller Monat</button>
                <button onClick={() => setViewMode('fullYear')}>Ganzes Jahr</button>
            </div>
            <Line data={data} options={options} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
`;

export default Chart;
