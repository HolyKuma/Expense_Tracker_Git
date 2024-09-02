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
    const getMonthName = (date) => moment(date).format('MMMM');
    const getDay = (date) => moment(date).format('DD.MM');

    const showCurrentMonth = () => {
        const currentMonthDates = [...incomes, ...expenses]
            .filter(entry => moment(entry.date).isSame(currentDate, 'month'))
            .map(entry => dateFormat(entry.date))
            .sort((a, b) => moment(a, 'DD.MM').diff(moment(b, 'DD.MM')));

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

    const showFullYear = () => {
        const allYearMonths = [...incomes, ...expenses]
            .map(entry => getYearMonth(entry.date))
            .sort();

        const uniqueYearMonths = Array.from(new Set(allYearMonths));

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

    const { labels, incomeData, expenseData } = viewMode === 'currentMonth' ? showCurrentMonth() : showFullYear();

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
            <Line data={data} options={options} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    /* Styles remain the same */
`;

export default Chart;
