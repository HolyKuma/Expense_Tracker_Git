import React from 'react';
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

function Chart({ viewMode }) {
    const { incomes, expenses } = useGlobalContext();
    const currentDate = moment();

    const getYearMonth = (date) => moment(date).format('YYYY-MM');
    const getMonthName = (date) => moment(date).format('MM/YYYY');

    // Show data for the current month
    const showCurrentMonth = () => {
        const currentMonthDates = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).isSame(currentDate, 'month'))
            .map(entry => dateFormat(entry.date))
            .sort((a, b) => moment(a, 'DD.MM').diff(moment(b, 'DD.MM')));

        const uniqueDays = Array.from(new Set(currentMonthDates));

        const incomeData = uniqueDays.map(day => {
            const incomeEntries = incomes.filter(inc => dateFormat(inc.date) === day);
            return incomeEntries.reduce((sum, income) => sum + income.amount, 0);
        });

        const expenseData = uniqueDays.map(day => {
            const expenseEntries = expenses.filter(exp => dateFormat(exp.date) === day);
            return expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
        });

        return { labels: uniqueDays, incomeData, expenseData };
    };

    // Show data for the full year
    const showAllYears = () => {
        const allYearMonths = [...incomes, ...expenses]
            .map(entry => getYearMonth(entry.date))
            .sort();

        const uniqueYearMonths = Array.from(new Set(allYearMonths));

        const uniqueMonths = uniqueYearMonths.map(date => getMonthName(date));

        const incomeData = uniqueYearMonths.map(yearMonth => {
            const incomeEntries = incomes.filter(inc => getYearMonth(inc.date) === yearMonth);
            return incomeEntries.reduce((sum, income) => sum + income.amount, 0);
        });

        const expenseData = uniqueYearMonths.map(yearMonth => {
            const expenseEntries = expenses.filter(exp => getYearMonth(exp.date) === yearMonth);
            return expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
        });

        return { labels: uniqueMonths, incomeData, expenseData };
    };

    // Show data for the current year
    const showCurrentYear = () => {
        const currentYear = currentDate.year();

        const currentYearEntries = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).year() === currentYear);

        const uniqueYearMonths = Array.from(new Set(
            currentYearEntries.map(entry => getYearMonth(entry.date))
        )).sort((a, b) => moment(a, 'YYYY-MM').diff(moment(b, 'YYYY-MM')));

        const uniqueMonths = uniqueYearMonths.map(date => getMonthName(date));

        const incomeData = uniqueYearMonths.map(yearMonth => {
            const incomeEntries = incomes.filter(inc => getYearMonth(inc.date) === yearMonth);
            return incomeEntries.reduce((sum, income) => sum + income.amount, 0);
        });

        const expenseData = uniqueYearMonths.map(yearMonth => {
            const expenseEntries = expenses.filter(exp => getYearMonth(exp.date) === yearMonth);
            return expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
        });

        return { labels: uniqueMonths, incomeData, expenseData };
    };

    // Show data for one year backwards from the current month
    const showOneYear = () => {
        const oneYearAgo = currentDate.clone().subtract(1, 'years');

        const yearEntries = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).isBetween(oneYearAgo, currentDate, null, '[]'))
            .map(entry => getYearMonth(entry.date));

        const uniqueMonths = Array.from(new Set(yearEntries))
            .sort((a, b) => moment(a, 'YYYY-MM').diff(moment(b, 'YYYY-MM')));

        const labels = uniqueMonths.map(month => getMonthName(month));

        const incomeData = uniqueMonths.map(month => {
            const incomeEntries = incomes.filter(inc => getYearMonth(inc.date) === month);
            return incomeEntries.reduce((sum, income) => sum + income.amount, 0);
        });

        const expenseData = uniqueMonths.map(month => {
            const expenseEntries = expenses.filter(exp => getYearMonth(exp.date) === month);
            return expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
        });

        return { labels, incomeData, expenseData };
    };

    // Show data for three years backwards from the current month
    const showThreeYears = () => {
        const threeYearsAgo = currentDate.clone().subtract(3, 'years');

        const yearEntries = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).isBetween(threeYearsAgo, currentDate, null, '[]'))
            .map(entry => getYearMonth(entry.date));

        const uniqueMonths = Array.from(new Set(yearEntries))
            .sort((a, b) => moment(a, 'YYYY-MM').diff(moment(b, 'YYYY-MM')));

        const labels = uniqueMonths.map(month => getMonthName(month));

        const incomeData = uniqueMonths.map(month => {
            const incomeEntries = incomes.filter(inc => getYearMonth(inc.date) === month);
            return incomeEntries.reduce((sum, income) => sum + income.amount, 0);
        });

        const expenseData = uniqueMonths.map(month => {
            const expenseEntries = expenses.filter(exp => getYearMonth(exp.date) === month);
            return expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
        });

        return { labels, incomeData, expenseData };
    };

    // Show data for five years backwards from the current month
    const showFiveYears = () => {
        const fiveYearsAgo = currentDate.clone().subtract(5, 'years');

        const yearEntries = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).isBetween(fiveYearsAgo, currentDate, null, '[]'))
            .map(entry => getYearMonth(entry.date));

        const uniqueMonths = Array.from(new Set(yearEntries))
            .sort((a, b) => moment(a, 'YYYY-MM').diff(moment(b, 'YYYY-MM')));

        const labels = uniqueMonths.map(month => getMonthName(month));

        const incomeData = uniqueMonths.map(month => {
            const incomeEntries = incomes.filter(inc => getYearMonth(inc.date) === month);
            return incomeEntries.reduce((sum, income) => sum + income.amount, 0);
        });

        const expenseData = uniqueMonths.map(month => {
            const expenseEntries = expenses.filter(exp => getYearMonth(exp.date) === month);
            return expenseEntries.reduce((sum, expense) => sum + expense.amount, 0);
        });

        return { labels, incomeData, expenseData };
    };

    // Auswahl der anzuzeigenden Daten basierend auf viewMode
    const { labels, incomeData, expenseData } =
        viewMode === 'currentMonth' ? showCurrentMonth() :
        viewMode === 'currentYear' ? showCurrentYear() :
        viewMode === 'oneYear' ? showOneYear() :
        viewMode === 'threeYears' ? showThreeYears() :
        viewMode === 'fiveYears' ? showFiveYears() :
        viewMode === 'allYears' ? showAllYears() :
        showCurrentMonth(); // Default fallback zu currentMonth

    const data = {
        labels,
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
                type: 'category',
                title: {
                    display: true,
                    text: viewMode === 'currentMonth' ? '' : '',
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
            <Line data={data} options={options} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    /* Styles remain the same */
`;

export default Chart;
