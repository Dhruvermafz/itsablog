import React from "react";

const ContactForm = () => {
  return (
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <form
          class="form-floating-space"
          id="contactForm"
          data-sb-form-api-token="API_TOKEN"
        >
          <div class="form-floating mb-3">
            <input
              class="form-control rounded-5"
              id="name"
              type="text"
              placeholder="Enter your name..."
              data-sb-validations="required"
            />
            <label for="name">Full name</label>
            <div class="invalid-feedback" data-sb-feedback="name:required">
              A name is required.
            </div>
          </div>

          <div class="form-floating mb-3">
            <input
              class="form-control rounded-5"
              id="email"
              type="email"
              placeholder="name@example.com"
              data-sb-validations="required,email"
            />
            <label for="email">Email address</label>
            <div class="invalid-feedback" data-sb-feedback="email:required">
              An email is required.
            </div>
            <div class="invalid-feedback" data-sb-feedback="email:email">
              Email is not valid.
            </div>
          </div>

          <div class="form-floating mb-3">
            <input
              class="form-control rounded-5"
              id="phone"
              type="tel"
              placeholder="(123) 456-7890"
              data-sb-validations="required"
            />
            <label for="phone">Phone number</label>
            <div class="invalid-feedback" data-sb-feedback="phone:required">
              A phone number is required.
            </div>
          </div>

          <div class="form-floating mb-3">
            <textarea
              class="form-control rounded-5"
              id="message"
              placeholder="Enter your message here..."
              style={{ height: "10rem" }}
              data-sb-validations="required"
            ></textarea>
            <label for="message">Message</label>
            <div class="invalid-feedback" data-sb-feedback="message:required">
              A message is required.
            </div>
          </div>

          <div class="d-none" id="submitSuccessMessage">
            <div class="text-center mb-3">
              <div class="fw-bolder">Form submission successful!</div>
              To activate this form, sign up at
            </div>
          </div>

          <div class="d-none" id="submitErrorMessage">
            <div class="text-center text-danger mb-3">
              Error sending message!
            </div>
          </div>

          <div class="d-grid">
            <button
              class="btn btn-primary w-100 rounded-5 text-decoration-none py-3 fw-bold text-uppercase m-0"
              id="submitButton"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
