import { useState, useEffect } from 'react'
import Claim from "./components/Claim"
import StockChart from "./components/StockChart"
import { Twse } from "./components/StockData"

function App() {
  const stockData = Twse();
  const [showFullData, setShowFullData] = useState(false);
  const [gameResult, setGameResult] = useState(false);
  const [longButtonPressed, setLongButtonPressed] = useState(false);
  const [shortButtonPressed, setShortButtonPressed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isStockUp = stockData.slice(-1)[0]?.value > stockData.slice(-2, -1)[0]?.value;

  useEffect(() => {
    if (showFullData) {
      determineWinner();
    }
  }, [showFullData]);

  const determineWinner = () => {
    if (isStockUp) {
      setGameResult(longButtonPressed);
    } else {
      setGameResult(shortButtonPressed);
    }
  };

  const handleLongClick = () => {
    setLongButtonPressed(true);
    setShortButtonPressed(false);
    setShowFullData(true);
  };

  const handleShortClick = () => {
    setShortButtonPressed(true);
    setLongButtonPressed(false);
    setShowFullData(true);
  };

  const getButtonStyle = (isPressed: boolean, isCorrect: boolean) => ({
    margin: 'auto',
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: isPressed
    ? isCorrect
      ? 'rgb(40, 167, 69)'
      : 'rgb(220, 53, 69)'
    : 'white',
    color: isPressed ? 'white' : 'black',
    border: '1px solid black',
    cursor: 'pointer',
  });

  return (
    <>
      <div style={{
        marginInline: 'auto',
        paddingTop: '1rem',
        maxWidth: '360px',
        backgroundColor: '#F0F0F0',
      }}>
        {
          showModal ? 
          <div style={{opacity: '0.5'}}>
            <StockChart data={showFullData ? stockData : stockData.slice(0, -1)} />
          </div> : 
          <div style={{opacity: '1'}}>
            <StockChart data={showFullData ? stockData : stockData.slice(0, -1)} />
          </div>
        }
        <div style={{display: 'flex'}}>
          <button 
            onClick={handleLongClick}
            style={getButtonStyle(longButtonPressed, isStockUp)}
            aria-pressed={longButtonPressed}
          >
            做多Long
          </button>
          <button 
            onClick={handleShortClick}
            style={getButtonStyle(shortButtonPressed, !isStockUp)}
            aria-pressed={shortButtonPressed}
          >
            做空Short
          </button>
        </div>
      </div>
      <Claim gameResult={gameResult} showModal={showModal} setShowModal={setShowModal}/>
    </>
  )
}

export default App
