package email

import (
	"bytes"
	"context"
	"embed"
	"os"
	"text/template"

	"github.com/Boostport/mjml-go"
	"github.com/resendlabs/resend-go"
	"github.com/trysupernova/supernova-api/utils"
)

type EmailClient struct{}

func New() *EmailClient {
	return &EmailClient{}
}

type EmailSend struct {
	From    string
	To      []string
	Subject string
	Body    string
	ReplyTo string
}

func (e *EmailClient) SendEmail(send EmailSend) (string, error) {
	apiKey := os.Getenv("RESEND_API_KEY")
	client := resend.NewClient(apiKey)
	params := &resend.SendEmailRequest{
		To:      send.To,
		From:    send.From,
		Html:    send.Body,
		Subject: send.Subject,
		ReplyTo: send.ReplyTo,
	}

	sent, err := client.Emails.Send(params)
	if err != nil {
		return "", utils.NewAppError(ErrEmailSendFailed, "Failed to send email: "+err.Error())
	}
	return sent.Id, nil
}

//go:embed templates/*
var resources embed.FS

var tmpl = template.Must(template.ParseFS(resources, "templates/*"))

func CompileEmailForgotPassword(resetUrl string) (string, error) {
	// open a file
	// read the contents of the file into a string
	var result bytes.Buffer
	err := tmpl.Execute(&result, struct {
		Url string
	}{
		Url: resetUrl,
	})
	if err != nil {
		return "", err
	}
	renderedMjml := result.String()
	renderedHtml, err := mjml.ToHTML(context.Background(), renderedMjml, mjml.WithMinify(true))
	if err != nil {
		return "", utils.NewAppError(ErrEmailSendFailed, "Failed to compile email template to HTML: "+err.Error())
	}
	return renderedHtml, nil
}
