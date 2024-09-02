import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../History/History';
import { InnerLayout } from '../../styles/Layout';
import { euro } from '../../utils/Icons';
import Chart from '../Chart/Chart';
import moment from 'moment';

function Dashboard() {
    const { incomes, expenses, getIncomes, getExpenses } = useGlobalContext();

    // Manage the view mode state here
    const [viewMode, setViewMode] = useState('currentMonth');

    const getTotalIncome = () => {
        if (viewMode === 'currentMonth') {
            const currentMonthIncomes = incomes.filter(income => moment(income.date).isSame(moment(), 'month'));
            return currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
        } else {
            return incomes.reduce((sum, income) => sum + income.amount, 0); // Full year
        }
    };

    const getTotalExpenses = () => {
        if (viewMode === 'currentMonth') {
            const currentMonthExpenses = expenses.filter(expense => moment(expense.date).isSame(moment(), 'month'));
            return currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        } else {
            return expenses.reduce((sum, expense) => sum + expense.amount, 0); // Full year
        }
    };

    const getTotalBalance = () => {
        return getTotalIncome() - getTotalExpenses();
    };

    useEffect(() => {
        getIncomes();
        getExpenses();
    }, []);

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <div className="view-mode-buttons">
                            <button onClick={() => setViewMode('currentMonth')}>Aktueller Monat</button>
                            <button onClick={() => setViewMode('fullYear')}>Ganzes Jahr</button>
                        </div>
                        <Chart viewMode={viewMode} />
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p style={{ color: 'green' }}>
                                    {euro} {getTotalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p style={{ color: 'red' }}>
                                    {euro} {getTotalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p style={{ color: getTotalBalance() < 0 ? 'red' : 'green' }}>
                                    {euro} {getTotalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                €{Math.min(...incomes.map(item => item.amount))}
                            </p>
                            <p>
                                €{Math.max(...incomes.map(item => item.amount))}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                €{Math.min(...expenses.map(item => item.amount))}
                            </p>
                            <p>
                                €{Math.max(...expenses.map(item => item.amount))}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .stats-con{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
        .chart-con{
            grid-column: 1 / 4;
            height: 400px;
            .view-mode-buttons {
                display: flex;
                gap: 1rem;
                margin-bottom: 1rem;
                button {
                    padding: 0.5rem 1rem;
                    background-color: #f4f4f4;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;

                    &:hover {
                        background-color: #e2e2e2;
                    }
                }
            }
            .amount-con{
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-top: 2rem;
                .income, .expense{
                    grid-column: span 2;
                }
                .income, .expense, .balance{
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1rem;
                    p{
                        font-size: 3rem;
                        font-weight: 700;
                    }
                }
                .balance{
                    grid-column: 2 / 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    p{
                        opacity: 1;
                        font-size: 3.5rem;
                    }
                }
            }
        }

        .history-con{
            grid-column: 4 / -1;
            h2{
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .salary-title{
                font-size: 1.2rem;
                span{
                    font-size: 1.8rem;
                }
            }
            .salary-item{
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p{
                    font-weight: 600;
                    font-size: 1.6rem;
                }
            }
        }
    }
`;

export default Dashboard;
