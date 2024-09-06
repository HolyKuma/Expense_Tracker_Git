import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layout';
import IncomeItem from '../IncomeItem/IncomeItem';

function AllHistory() {
    const { allTransactions, getExpenses, getIncomes, deleteExpense, deleteIncome,repeatIncome, repeatExpense } = useGlobalContext();

    useEffect(() => {
        getExpenses();
        getIncomes();
    }, []);

    // Combine and sort all transactions by date
    const history = allTransactions().sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <AllHistoryStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="history-content">
                    {history.map((item) => {
                        const { _id, title, amount, date, category, description, type } = item;
                        return (
                            <IncomeItem
                                key={_id}
                                id={_id}
                                title={title}
                                description={description}
                                amount={amount}
                                date={date}
                                type={type}
                                category={category}
                                indicatorColor={type === 'Expense' ? 'red' : 'green'}
                                deleteItem={type === 'Expense' ? deleteExpense : deleteIncome}
                                repeatItem={type === 'Expense' ? repeatExpense : repeatIncome}
                            />
                        );
                    })}
                </div>
            </InnerLayout>
        </AllHistoryStyled>
    );
}

const AllHistoryStyled = styled.div`
    .history-content {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    h1 {
        margin-bottom: 1.5rem;
        font-size: 2rem;
        font-weight: bold;
    }
`;

export default AllHistory;
