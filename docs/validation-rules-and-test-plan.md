# Validation rules and test plan

## Validation rules implemented in `code/Code.gs`

|Field|Required?|Validation|
|-|-:|-|
|Name|Yes|Trim whitespace; reject empty value|
|Email|Yes|Trim, lowercase, and apply a basic email-format regular expression|
|Phone|Yes|Allow common formatting characters and require 10–15 digits|
|Message|Yes|Trim whitespace; reject empty value|

The checks are lightweight form-input checks. They do not verify email ownership, phone reachability, consent, spam status, or business eligibility.

## Test cases

Use a new Google Sheets row for each trigger test.

|Case|Name|Email|Phone|Message|Expected|
|-|-|-|-|-|-|
|Valid lead|Demo Client|demo@example.com|\*\*\*\*\*\*\*\*\*\*|Interested in your services|`valid: true`|
|Missing name|blank|demo@example.com|\*\*\*\*\*\*\*\*\*\*|Interested|`Name is required`|
|Invalid email|Demo Client|demo-email|\*\*\*\*\*\*\*\*\*\*|Interested|`Invalid email address`|
|Missing phone|Demo Client|demo@example.com|blank|Interested|`Phone number is required`|
|Invalid phone|Demo Client|demo@example.com|12345|Interested|`Invalid phone number`|
|Missing message|Demo Client|demo@example.com|\*\*\*\*\*\*\*\*\*\*|blank|`Message is required`|
|Multiple invalid fields|blank|demo-email|blank|blank|Multiple errors|

## Expected routing

* `valid: true` → Airtable record creation and both Gmail notification modules.
* `valid: false` → append a row to the Invalid Leads Google Sheet tab.
* HTTP/API error (for example, wrong secret, unavailable endpoint, or malformed request) → this is not the same as `valid: false`. Handle transport/API failures separately with Make error handling and execution logs.

## Evidence checklist

Capture genuine execution evidence for:

* \[ ] Valid input and HTTP output (`valid: true`)
* \[ ] Invalid input and HTTP output (`valid: false`, with errors)
* \[ ] Valid route execution and Airtable record
* \[ ] Both Gmail notifications (hide email addresses and personal data)
* \[ ] Invalid route execution and Invalid Leads row
* \[ ] Error case, if you implement an error handler

Do not mark a test as passed until you have executed it and inspected the output.

