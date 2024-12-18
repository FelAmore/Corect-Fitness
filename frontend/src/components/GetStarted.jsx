import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../GetStarted.css';

import PushupsIcon from '../assets/pushups.png';
import SquatsIcon from '../assets/squat.png';
import PlanksIcon from '../assets/planks.png';

function GetStarted() {
  const navigate = useNavigate();

  // Navigate back to the home page
  const handleBackClick = () => {
    navigate('/');
  };

  // Navigate to the Exercise page and pass the selected exercise type
  const handleExerciseClick = (exercise) => {
    navigate('/exercise', { state: { exerciseType: exercise } });
  };

  return (
    <div className="get-started-container">
      <div className="back-arrow" onClick={handleBackClick}>
        <IoIosArrowBack size={30} color="black" /> {/* Back arrow */}
      </div>
      <div className="get-started-content">
        <h1>Choose an Exercise</h1>
        <h2>
          Whether you're focusing on strength, flexibility, or endurance, we've got you covered. Pick an exercise below and let Corect guide you toward perfect form and progress with every move.
        </h2>

        <div className="exercise-buttons">
          {/* Push-Ups Button */}
          <button
            className="exercise-button"
            onClick={() => handleExerciseClick('pushups')} // Use lowercase to simplify paths
          >
            <img src={PushupsIcon} alt="Push-Up Icon" className="exercise-icon" />
            <span className="exercise-label">Push-Ups</span>
          </button>

          {/* Squats Button */}
          <button
            className="exercise-button"
            onClick={() => handleExerciseClick('squats')}
          >
            <img src={SquatsIcon} alt="Squat Icon" className="exercise-icon" />
            <span className="exercise-label">Squats</span>
          </button>

          {/* Planks Button */}
          <button
            className="exercise-button"
            onClick={() => handleExerciseClick('planks')}
          >
            <img src={PlanksIcon} alt="Plank Icon" className="exercise-icon" />
            <span className="exercise-label">Planks</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
