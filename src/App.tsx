import { useState } from 'react'
import './App.css'
import Selector from "./selector";

function App() {
  const [hex, setHex] = useState<string| number | undefined>('0')
  const [dec, setDec] = useState<string | number | undefined>(20)
  const [float, setFloat] = useState(111.888888)
  console.log(hex)

  return (
    <div className="App">
     <Selector bits={64} onValueChange={setHex}/>
    </div>
  )
}

export default App
