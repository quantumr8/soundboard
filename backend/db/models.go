package db

// Sound represents a sound file
type Sound struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Filepath string `json:"filepath"`
	Tags     string `json:"tags"`
}