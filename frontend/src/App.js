import styled from "styled-components";
import bg from './img/bg.png';
import { MainLayout } from "./styles/Layout";
import Orb from "./Components/Orb/Orb";
import Navigation from "./Components/Navigation/Navigation";
import { useMemo, useState } from "react";
import Dashboard from './Components/Dashboard/Dashboard';
import Transactions from './Components/Transactions/Transactions';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from "./context/globalContext";
import RepeatByDate from './Components/RepeatByDate/RepeatByDate'

function App() {
  const [active, setActive] = useState(1)
  const global = useGlobalContext ()



  const displayData= () => {
    switch(active) {
      case 1:
        return <Dashboard />
      case 2:
        return <Transactions/>
      case 3:
        return <Income />
      case 4:
        return <Expenses />
      case 5:
        return <RepeatByDate/>
      default:
      return <Dashboard />
    }
  }

  const orbMemo = useMemo(() => {
    return <Orb />
  },[])


  return (
    <AppStyled bg={bg} className="App">
      {orbMemo}
      <MainLayout>
        <Navigation active={active} setActive={(setActive)}/>
        <main>
          {displayData()}
        </main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main{
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar{
      width: 0;
    }
  }
`;

export default App;
