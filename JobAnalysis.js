// Class to represent a Job object
class Job {
  constructor({ Title, Posted, Type, Level, Skill, Detail }) {
    this.title = Title || "Unknown Title";

    // Default to now if missing
    this.postedTime = new Date(Posted) || new Date();
    this.type = Type || "Unknown Type";
    this.level = Level || "Unknown Level";
    this.skill = Skill || "Unknown Skill";
    this.detail = Detail || "No details available.";
  }

  // Method to retrieve job details as formatted HTML
  getDetails() {
    return `
        <strong>Title:</strong> ${this.title}<br>
        <strong>Type:</strong> ${this.type}<br>
        <strong>Level:</strong> ${this.level}<br>
        <strong>Skill:</strong> ${this.skill}<br>
        <strong>Description:</strong> ${this.detail}<br>
        <strong>Posted:</strong> ${this.getFormattedPostedTime()}
      `;
  }

  // Method to format the posted time as a readable string
  getFormattedPostedTime() {
    return this.postedTime.toLocaleDateString();
  }
}

// Array to store all job objects and filtered job objects
let jobs = [];
let filteredJobs = [];

// Event listener for file upload
document.getElementById("upload").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jobData = JSON.parse(e.target.result);

        // Convert raw data to Job objects
        jobs = jobData.map((job) => new Job(job));

        // Initialize filter dropdowns
        initializeFilters(jobs);

        // Display all jobs initially
        displayJobs(jobs);
        document.getElementById("file-status").textContent =
          "File loaded successfully.";
      } catch (err) {
        showError("Invalid JSON file. Please upload a valid file.");
      }
    };
    // Read the uploaded file as text
    reader.readAsText(file);
  }
});

// Initialize dropdowns for filters
function initializeFilters(jobs) {
  const levels = [...new Set(jobs.map((job) => job.level))];
  const types = [...new Set(jobs.map((job) => job.type))];
  const skills = [...new Set(jobs.map((job) => job.skill))];

  populateFilter("level-filter", levels);
  populateFilter("type-filter", types);
  populateFilter("skill-filter", skills);

  // Attach event listeners to filter dropdowns
  document
    .getElementById("level-filter")
    .addEventListener("change", filterJobs);
  document.getElementById("type-filter").addEventListener("change", filterJobs);
  document
    .getElementById("skill-filter")
    .addEventListener("change", filterJobs);
  document
    .getElementById("clear-filters")
    .addEventListener("click", clearFilters);
}

// Populate a dropdown with options
function populateFilter(elementId, options) {
  const filter = document.getElementById(elementId);
  filter.innerHTML = '<option value="">All</option>';
  options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    filter.appendChild(opt);
  });
}

// Filter jobs based on selected criteria
function filterJobs() {
  const level = document.getElementById("level-filter").value;
  const type = document.getElementById("type-filter").value;
  const skill = document.getElementById("skill-filter").value;

  filteredJobs = jobs.filter(
    (job) =>
      (level === "" || job.level === level) &&
      (type === "" || job.type === type) &&
      (skill === "" || job.skill === skill)
  );

  // Update job list
  displayJobs(filteredJobs);
}

// Clear all filters and show all jobs
function clearFilters() {
  document.getElementById("level-filter").value = "";
  document.getElementById("type-filter").value = "";
  document.getElementById("skill-filter").value = "";
  displayJobs(jobs);
}

// Sort jobs based on selected criteria
function sortJobs() {
  const criteria = document.getElementById("sort-options").value;
  const jobsToSort = filteredJobs.length ? filteredJobs : jobs;

  jobsToSort.sort((a, b) => {
    if (criteria === "title-asc") return a.title.localeCompare(b.title);
    if (criteria === "title-desc") return b.title.localeCompare(a.title);
    if (criteria === "time-asc") return a.postedTime - b.postedTime;
    if (criteria === "time-desc") return b.postedTime - a.postedTime;
  });

  // Update job list
  displayJobs(jobsToSort);
}

document.getElementById("sort-jobs").addEventListener("click", sortJobs);

// Display the job list
function displayJobs(jobs) {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";

  if (jobs.length === 0) {
    jobList.innerHTML = "<p>No jobs available.</p>";
    return;
  }

  jobs.forEach((job) => {
    const jobItem = document.createElement("div");
    jobItem.className = "job-item";
    jobItem.textContent = `${job.title} - ${job.type} (${job.level})`;
    jobItem.addEventListener("click", () => openJobModal(job.getDetails()));
    jobList.appendChild(jobItem);
  });
}

// Open a modal to show job details
function openJobModal(content) {
  const modal = document.getElementById("job-modal");
  const overlay = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");

  modalContent.innerHTML = content;
  modal.classList.add("active");
  overlay.classList.add("active");

  document
    .getElementById("close-modal")
    .addEventListener("click", closeJobModal);
  overlay.addEventListener("click", closeJobModal);
}

// Close the job details modal
function closeJobModal() {
  const modal = document.getElementById("job-modal");
  const overlay = document.getElementById("modal-overlay");

  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// Display an error message
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
}
