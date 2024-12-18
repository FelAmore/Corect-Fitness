import { useNavigate } from 'react-router-dom';
import '../App.css';

function Home() {
  const navigate = useNavigate(); // React Router hook to navigate

  const handleGetStarted = () => {
    navigate('/get-started'); 
  };

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="app-name">Corect</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Home Page Content */}
      <h1 className="home-title">Unlock Your Peak Performance with Corect</h1>
      <h2 className="home-subtitle">
        Transform the way you train with AI-powered form correction. Elevate every rep, every pose, and every workout to achieve your goals faster, safer, and smarter. Join the future of fitness today— where precision meets progress.
      </h2>

      {/* Get Started Button */}
      <button className="get-started-btn" onClick={handleGetStarted}>
        Get Started
      </button>    
    </>
  )
}

export default Home;

