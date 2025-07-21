import React from "react";
import { AppRouter } from "./router/AppRouter.jsx";

function App() {
  // const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  //
  // useEffect(async () => {
  //   const apiUrl = "http://localhost:8080/api/account/users";
  //
  //   const token = "your_token_here"; // Replace with your actual token
  //
  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const response = await fetch(apiUrl, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setUsers(data);
  //     } catch (error) {
  //       setError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   await fetchUsers();
  // }, []);
  //
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  // if (error) {
  //   return <div>Error: {error.message}.</div>;
  // }

  return (
    <AppRouter />
  );
}

export default App;
