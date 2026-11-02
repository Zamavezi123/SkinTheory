// ==========================================
// SKIN THEORY ENQUIRY FORM
// Form Validation and Quotation Calculation
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const enquiryForm = document.getElementById("enquiryForm");

    // Run this code only on a page containing the enquiry form.
    if (!enquiryForm) {
        return;
    }

    const fullname = document.getElementById("fullname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const enquiryType = document.getElementById("enquiryType");
    const product = document.getElementById("product");
    const quantity = document.getElementById("quantity");
    const message = document.getElementById("message");
    const consent = document.getElementById("consent");

    const formResponse = document.getElementById("formResponse");
    const quotationResponse = document.getElementById("quotationResponse");


    // ==========================================
    // DISPLAY AN ERROR MESSAGE
    // ==========================================

    function showError(fieldId, errorText) {

        const errorElement = document.getElementById(fieldId + "Error");

        errorElement.textContent = errorText;

    }


    // ==========================================
    // CLEAR AN ERROR MESSAGE
    // ==========================================

    function clearError(fieldId) {

        const errorElement = document.getElementById(fieldId + "Error");

        errorElement.textContent = "";

    }


    // ==========================================
    // VALIDATE THE FORM
    // ==========================================

    function validateForm() {

        let isValid = true;

        // Clear previous error messages.
        [
            "fullname",
            "email",
            "phone",
            "enquiryType",
            "product",
            "quantity",
            "message",
            "consent"
        ].forEach(clearError);


        // Validate full name.
        if (fullname.value.trim().length < 2) {

            showError(
                "fullname",
                "Please enter your full name."
            );

            isValid = false;

        }


        // Validate email address.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {

            showError(
                "email",
                "Please enter a valid email address."
            );

            isValid = false;

        }


        // Validate phone number if the user enters one.
        if (
            phone.value.trim() !== "" &&
            !/^[+()\d\s-]{7,20}$/.test(phone.value.trim())
        ) {

            showError(
                "phone",
                "Please enter a valid phone number."
            );

            isValid = false;

        }


        // Validate enquiry type.
        if (enquiryType.value === "") {

            showError(
                "enquiryType",
                "Please select an enquiry type."
            );

            isValid = false;

        }


        // Validate product selection.
        if (product.value === "") {

            showError(
                "product",
                "Please select a product."
            );

            isValid = false;

        }


        // Validate quantity.
        const quantityValue = Number(quantity.value);

        if (
            quantity.value.trim() === "" ||
            !Number.isInteger(quantityValue) ||
            quantityValue < 1 ||
            quantityValue > 20
        ) {

            showError(
                "quantity",
                "Enter a whole number between 1 and 20."
            );

            isValid = false;

        }


        // Validate enquiry message.
        if (message.value.trim().length < 10) {

            showError(
                "message",
                "Please enter a message of at least 10 characters."
            );

            isValid = false;

        }


        // Validate consent.
        if (!consent.checked) {

            showError(
                "consent",
                "Please agree to be contacted about your enquiry."
            );

            isValid = false;

        }


        return isValid;

    }


    // ==========================================
    // CALCULATE THE QUOTATION
    // ==========================================

    function calculateQuotation() {

        const selectedProduct = product.options[product.selectedIndex];

        const unitPrice = Number(product.value);

        const quantityValue = Number(quantity.value);

        const subtotal = unitPrice * quantityValue;

        return {
            productName: selectedProduct.textContent,
            unitPrice: unitPrice,
            quantity: quantityValue,
            subtotal: subtotal
        };

    }


    // ==========================================
    // HANDLE FORM SUBMISSION
    // ==========================================

    enquiryForm.addEventListener("submit", function (event) {

        // Prevent the browser from navigating away.
        event.preventDefault();

        // Remove previous responses.
        formResponse.textContent = "";
        quotationResponse.innerHTML = "";

        // Validate every required field.
        if (!validateForm()) {

            formResponse.textContent =
                "Please correct the errors above before submitting.";

            formResponse.className = "form-error";

            return;

        }


        // Calculate the estimated quotation.
        const quotation = calculateQuotation();

        // Display a success message.
        formResponse.textContent =
            "Thank you, " + fullname.value.trim() +
            "! Your enquiry has been prepared successfully.";

        formResponse.className = "form-success";


        // Display the quotation.
        quotationResponse.innerHTML = `
            <h2>Your Estimated Quotation</h2>

            <p>
                <strong>Selected product:</strong>
                ${quotation.productName}
            </p>

            <p>
                <strong>Quantity:</strong>
                ${quotation.quantity}
            </p>

            <p>
                <strong>Price per item:</strong>
                R${quotation.unitPrice.toFixed(2)}
            </p>

            <p>
                <strong>Estimated total:</strong>
                R${quotation.subtotal.toFixed(2)}
            </p>

            <p>
                This is an estimated product total.
                It is not a confirmed order or payment.
            </p>
        `;

        // Move the customer to the response.
        quotationResponse.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });


    // ==========================================
    // CLEAR ERRORS WHEN THE USER CORRECTS A FIELD
    // ==========================================

    [
        fullname,
        email,
        phone,
        enquiryType,
        product,
        quantity,
        message
    ].forEach(function (field) {

        field.addEventListener("input", function () {
            clearError(field.id);
        });

        field.addEventListener("change", function () {
            clearError(field.id);
        });

    });


    consent.addEventListener("change", function () {
        clearError("consent");
    });

});