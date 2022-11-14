import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { MainPage } from './Pages/MainPage';
import { LoginPage } from './Pages/LoginPage';
import { ManagePage } from './Pages/ManagePage';

import useToken from './Components/useToken';
import './App.css';

function App() {

  const { token, removeToken, setToken } = useToken();

  return (
    <Router>
      <div className='App' id='app__wrap'>
        {!token && token!=="" &&token!== undefined?
          <LoginPage setToken={setToken}/>
          :
          <>
            <Routes>
              <Route path='/' element={<MainPage token={token} setToken={setToken} removeToken={removeToken}/>} />
              {/* <Route path='/play' element={<PlayPage token={token} setToken={setToken}/>} /> */}
              <Route path='/manage' element={<ManagePage/>}/>
            </Routes>
          </>
        }
      </div>
    </Router>
  );
}

export default App;
