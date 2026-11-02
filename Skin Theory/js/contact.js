// ==========================================
// SKIN THEORY CONTACT FORM
// Validation and Email Processing
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");

    // Run only on pages containing the contact form.
    if (!contactForm) {
        return;
    }

    const contactName = document.getElementById("contactName");
    const contactEmail = document.getElementById("contactEmail");
    const contactPhone = document.getElementById("contactPhone");
    const contactSubject = document.getElementById("contactSubject");
    const contactMessage = document.getElementById("contactMessage");
    const contactConsent = document.getElementById("contactConsent");

    const contactResponse = document.getElementById("contactResponse");
    const contactEmailLink = document.getElementById("contactEmailLink");


    // Display an error beside a field.
    function showError(field, message) {

        document.getElementById(field + "Error").textContent = message;

    }


    // Remove an error message.
    function clearError(field) {

        document.getElementById(field + "Error").textContent = "";

    }


    // Validate all form fields.
    function validateContactForm() {

        let isValid = true;

        [
            "contactName",
            "contactEmail",
            "contactPhone",
            "contactSubject",
            "contactMethod",
            "contactMessage",
            "contactConsent"
        ].forEach(clearError);


        // Validate name.
        if (contactName.value.trim().length < 2) {

            showError(
                "contactName",
                "Please enter your full name."
            );

            isValid = false;

        }


        // Validate email.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(contactEmail.value.trim())) {

            showError(
                "contactEmail",
                "Please enter a valid email address."
            );

            isValid = false;

        }


        // Validate phone only if provided.
        if (
            contactPhone.value.trim() !== "" &&
            !/^[+()\d\s-]{7,20}$/.test(contactPhone.value.trim())
        ) {

            showError(
                "contactPhone",
                "Please enter a valid phone number."
            );

            isValid = false;

        }


        // Validate subject.
        if (contactSubject.value === "") {

            showError(
                "contactSubject",
                "Please select a reason for contacting us."
            );

            isValid = false;

        }


        // Validate preferred contact method.
        const selectedMethod = contactForm.querySelector(
            'input[name="contactMethod"]:checked'
        );

        if (!selectedMethod) {

            showError(
                "contactMethod",
                "Please select your preferred contact method."
            );

            isValid = false;

        }


        // Validate message.
        if (contactMessage.value.trim().length < 10) {

            showError(
                "contactMessage",
                "Please enter a message of at least 10 characters."
            );

            isValid = false;

        }


        // Validate consent.
        if (!contactConsent.checked) {

            showError(
                "contactConsent",
                "Please agree to be contacted about your enquiry."
            );

            isValid = false;

        }


        return isValid;

    }


    // Process the form.
    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        contactResponse.textContent = "";
        contactEmailLink.replaceChildren();

        if (!validateContactForm()) {

            contactResponse.textContent =
                "Please correct the errors before submitting the form.";

            contactResponse.className = "contact-form-error";

            return;

        }


        const selectedMethod = contactForm.querySelector(
            'input[name="contactMethod"]:checked'
        ).value;


        // Prepare the email.
        const emailSubject = "Skin Theory Contact: " + contactSubject.value;

        const emailBody =
            "Skin Theory Contact Enquiry\n\n" +
            "Name: " + contactName.value.trim() + "\n" +
            "Email: " + contactEmail.value.trim() + "\n" +
            "Phone: " + (contactPhone.value.trim() || "Not provided") + "\n" +
            "Subject: " + contactSubject.value + "\n" +
            "Preferred Contact Method: " + selectedMethod + "\n\n" +
            "Message:\n" + contactMessage.value.trim();


        // Replace this placeholder with your real business email.
        const businessEmail = "hello@skintheory.co.uk";

        const emailURL =
            "mailto:" + businessEmail +
            "?subject=" + encodeURIComponent(emailSubject) +
            "&body=" + encodeURIComponent(emailBody);


        // Display a successful preparation message.
        contactResponse.textContent =
            "Your contact form has been validated successfully. " +
            "Select the button below to open your email application " +
            "and send your enquiry.";

        contactResponse.className = "contact-form-success";


        // Create the email button safely.
        const emailButton = document.createElement("a");

        emailButton.href = emailURL;
        emailButton.textContent = "Open Email to Send Enquiry";
        emailButton.className = "contact-email-button";

        contactEmailLink.appendChild(emailButton);

    });


    // Clear errors as users correct their information.
    [
        ["contactName", contactName],
        ["contactEmail", contactEmail],
        ["contactPhone", contactPhone],
        ["contactSubject", contactSubject],
        ["contactMessage", contactMessage]
    ].forEach(function (item) {

        const errorId = item[0];
        const field = item[1];

        field.addEventListener("input", function () {
            clearError(errorId);
        });

        field.addEventListener("change", function () {
            clearError(errorId);
        });

    });


    // Clear the preferred contact method error.
    contactForm.querySelectorAll(
        'input[name="contactMethod"]'
    ).forEach(function (radio) {

        radio.addEventListener("change", function () {
            clearError("contactMethod");
        });

    });


    // Clear the consent error.
    contactConsent.addEventListener("change", function () {
        clearError("contactConsent");
    });

});