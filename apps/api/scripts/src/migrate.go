package scripts

import (
	"context"
	"fmt"
	"log"

	"ariga.io/atlas-go-sdk/atlasexec"
	"github.com/trysupernova/supernova-api/db"
	"github.com/trysupernova/supernova-api/utils"
)

func Migrate() {
	// Initialize the configuration.
	utils.InitConfig()

	// Define the execution context, supplying a migration directory
	// and potentially an `atlas.hcl` configuration file using `atlasexec.WithHCL`.
	// Initialize the client.
	client, err := atlasexec.NewClient("./migrations", "atlas")
	if err != nil {
		log.Fatalf("failed to initialize client: %v", err)
	}

	// Run `atlas migrate apply` on a SQLite database under /tmp.
	res, err := client.Apply(context.Background(), &atlasexec.ApplyParams{
		URL: db.GetDatabaseUrl(),
		Env: "gorm",
	})
	if err != nil {
		log.Fatalf("failed to apply migrations: %v", err)
	}
	fmt.Printf("Current migration version: %s\n", res.Current)
	fmt.Printf("Target migration version: %s\n", res.Target)
	if res.Error != "" {
		fmt.Printf("Error: %s\n", res.Error)
		return
	}
	// show applied migrations and duration in seconds to 2 decimal places
	fmt.Printf("🚀 Applied %d migrations in %.2f secs", len(res.Applied), res.End.Sub(res.Start).Seconds())
}
