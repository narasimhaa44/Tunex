import styles from "./HomeDashboard.module.css";
// We can reuse or create a new css, for now reuse some styles or inline

const MoodAnalyser = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            textAlign: 'center'
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🌪️</h1>
            <h2>Mood Analyser</h2>
            <p style={{ color: '#888', marginTop: '10px' }}>Coming soon...</p>
        </div>
    );
};

export default MoodAnalyser;
