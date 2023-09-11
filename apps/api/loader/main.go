package main

import (
	"fmt"
	"io"
	"os"

	_ "ariga.io/atlas-go-sdk/recordriver"
	"ariga.io/atlas-provider-gorm/gormschema"
	"github.com/trysupernova/supernova-api/supernova_tasks"
	"github.com/trysupernova/supernova-api/user"
)

func main() {
	stmts, err := gormschema.New("mysql").Load(&user.SupernovaUser{}, &supernova_tasks.SupernovaTask{})
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to load gorm schema: %v\n", err)
		os.Exit(1)
	}
	_, _ = io.WriteString(os.Stdout, stmts)
}
