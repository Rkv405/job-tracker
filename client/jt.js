// =======================================
// GLOBAL VARIABLES
// =======================================

let jobs = [];
let currentFilter = "All";

// =======================================
// SAVE / LOAD JOBS
// =======================================

function saveJobs() {
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function loadJobs() {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) jobs = JSON.parse(savedJobs);
    renderJobs();
    renderApplications();
    updateStats();
}

// =======================================
// SECTION NAVIGATION
// =======================================

function showSection(sectionId) {
    const sections = [
        "dashboardSection",
        "applicationsSection",
        "profileSection",
        "alertsSection",
        "aiSection"
    ];
    sections.forEach(id => {
        document.getElementById(id).style.display = "none";
    });
    document.getElementById(sectionId).style.display = "block";

    if (sectionId === "applicationsSection") renderApplications();
    if (sectionId === "profileSection") loadProfile();
    if (sectionId === "alertsSection") fetchJobs();
}

// =======================================
// ADD JOB
// =======================================

function addJob() {
    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;
    const link = document.getElementById("link").value.trim();
    const notes = document.getElementById("notes").value.trim();
    const dateApplied = document.getElementById("dateApplied").value;

    if (!company) {
        alert("Please enter company name.");
        return;
    }

    jobs.push({ company, role, status, link, notes, dateApplied });
    saveJobs();
    renderJobs();
    renderApplications();
    updateStats();
    clearForm();
}

function clearForm() {
    document.getElementById("company").value = "";
    document.getElementById("link").value = "";
    document.getElementById("notes").value = "";
    document.getElementById("dateApplied").value = "";
    document.getElementById("status").selectedIndex = 0;
    document.getElementById("role").selectedIndex = 0;
}

// =======================================
// RENDER JOBS
// =======================================

function renderJobs() {
    const jobList = document.getElementById("jobList");
    jobList.innerHTML = "";

    let filteredJobs = jobs;
    if (currentFilter !== "All") {
        filteredJobs = jobs.filter(job => job.status === currentFilter);
    }

    if (filteredJobs.length === 0) {
        jobList.innerHTML = `<p class="empty-msg">No applications yet. Add one above.</p>`;
        return;
    }

    filteredJobs.forEach(job => {
        const index = jobs.indexOf(job);
        jobList.innerHTML += `
        <div class="job-card">
            <div class="job-info">
                <h3>${job.company}</h3>
                <p>${job.role}</p>
                ${job.dateApplied ? `<p>📅 ${job.dateApplied}</p>` : ""}
                ${job.notes ? `<p>📝 ${job.notes}</p>` : ""}
            </div>
            <div class="actions">
                <span class="status ${job.status.toLowerCase()}">${job.status}</span>
                ${job.link ? `<a class="link-btn" href="${job.link}" target="_blank">Open</a>` : ""}
                <button class="edit-btn" onclick="editJob(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
            </div>
        </div>`;
    });
}

function renderApplications() {
    const list = document.getElementById("applicationsList");
    list.innerHTML = "";

    if (jobs.length === 0) {
        list.innerHTML = `<p class="empty-msg">No applications yet.</p>`;
        return;
    }

    jobs.forEach((job, index) => {
        list.innerHTML += `
        <div class="job-card">
            <div class="job-info">
                <h3>${job.company}</h3>
                <p>${job.role}</p>
                ${job.dateApplied ? `<p>📅 ${job.dateApplied}</p>` : ""}
                ${job.notes ? `<p>📝 ${job.notes}</p>` : ""}
            </div>
            <div class="actions">
                <span class="status ${job.status.toLowerCase()}">${job.status}</span>
                ${job.link ? `<a class="link-btn" href="${job.link}" target="_blank">Open</a>` : ""}
                <button class="edit-btn" onclick="editJob(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
            </div>
        </div>`;
    });
}

// =======================================
// STATS
// =======================================

function updateStats() {
    const counts = { Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 };
    jobs.forEach(job => {
        if (counts[job.status] !== undefined) counts[job.status]++;
    });
    document.getElementById("appliedCount").innerText = counts.Applied;
    document.getElementById("oaCount").innerText = counts.OA;
    document.getElementById("interviewCount").innerText = counts.Interview;
    document.getElementById("offerCount").innerText = counts.Offer;
    document.getElementById("rejectedCount").innerText = counts.Rejected;
}

