import logo from "./logo.svg";
import Sidebar from "./components/Common/Sidebar";
import RightSidebar from "./components/Common/RightSidebar";
import Router from "./routes/Router";
import ThemeWrapper from "./components/Theme/ThemeWrapper";
import Footer from "./components/Common/Footer";
function App() {
  return (
    <body className="bg-light">
      <div class="py-4">
        <div class="container">
          <div class="row position-relative">
            <ThemeWrapper />
            <Router />
            <Sidebar />
            <RightSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </body>
  );
}

export default App;
