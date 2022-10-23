/*
    TODO
    - Disable all routes except Home and 404 if no auth (cookies empty)
*/

import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './App.css';
import Home from './pages/Home';
import ServerSelect from './pages/ServerSelect';
import ChatWindow from './pages/ChatWindow';
import NoPage from './pages/NoPage';
import UserManagement from './pages/UserManagement';

function App() {
  // ------ GLOBAL VARIABLES ------
  const [cookies, setCookie] = useCookies(['token']);

  let routable = false;
  if (cookies.token != 'null') {
    routable = true;
  }

  // Backend server URL
  window.$serverURL = "https://localhost:3000";

  // POST body generation function
  window.$generateForm = function generateForm(object) {
    var formBody = [];
    for (var property in object) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(object[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NoPage />} />
            {routable &&
              <>
                <Route path="servers" element={<ServerSelect />} />
                <Route path="chat" element={<ChatWindow />} />
                <Route path="user" element={<UserManagement />} />
              </>
            }
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );

}

export default App
