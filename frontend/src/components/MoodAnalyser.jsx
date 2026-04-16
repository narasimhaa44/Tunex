import { useMemo, useState } from "react";
import styles from "./MoodAnalyser.module.css";

const MOOD_CONFIG = [
  { mood: "chill", tags: ["smooth", "peaceful", "soothing"] },
  { mood: "gym", tags: ["fast", "energetic", "beats"] },
  { mood: "love", tags: ["romantic", "soulful"] },
  { mood: "sad", tags: ["emotional", "moody", "nostalgia"] },
  { mood: "motivation", tags: ["energetic", "uplifting"] },
  { mood: "party", tags: ["dance", "fun", "beats"] },
];

const MoodAnalyser = ({ onMoodSelect }) => {
  const moodOptions = useMemo(() => MOOD_CONFIG, []);
  const [selectedMood, setSelectedMood] = useState("");

  const handleMoodClick = (selection) => {
    setSelectedMood(selection.mood);
    onMoodSelect({
      mood: selection.mood,
      tags: selection.tags,
    });
  };

  const activeMood = moodOptions.find(
    (entry) => entry.mood === selectedMood,
  );

  return (
    <div className={styles.moodCard}>
      <h2 className={styles.title}>Mood Analyser</h2>
      <p className={styles.subtitle}>
        {activeMood ? `Selected: ${activeMood.mood}` : ""}
      </p>

      <div className={styles.moodGrid}>
        {moodOptions.map((entry) => {
          const key = entry.mood;
          return (
            <button
              key={key}
              className={`${styles.moodChip} ${selectedMood === key ? styles.activeMood : ""}`}
              onClick={() => handleMoodClick(entry)}
              title={`Tags: ${entry.tags.join(", ")}`}
            >
              {entry.mood}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default MoodAnalyser;