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
    
    const [viewMode, setViewMode] = useState('currentMonth');

    // Hilfsfunktion zur Berechnung des Gesamtbetrags für Einnahmen/Ausgaben je nach Zeitraum
    const calculateTotal = (entries, timeFilter) => {
        const currentDate = moment();
        let filteredEntries = [];

        switch (timeFilter) {
            case 'currentMonth':
                filteredEntries = entries.filter(entry => moment(entry.date).isSame(currentDate, 'month'));
                break;
            case 'currentYear':
                filteredEntries = entries.filter(entry => moment(entry.date).year() === currentDate.year());
                break;
            case 'oneYear':
                filteredEntries = entries.filter(entry =>
                    moment(entry.date).isBetween(currentDate.clone().subtract(1, 'years'), currentDate, null, '[]')
                );
                break;
            case 'threeYears':
                filteredEntries = entries.filter(entry =>
                    moment(entry.date).isBetween(currentDate.clone().subtract(3, 'years'), currentDate, null, '[]')
                );
                break;
            case 'fiveYears':
                filteredEntries = entries.filter(entry =>
                    moment(entry.date).isBetween(currentDate.clone().subtract(5, 'years'), currentDate, null, '[]')
                );
                break;
            case 'fullYear':
                filteredEntries = entries; // Gesamte Einträge
                break;
            default:
                filteredEntries = entries;
        }

        return filteredEntries.reduce((sum, entry) => sum + entry.amount, 0);
    };

    // Berechnung des Gesamteinkommens basierend auf dem aktuellen viewMode
    const getTotalIncome = () => calculateTotal(incomes, viewMode);

    // Berechnung der Gesamtausgaben basierend auf dem aktuellen viewMode
    const getTotalExpenses = () => calculateTotal(expenses, viewMode);

    // Berechnung des Gesamtsaldos
    const getTotalBalance = () => getTotalIncome() - getTotalExpenses();

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
                            <button onClick={() => setViewMode('currentYear')}>Aktuelles Jahr</button>
                            <button onClick={() => setViewMode('oneYear')}>1 Jahr</button>
                            <button onClick={() => setViewMode('threeYears')}>3 Jahre</button>
                            <button onClick={() => setViewMode('fiveYears')}>5 Jahre</button>
                            <button onClick={() => setViewMode('fullYear')}>Gesamt Verlauf</button>
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