function handleCardClick(status, card) {
    currentFilter = status;
    document.querySelectorAll(".stat-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    renderJobs();
}

// =======================================
// DELETE / EDIT
// =======================================

function deleteJob(index) {
    if (!confirm("Delete this application?")) return;
    jobs.splice(index, 1);
    saveJobs();
    renderJobs();
    renderApplications();
    updateStats();
}

function editJob(index) {
    const job = jobs[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("editCompany").value = job.company;
    document.getElementById("editRole").value = job.role;
    document.getElementById("editStatus").value = job.status;
    document.getElementById("editLink").value = job.link || "";
    document.getElementById("editDate").value = job.dateApplied || "";
    document.getElementById("editNotes").value = job.notes || "";
    document.getElementById("editModal").style.display = "flex";
}

function saveEdit() {
    const index = document.getElementById("editIndex").value;
    jobs[index].company = document.getElementById("editCompany").value;
    jobs[index].role = document.getElementById("editRole").value;
    jobs[index].status = document.getElementById("editStatus").value;
    jobs[index].link = document.getElementById("editLink").value;
    jobs[index].dateApplied = document.getElementById("editDate").value;
    jobs[index].notes = document.getElementById("editNotes").value;
    saveJobs();
    renderJobs();
    renderApplications();
    updateStats();
    closeModal();
}

function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// =======================================
// SEARCH
// =======================================

function searchJobs() {
    const text = document.getElementById("searchBox").value.toLowerCase();
    const list = document.getElementById("applicationsList");
    list.innerHTML = "";

    const filtered = jobs.filter(job =>
        job.company.toLowerCase().includes(text) ||
        job.role.toLowerCase().includes(text)
    );

    if (filtered.length === 0) {
        list.innerHTML = `<p class="empty-msg">No results found.</p>`;
        return;
    }

    filtered.forEach((job, index) => {
        list.innerHTML += `
        <div class="job-card">
            <div class="job-info">
                <h3>${job.company}</h3>
                <p>${job.role}</p>
                ${job.dateApplied ? `<p>📅 ${job.dateApplied}</p>` : ""}
            </div>
            <div class="actions">
                <span class="status ${job.status.toLowerCase()}">${job.status}</span>
                ${job.link ? `<a class="link-btn" href="${job.link}" target="_blank">Open</a>` : ""}
                <button class="edit-btn" onclick="editJob(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteJob(${index})">Delete</button>
            </div>
        </div>`;
    });
}

// =======================================
// PROFILE
// =======================================

function saveProfile() {
    const profile = {
        name: document.getElementById("name").value,
        college: document.getElementById("college").value,
        branch: document.getElementById("branch").value,
        cgpa: document.getElementById("cgpa").value,
        graduation: document.getElementById("graduation").value,
        skills: document.getElementById("skills").value,
        github: document.getElementById("github").value,
        linkedin: document.getElementById("linkedin").value,
        resume: document.getElementById("resume").files.length > 0
            ? document.getElementById("resume").files[0].name : ""
    };
    localStorage.setItem("profile", JSON.stringify(profile));
    if (profile.resume) {
        document.getElementById("resumeStatus").innerHTML =
            `✅ <span style="color:#15803d; font-size:13px;">Resume saved: ${profile.resume}</span>`;
    }
    alert("Profile saved!");
}

function loadProfile() {
    const saved = localStorage.getItem("profile");
    if (!saved) return;
    const profile = JSON.parse(saved);
    document.getElementById("name").value = profile.name || "";
    document.getElementById("college").value = profile.college || "";
    document.getElementById("branch").value = profile.branch || "";
    document.getElementById("cgpa").value = profile.cgpa || "";
    document.getElementById("graduation").value = profile.graduation || "";
    document.getElementById("skills").value = profile.skills || "";
    document.getElementById("github").value = profile.github || "";
    document.getElementById("linkedin").value = profile.linkedin || "";
    if (profile.resume) {
        document.getElementById("resumeStatus").innerHTML =
            `✅ <span style="color:#15803d; font-size:13px;">Resume: ${profile.resume}</span>`;
    }
}

// =======================================
// EXPORT CSV
// =======================================

function exportCSV() {
    if (jobs.length === 0) { alert("No jobs to export."); return; }
    const headers = ["Company", "Role", "Status", "Date", "Notes", "Link"];
    const rows = jobs.map(job => [
        job.company, job.role, job.status,
        job.dateApplied || "",
        job.notes ? job.notes.replace(/,/g, " ") : "",
        job.link || ""
    ]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Applications.csv"; a.click();
    URL.revokeObjectURL(url);
}

// =======================================
// JOB ALERTS
// =======================================

async function fetchJobs(category = "software-dev") {
    const statusEl = document.getElementById("alertsStatus");
    const list = document.getElementById("alertsList");
    statusEl.textContent = "⏳ Fetching live jobs...";
    list.innerHTML = "";

    try {
        const res = await fetch(`https://remotive.com/api/remote-jobs?category=${category}&limit=15`);
        const data = await res.json();
        const jobs = data.jobs;

        if (!jobs.length) { statusEl.textContent = "No jobs found."; return; }
        statusEl.textContent = `✅ ${jobs.length} live jobs found`;

        list.innerHTML = jobs.map(job => {
            const salary = job.salary ? `💰 ${job.salary}` : "";
            const tags = job.tags
                ? job.tags.slice(0, 3).map(t => `<span class="tag">${t}</span>`).join("")
                : "";
            return `
            <div class="alert-card">
                <div class="alert-info">
                    <h3>${job.title}</h3>
                    <p>${job.company_name} — ${job.candidate_required_location || "Worldwide"}</p>
                    ${salary ? `<p class="salary">${salary}</p>` : ""}
                    <div class="tags">${tags}</div>
                </div>
                <a class="apply-btn" href="${job.url}" target="_blank">Apply</a>
            </div>`;
        }).join("");
    } catch (err) {
        statusEl.textContent = "❌ Failed to load jobs. Check your internet.";
    }
}

// =======================================
// AI — GEMINI API
// =======================================

async function callClaude(prompt) {
    let apiKey = localStorage.getItem("geminiKey") || "";

    if (!apiKey) {
        apiKey = document.getElementById("apiKey").value.trim();
        if (!apiKey) {
            alert("Please enter your Gemini API key first.");
            return null;
        }
        localStorage.setItem("geminiKey", apiKey);
    }

    document.getElementById("apiKey").value = apiKey;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
}

function clearApiKey() {
    localStorage.removeItem("geminiKey");
    document.getElementById("apiKey").value = "";
    alert("API key cleared.");
}

// ── Resume Reviewer ──────────────────────────────────────────────────────────

async function reviewResume() {
    const fileInput = document.getElementById("aiResume");
    const output = document.getElementById("resumeOutput");

    if (!fileInput.files[0]) { alert("Please upload your resume first."); return; }

    output.style.display = "block";
    output.className = "ai-output ai-loading";
    output.textContent = "⏳ Reading your resume and generating feedback...";

    const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(fileInput.files[0]);
    });

    const profile = JSON.parse(localStorage.getItem("profile") || "{}");

    const prompt = `You are a senior SWE recruiter at Google reviewing a resume for a B.Tech CS student targeting SWE internships.

Student profile:
- Branch: ${profile.branch || "CS"}
- CGPA: ${profile.cgpa || "not specified"}
- Skills: ${profile.skills || "not specified"}
- Graduation: ${profile.graduation || "not specified"}

Resume content:
${text}

Give exactly 5 specific actionable improvements. For each:
- Start with the area in caps (PROJECTS:, SKILLS:, FORMAT:, IMPACT:, ATS:)
- Be specific to what's actually in this resume
- Keep each point to 2-3 sentences

End with one overall VERDICT line.`;

    try {
        const feedback = await callClaude(prompt);
        output.className = "ai-output";
        output.textContent = feedback;
    } catch (err) {
        output.className = "ai-output";
        output.textContent = "❌ Error: " + err.message;
    }
}

// ── JD Matcher ───────────────────────────────────────────────────────────────

async function matchJD() {
    const jd = document.getElementById("jdInput").value.trim();
    const output = document.getElementById("jdOutput");

    if (!jd) { alert("Please paste a job description first."); return; }

    output.style.display = "block";
    output.className = "ai-output ai-loading";
    output.textContent = "⏳ Analysing job description against your profile...";

    const profile = JSON.parse(localStorage.getItem("profile") || "{}");

    const prompt = `You are an ATS system and career advisor.

Candidate profile:
- Skills: ${profile.skills || "not specified"}
- Branch: ${profile.branch || "CS"}
- CGPA: ${profile.cgpa || "not specified"}

Job Description:
${jd}

Respond with:
1. MATCH SCORE: X/100
2. MATCHING SKILLS: list what matches
3. MISSING SKILLS: list what's missing
4. QUICK VERDICT: one sentence — should they apply?

Be direct and specific.`;

    try {
        const result = await callClaude(prompt);
        output.className = "ai-output";
        output.textContent = result;
    } catch (err) {
        output.className = "ai-output";
        output.textContent = "❌ Error: " + err.message;
    }
}

// ── Interview Prep ───────────────────────────────────────────────────────────

async function prepInterview() {
    const company = document.getElementById("companyInput").value.trim();
    const output = document.getElementById("prepOutput");

    if (!company) { alert("Please enter a company name."); return; }

    output.style.display = "block";
    output.className = "ai-output ai-loading";
    output.textContent = `⏳ Generating interview questions for ${company}...`;

    const prompt = `You are a senior engineer who has interviewed at ${company}.

Generate interview prep for a SWE internship at ${company}:

DSA QUESTIONS (5):
List 5 likely coding questions with topic in brackets e.g. [Arrays], [DP]

HR QUESTIONS (3):
List 3 behavioural questions ${company} is known for

TIPS (2):
2 specific tips for ${company}'s interview process

Be specific to ${company}'s known interview style, not generic.`;

    try {
        const result = await callClaude(prompt);
        output.className = "ai-output";
        output.textContent = result;
    } catch (err) {
        output.className = "ai-output";
        output.textContent = "❌ Error: " + err.message;
    }
}

// ── Cover Letter Generator ───────────────────────────────────────────────────

async function generateCoverLetter() {
    const jd = document.getElementById("coverJD").value.trim();
    const company = document.getElementById("coverCompany").value.trim();
    const output = document.getElementById("coverOutput");
    const copyBtn = document.getElementById("coverCopyBtn");

    if (!company) { alert("Please enter the company name."); return; }
    if (!jd) { alert("Please paste a job description."); return; }

    output.style.display = "block";
    copyBtn.style.display = "none";
    output.className = "ai-output ai-loading";
    output.textContent = "⏳ Writing your cover letter...";

    const profile = JSON.parse(localStorage.getItem("profile") || "{}");

    const prompt = `You are a professional cover letter writer helping a student get a SWE internship.

Candidate details:
- Name: ${profile.name || "Ramkrishna Kumar"}
- College: ${profile.college || "B.Tech CS"}
- CGPA: ${profile.cgpa || "8.04"}
- Skills: ${profile.skills || "C++, Python, JavaScript, Node.js, MySQL"}
- GitHub: ${profile.github || "github.com/Rkv405"}

Company: ${company}

Job Description:
${jd}

Write a professional cover letter (3 paragraphs max):
- Paragraph 1: Why this company specifically — show you know them
- Paragraph 2: Match your specific skills and projects to their JD requirements  
- Paragraph 3: Strong closing with call to action

Rules:
- Do NOT use "I am writing to express my interest" — start with something confident
- Be specific to the JD keywords
- Under 250 words
- Sound like a confident 3rd year CS student, not a corporate robot`;

    try {
        const result = await callClaude(prompt);
        output.className = "ai-output";
        output.textContent = result;
        copyBtn.style.display = "block";
    } catch (err) {
        output.className = "ai-output";
        output.textContent = "❌ Error: " + err.message;
    }
}

function copyCoverLetter() {
    const text = document.getElementById("coverOutput").textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById("coverCopyBtn");
        btn.textContent = "✅ Copied!";
        setTimeout(() => btn.textContent = "📋 Copy to Clipboard", 2000);
    });
}

// =======================================
// INIT
// =======================================

window.onload = function () {
    loadJobs();
    loadProfile();
    const savedKey = localStorage.getItem("geminiKey");
    if (savedKey) document.getElementById("apiKey").value = savedKey;
};