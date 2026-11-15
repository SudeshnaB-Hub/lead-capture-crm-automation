# Make.com setup guide

This guide describes how to configure the Make.com scenario shown in the project overview.

## 1. Lead intake sheet

Create a Google Sheet for incoming leads. Suggested columns:

- `Name`
- `Email`
- `Phone`
- `Message`
- `Timestamp` (optional)

The Google Sheets **Watch New Rows** module is the scenario trigger. Map the columns into the JSON keys shown below. Make's field labels may retain their original capitalization; the JSON request keys must match the Apps Script keys exactly.

## 2. HTTP module

Insert **HTTP → Make a request** between Google Sheets and the Router.

Suggested configuration:

| Setting | Value |
|---|---|
| Method | POST |
| URL | Deployed Apps Script web-app URL ending in `/exec` |
| Body content type | application/json |
| Body input method | Data structure or raw JSON |
| Parse response | Yes |
| Allow redirects | Yes |

The JSON body must contain these exact keys:

- `apiSecret`
- `name`
- `email`
- `phone`
- `message`

Map the four lead fields from Google Sheets. The `apiSecret` must match the secret configured in Apps Script. Do not put a real secret in this repository.

Example request structure:

```json
{
  "apiSecret": "YOUR_SECRET",
  "name": "mapped name",
  "email": "mapped email",
  "phone": "mapped phone",
  "message": "mapped message"
}
```

## 3. Router

Add a Router immediately after the HTTP module.

### Valid route

Filter:
- Left operand: HTTP module → `Data` → `valid`
- Operator: Equal to
- Right operand: Boolean `true`

Connect this route to Airtable → Create a Record. Map Airtable fields from the HTTP response's `data` collection. Continue to Gmail → Notify Lead and Gmail → Notify Business Owner.

### Invalid route

Filter:
- Left operand: HTTP module → `Data` → `valid`
- Operator: Equal to
- Right operand: Boolean `false`

Connect this route to Google Sheets → Add a Row, targeting a separate `Invalid Leads` tab. Suggested columns: received time, name, email, phone, message, and validation errors.

## 4. Test the scenario

1. Use **Run once**.
2. Add a new row to the watched Google Sheet; a Watch New Rows trigger normally detects new rows rather than edits to older rows.
3. Inspect the HTTP module output.
4. Confirm `valid` is a Boolean `true` or `false`.
5. Confirm only the corresponding Router route executes.
6. Check Airtable/Gmail for a valid lead, or the Invalid Leads sheet for an invalid lead.

## 5. Operational notes

- Avoid sending real personal data during portfolio testing; use synthetic test records.
- Prevent duplicate CRM records if the same lead can be submitted more than once. A possible enhancement is to search Airtable by normalized email before creating a record.
- Consider adding an error handler for transport/API failures. A request that fails to reach Apps Script is different from a successfully processed request with `valid: false`.
- Do not enable the recurring schedule until manual tests pass.
