import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Room from './Room/Room'
import Home from './Home/Home'

function App() {
    return (  
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/room" element={<Room />}/>
            </Routes>
        </Router>
    );
}

export default App;