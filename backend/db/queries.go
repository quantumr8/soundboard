package db

import "fmt"

func GetAllSounds() ([]Sound, error) {
	rows, err := db.Query("SELECT id, name, filepath, tags FROM sounds")
	if err != nil {
		return nil, fmt.Errorf("querying sounds: %w", err)
	}
	defer rows.Close()

	var sounds []Sound
	for rows.Next() {
		var s Sound
		if err := rows.Scan(&s.ID, &s.Name, &s.FilePath, &s.Tags); err != nil {
			return nil, fmt.Errorf("scanning sound: %w", err)
		}
		sounds = append(sounds, s)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterating sounds: %w", err)
	}

	return sounds, nil
}