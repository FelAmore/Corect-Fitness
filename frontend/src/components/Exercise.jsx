import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import '../GetStarted.css';

function Exercise() {
    const navigate = useNavigate();
    const location = useLocation(); // To access exerciseType passed from GetStarted
    const exerciseType = location.state?.exerciseType || 'unknown'; // Fallback to 'unknown' if not provided

    const [selectedModel, setSelectedModel] = useState('cnn'); // Default model

    const handleBackClick = () => {
        navigate('/get-started'); 
    };

    const handleStartExercise = () => {
        // Log exercise type and model for verification
        console.log(`Selected Exercise: ${exerciseType}`);
        console.log(`Selected Model: ${selectedModel}`);

        // Pass both exerciseType and selectedModel to the /scan page
        navigate('/scan', { state: { exerciseType, model: selectedModel } }); 
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value); // Update selected model
    };

    return (
        <div className="exercise-container">
            <div className="back-arrow" onClick={handleBackClick}>
                <IoIosArrowBack size={30} color="black" /> {/* Back arrow */}
            </div>
            <div className="exercise-content">
                {/* Heading */}
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                    marginTop: '5rem',
                }}>
                    Select the Model You Want to Use
                </h1>

                {/* Show the selected exercise */}
                <h2 style={{
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    color: '#555',
                    marginBottom: '2rem',
                }}>
                    Exercise: {exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)}
                </h2>

                {/* Dropdown Menu */}
                <div style={{ textAlign: 'center' }}>
                    <select
                        className="exercise-dropdown"
                        value={selectedModel} // Bind selected value
                        onChange={handleModelChange} // Handle change
                    >
                        <option value="cnn">CNN</option>
                        <option value="cnn-with-attention">CNN with Attention</option>
                        <option value="transformer">Transformer</option>
                        <option value="vgg">VGG</option>
                    </select>
                </div>
            </div>

            <button className="exercise-btn" onClick={handleStartExercise}>
                Start Exercise
            </button>
        </div>
    );
}

export default Exercise;
