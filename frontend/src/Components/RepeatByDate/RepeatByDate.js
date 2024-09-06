import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import { InnerLayout } from "../../styles/Layout";
import IncomeItem from "../IncomeItem/IncomeItem";

function RepeatByDate() {
  const { expenses, incomes, getExpenses, getIncomes } = useGlobalContext();

  useEffect(() => {
    getExpenses();
    getIncomes();
  }, []);

  return (
    <RepeatByDateStyled>
      <InnerLayout>
        <h1>Wiederholungen</h1>

        <div className="repeat-content">
          <h2>Wiederkehrende Ausgaben</h2>
          <div className="incomes">
            {expenses
              .filter((expense) => expense.repeated)  // Filter repeated expenses
              .map((expense) => {
                const { _id, title, amount, date, category, description } = expense;
                return (
                  <IncomeItem
                    key={_id}
                    id={_id}
                    title={title}
                    description={description}
                    amount={amount}
                    date={date}
                    type="Expense"
                    category={category}
                    indicatorColor="red"
                  />
                );
              })}
          </div>

          <h2>Wiederkehrende Einnahmen</h2>
          <div className="items-list">
            {incomes
              .filter((income) => income.repeated)  // Filter repeated incomes
              .map((income) => (
                <IncomeItem
                  key={income._id}
                  id={income._id}
                  title={income.title}
                  description={income.description}
                  amount={income.amount}
                  date={income.date}
                  category={income.category}
                  type="income"
                  indicatorColor="green"
                />
              ))}
          </div>
        </div>
      </InnerLayout>
    </RepeatByDateStyled>
  );
}

const RepeatByDateStyled = styled.div`
  .repeat-content {
    margin-top: 2rem;

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    h2 {
      margin-bottom: 1rem;
      font-size: 2rem;
    }
  }
`;

export default RepeatByDate;
