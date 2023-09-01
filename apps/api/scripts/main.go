package main

import (
	"flag"

	scripts "github.com/trysupernova/supernova-api/scripts/src"
)

func main() {
	tool := flag.String("tool", "migrate", "The tool to run")
	flag.Parse()
	switch *tool {
	case "migrate":
		scripts.Migrate()
	default:
		panic("Tool not found")
	}
}
