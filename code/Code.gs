/**
 * Lead Validation API for a Make.com lead-capture workflow.
 *
 * Deploy as a Google Apps Script web app.
 * Configure the same secret in Make.com's HTTP JSON request body.
 *
 * Expected JSON keys:
 *   apiSecret, name, email, phone, message
 *
 * IMPORTANT:
 * - Replace the placeholder secret before deployment.
 * - Never commit the real secret to GitHub.
 * - Rotate the secret if it has been exposed.
 */

const API_SECRET = "REPLACE_WITH_A_NEW_RANDOM_SECRET";

/**
 * Health check. Open the deployed /exec URL in a browser to check deployment.
 */
function doGet() {
  return jsonResponse({
    status: "success",
    message: "Lead Validation API is running"
  });
}

/**
 * Accepts a JSON POST request and validates the lead fields.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({
        status: "error",
        message: "Request body is missing"
      });
    }

    const lead = JSON.parse(e.postData.contents);

    // Simple shared-secret check for this portfolio demonstration.
    if (!lead || lead.apiSecret !== API_SECRET) {
      return jsonResponse({
        status: "error",
        message: "Unauthorised request"
      });
    }

    const errors = [];

    const name = String(lead.name || "").trim();
    const email = String(lead.email || "").trim().toLowerCase();
    const phone = String(lead.phone || "").trim();
    const message = String(lead.message || "").trim();

    if (!name) {
      errors.push("Name is required");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.push("Email is required");
    } else if (!emailPattern.test(email)) {
      errors.push("Invalid email address");
    }

    // Allow common phone formatting characters, then validate digit count.
    const phonePattern = /^\+?[0-9\s()-]+$/;
    const phoneDigits = phone.replace(/\D/g, "");

    if (!phone) {
      errors.push("Phone number is required");
    } else if (
      !phonePattern.test(phone) ||
      phoneDigits.length < 10 ||
      phoneDigits.length > 15
    ) {
      errors.push("Invalid phone number");
    }

    if (!message) {
      errors.push("Message is required");
    }

    return jsonResponse({
      status: "success",
      valid: errors.length === 0,
      errors: errors,
      data: {
        name: name,
        email: email,
        phone: phone,
        message: message
      }
    });

  } catch (error) {
    // Avoid returning internal details to the caller.
    return jsonResponse({
      status: "error",
      message: "Unable to process request"
    });
  }
}

/**
 * Return a JSON response to the HTTP caller.
 */
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
