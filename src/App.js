import './App.css';
import AverageCost from './pages/AverageCost'; // 우리가 만든 AverageCost 페이지를 불러옵니다.

function App() {
  return (
    <div className="App">
      {/* 이제 우리 앱은 AverageCost 컴포넌트를 보여줍니다. */}
      <AverageCost />
    </div>
  );
}

export default App;
