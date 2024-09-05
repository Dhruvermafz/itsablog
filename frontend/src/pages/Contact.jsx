import React from "react";
import ContactForm from "../components/Contact/ContactForm";

const Contact = () => {
  return (
    <main class="col col-xl-6 order-xl-2 col-lg-12 order-lg-1 col-md-12 col-sm-12 col-12">
      <div class="main-content">
        <div class="mb-5">
          <div class="feature bg-primary bg-gradient text-white rounded-4 mb-3">
            <i class="icofont-envelope"></i>
          </div>
          <h1 class="fw-bold text-black mb-1">How can we help?</h1>
          <p class="lead fw-normal text-muted mb-0">
            We'd love to hear from you
          </p>
        </div>

        <div class="feeds">
          <div class="bg-white p-4 feed-item rounded-4 shadow-sm faq-page">
            <div class="mb-3">
              <h5 class="lead fw-bold text-body mb-0">Contact Form</h5>
            </div>
            <ContactForm />
            <div class="row row-cols-2 row-cols-lg-4 pt-5">
              <div class="col">
                <div class="feature bg-primary bg-gradient text-white rounded-4 mb-3">
                  <i class="icofont-chat"></i>
                </div>
                <div class="h6 mb-2 fw-bold text-black">Chat with us</div>
                <p class="text-muted mb-0">
                  Chat live with one of our support specialists.
                </p>
              </div>
              <div class="col">
                <div class="feature bg-primary bg-gradient text-white rounded-4 mb-3">
                  <i class="icofont-people"></i>
                </div>
                <div class="h6 fw-bold text-black">Ask the community</div>
                <p class="text-muted mb-0">
                  Explore our community forums and communicate with other users.
                </p>
              </div>
              <div class="col">
                <div class="feature bg-primary bg-gradient text-white rounded-4 mb-3">
                  <i class="icofont-question-circle"></i>
                </div>
                <div class="h6 fw-bold text-black">Support center</div>
                <p class="text-muted mb-0">
                  Browse FAQ's and support articles to find solutions.
                </p>
              </div>
              <div class="col">
                <div class="feature bg-primary bg-gradient text-white rounded-4 mb-3">
                  <i class="icofont-telephone"></i>
                </div>
                <div class="h6 fw-bold text-black">Call us</div>
                <p class="text-muted mb-0">
                  Call us during normal business hours at (555) 892-9403.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
