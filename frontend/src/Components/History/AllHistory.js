import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';

function AllHistory() {
    const {allTransactions} = useGlobalContext()

    const [...history] = allTransactions()

    return (
        <HistoryStyled>
            <h2>Recent History</h2>
            {history.map((item) =>{
                const {_id, title, amount, date, type} = item
                return (
                    <div key={_id} className="history-item">
                        <p style={{
                            color: type === 'Expense' ? 'red' : 'green'
                        }}>
                            {title}                
                        </p>
                        <p> 
                            {(dateFormat(date))} 
                        </p>

                        <p style={{
                            color: type === 'Expense' ? 'red' : 'green'
                        }}>
                            {
                                type === 'Expense' ? `€ ${amount <= 0 ? 0 : amount}` : `€${amount <= 0 ? 0: amount}`
                            }
                        </p>
                    </div>
                )
            })}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .history-item{
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

export default AllHistory