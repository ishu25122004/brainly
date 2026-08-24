import {Dashboard} from "./pages/Dashboard"
import {Signup} from "./pages/signup"
import {Signin} from "./pages/signin"
import {SharedBrain} from "./pages/SharedBrain" //added
import {BrowserRouter , Routes , Route, Navigate} from "react-router-dom" //added Navigate
import {ThemeProvider} from "./hooks/useTheme"

function App(){
  return (
    <ThemeProvider>
      <BrowserRouter>
         <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/share/:shareLink" element={<SharedBrain/>}/> {/* added - shared brain page */}
          <Route path="/" element={<Navigate to="/signin" />}/> {/* added - default redirect */}
         </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
export default App

//svg is a formate in which if we zoom the pixxel is not shatter , it has vector path info