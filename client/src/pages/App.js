import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SocketContext, socket} from '../context/Socket';
import Room from './Room/Room'
import Home from './Home/Home'


function App() {
    return (
        <SocketContext.Provider value={socket} >
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Room" element={<Room />} />
                </Routes>
            </Router>
        </ SocketContext.Provider>
    );
}

export default App;