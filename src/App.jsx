
import Home from "./react_componets/pages/Home"
import Agreements from "./react_componets/pages/Agreements"
import Account from "./react_componets/pages/Account"
import "./app.css"
import {Route ,Routes} from "react-router-dom"
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/agreements" element={<Agreements/>}/>
      <Route path="/account" element={<Account/>}/>
    </Routes>
    </>
  )
}

export default App
