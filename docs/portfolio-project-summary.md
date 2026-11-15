# Portfolio project summary

## Lead Capture → CRM → Automated Follow-Up & Notification

**Objective:** Demonstrate how a small business can route incoming lead records through validation, CRM storage, and email notifications rather than relying on manual copying between tools.

### What the workflow does

1. Watches a Google Sheets lead-intake sheet for new rows.
2. Sends lead fields to a Google Apps Script endpoint using an HTTP POST request with a JSON body.
3. Validates name, email, phone, and message.
4. Routes valid and invalid submissions separately.
5. Creates an Airtable CRM record for valid submissions.
6. Sends an acknowledgement to the lead and a notification to the business owner.
7. Logs invalid submissions in a separate Google Sheets tab.

### Technical concepts demonstrated

- No-code workflow orchestration with Make.com
- HTTP POST requests and JSON payload mapping
- JavaScript input validation in Google Apps Script
- Boolean-based conditional routing
- CRM record creation
- Email notifications
- Separation of business validation failures from API/transport errors

### Scope and limitations

This project is a portfolio demonstration. The Apps Script performs basic field-format checks only. It does not verify that contact details are genuine, perform consent management, deduplicate leads, or provide enterprise-grade authentication. Add those capabilities only if implemented and tested.

### Suggested interview explanation

"I built a lead-capture workflow in Make.com that watches a Google Sheets intake sheet and sends each new record to a Google Apps Script endpoint over HTTP. The Apps Script validates required fields and returns a structured JSON response. A Make.com Router uses the Boolean validation result to send valid leads to Airtable and trigger two Gmail notifications, while invalid leads are written to a separate error-log sheet. This project let me practise API integration, JSON mapping, JavaScript validation, conditional routing, and workflow troubleshooting."
