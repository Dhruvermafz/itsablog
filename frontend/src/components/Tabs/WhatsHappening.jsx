import React from "react";

const WhatsHappening = () => {
  return (
    <div class="bg-white rounded-4 overflow-hidden shadow-sm mb-4">
      <h6 class="fw-bold text-body p-3 mb-0 border-bottom">What's happening</h6>

      <a
        href="tags.html"
        class="p-3 border-bottom d-flex align-items-center text-dark text-decoration-none"
      >
        <div>
          <div class="text-muted fw-light d-flex align-items-center">
            <small>Celebrity</small>
            <span class="mx-1 material-icons md-3">circle</span>
            <small>Live</small>
          </div>
          <p class="fw-bold mb-0 pe-3">Happy birthday, Osahan 🎂</p>
          <small class="text-muted">Trending with</small>
          <br />
          <span class="text-primary">#HappyBirthdayJohnSmith</span>
        </div>
        <img
          src="img/rmate4.jpg"
          class="img-fluid rounded-4 ms-auto"
          alt="profile-img"
        />
      </a>

      <a
        href="tags.html"
        class="p-3 border-bottom d-flex align-items-center text-dark text-decoration-none"
      >
        <div>
          <div class="text-muted fw-light d-flex align-items-center"></div>
          <p class="fw-bold mb-0 pe-3">#SelectricsM12</p>
          <small class="text-muted">Buy now with exclusive offers</small>
          <br />
          <small class="text-muted d-flex align-items-center">
            <span class="material-icons me-1 small">open_in_new</span>
            Promoted by Selectrics World
          </small>
        </div>
      </a>

      <div class="p-3 border-bottom d-flex">
        <div>
          <div class="text-muted fw-light d-flex align-items-center">
            <small>Trending in India</small>
          </div>
          <p class="fw-bold mb-0 pe-3 text-dark">#ME11Lite</p>
          <small class="text-muted">Buy now with exclusive offers</small>
          <br />
          <small class="text-muted">52.8k Tweets</small>
        </div>
        <div class="dropdown ms-auto">
          <a
            href="#"
            class="text-muted text-decoration-none material-icons ms-2 md-20 rounded-circle bg-light p-1"
            id="dropdownMenuButton5"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            more_vert
          </a>
          <ul
            class="dropdown-menu fs-13 dropdown-menu-end"
            aria-labelledby="dropdownMenuButton5"
          >
            <li>
              <a class="dropdown-item text-muted" href="#">
                <span class="material-icons md-13 me-1">
                  sentiment_very_dissatisfied
                </span>
                Not interested in this
              </a>
            </li>
            <li>
              <a class="dropdown-item text-muted" href="#">
                <span class="material-icons md-13 me-1">
                  sentiment_very_dissatisfied
                </span>
                This trend is harmful or spammy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="p-3 border-bottom d-flex">
        <div>
          <div class="text-muted fw-light d-flex align-items-center">
            <small>Trending in India</small>
          </div>
          <p class="fw-bold mb-0 pe-3 text-dark">News</p>
          <small class="text-muted">52.8k Tweets</small>
        </div>
        <div class="dropdown ms-auto">
          <a
            href="#"
            class="text-muted text-decoration-none material-icons ms-2 md-20 rounded-circle bg-light p-1"
            id="dropdownMenuButton6"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            more_vert
          </a>
          <ul
            class="dropdown-menu fs-13 dropdown-menu-end"
            aria-labelledby="dropdownMenuButton6"
          >
            <li>
              <a class="dropdown-item text-muted" href="#">
                <span class="material-icons md-13 me-1">
                  sentiment_very_dissatisfied
                </span>
                Not interested in this
              </a>
            </li>
            <li>
              <a class="dropdown-item text-muted" href="#">
                <span class="material-icons md-13 me-1">
                  sentiment_very_dissatisfied
                </span>
                This trend is harmful or spammy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <a
        href="tags.html"
        class="p-3 border-bottom d-flex align-items-center text-dark text-decoration-none"
      >
        <div>
          <div class="text-muted fw-light d-flex align-items-center">
            <small>Design</small>
            <span class="mx-1 material-icons md-3">circle</span>
            <small>Live</small>
          </div>
          <p class="fw-bold mb-0 pe-3">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <img
          src="img/trend1.jpg"
          class="img-fluid rounded-4 ms-auto"
          alt="trending-img"
        />
      </a>

      <a href="explore.html" class="text-decoration-none">
        <div class="p-3">Show More</div>
      </a>
    </div>
  );
};

export default WhatsHappening;
