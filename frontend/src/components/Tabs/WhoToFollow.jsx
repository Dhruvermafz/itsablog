import React from "react";

const WhoToFollow = () => {
  return (
    <div class="bg-white rounded-4 overflow-hidden shadow-sm account-follow mb-4">
      <h6 class="fw-bold text-body p-3 mb-0 border-bottom">Who to follow</h6>

      <div class="p-3 border-bottom d-flex text-dark text-decoration-none account-item">
        <a href="profile.html">
          <img
            src="img/rmate5.jpg"
            class="img-fluid rounded-circle me-3"
            alt="profile-img"
          />
        </a>
        <div>
          <p class="fw-bold mb-0 pe-3 d-flex align-items-center">
            <a class="text-decoration-none text-dark" href="profile.html">
              Webartinfo
            </a>
            <span class="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon">
              done
            </span>
          </p>
          <div class="text-muted fw-light">
            <p class="mb-1 small">@abcdsec</p>
            <span class="text-muted d-flex align-items-center small">
              <span class="material-icons me-1 small">open_in_new</span>
              Promoted
            </span>
          </div>
        </div>
        <div class="ms-auto">
          <div
            class="btn-group"
            role="group"
            aria-label="Basic checkbox toggle button group"
          >
            <input type="checkbox" class="btn-check" id="btncddheck7" />
            <label
              class="btn btn-outline-primary btn-sm px-3 rounded-pill"
              for="btncddheck7"
            >
              <span class="follow">+ Follow</span>
              <span class="following d-none">Following</span>
            </label>
          </div>
        </div>
      </div>

      <div class="p-3 border-bottom d-flex text-dark text-decoration-none account-item">
        <a href="profile.html">
          <img
            src="img/rmate4.jpg"
            class="img-fluid rounded-circle me-3"
            alt="profile-img"
          />
        </a>
        <div>
          <p class="fw-bold mb-0 pe-3 d-flex align-items-center">
            <a class="text-decoration-none text-dark" href="profile.html">
              John Smith
            </a>
            <span class="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon">
              done
            </span>
          </p>
          <div class="text-muted fw-light">
            <p class="mb-1 small">@johnsmith</p>
            <span class="text-muted d-flex align-items-center small">
              Designer
            </span>
          </div>
        </div>
        <div class="ms-auto">
          <div
            class="btn-group"
            role="group"
            aria-label="Basic checkbox toggle button group"
          >
            <input type="checkbox" class="btn-check" id="btncheck8" />
            <label
              class="btn btn-outline-primary btn-sm px-3 rounded-pill"
              for="btncheck8"
            >
              <span class="follow">+ Follow</span>
              <span class="following d-none">Following</span>
            </label>
          </div>
        </div>
      </div>

      <div class="p-3 d-flex text-dark text-decoration-none account-item">
        <a href="profile.html">
          <img
            src="img/rmate3.jpg"
            class="img-fluid rounded-circle me-3"
            alt="profile-img"
          />
        </a>
        <div>
          <p class="fw-bold mb-0 pe-3 d-flex align-items-center">
            <a class="text-decoration-none text-dark" href="profile.html">
              Konex
            </a>
            <span class="ms-2 material-icons bg-primary p-0 md-16 fw-bold text-white rounded-circle ov-icon">
              done
            </span>
          </p>
          <div class="text-muted fw-light">
            <p class="mb-1 small">@Konex</p>
            <span class="text-muted d-flex align-items-center small">
              Artist/Author...
            </span>
          </div>
        </div>
        <div class="ms-auto">
          <div
            class="btn-group"
            role="group"
            aria-label="Basic checkbox toggle button group"
          >
            <input type="checkbox" class="btn-check" id="btncheck9" />
            <label
              class="btn btn-outline-primary btn-sm px-3 rounded-pill"
              for="btncheck9"
            >
              <span class="follow">+ Follow</span>
              <span class="following d-none">Following</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoToFollow;
