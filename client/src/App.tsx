import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Register from "./pages/Register"; 
import Login from "./pages/Login"; 
import Dashboard from "./pages/Dashboard"; 
import Tasks from "./pages/Tasks" 
import Projects from "./pages/Projects";
import ProjectTasks from "./pages/ProjectTasks";
import Team from "./pages/Team";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./Components/ProtectedRoute";
function App ()  {
  return(
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Navigate to = "/register" />} />
      <Route path = "/register" element = {<Register/>} />
      <Route path = "/login" element = {<Login/>} />
      <Route path = "/dashboard" element = {
        <ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path = "/tasks" element = {<Tasks/>} />
      <Route path = "/projects" element = {<ProtectedRoute><Projects/></ProtectedRoute>} />
       <Route path="/projects/:projectId/tasks" element={<ProtectedRoute><ProjectTasks/></ProtectedRoute>} />
       <Route path = "/team" element = {<Team/>} />
       <Route path = "/analytics" element = {<Analytics/>} />
    </Routes>
    </BrowserRouter>
  )

}
export default App