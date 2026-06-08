/**
 * RateShield Dashboard
 * Frontend client for the RateShield API gateway.
 */

const API_BASE = "http://127.0.0.1:8000";

const STORAGE_KEYS = {
    userId: "rateshield_user_id",
    apiKey: "rateshield_api_key",
};

const PAGES = ["home", "register", "generate-key", "playground", "stats"];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function $(selector) {
    return document.querySelector(selector);
}

function formatJson(data) {
    return JSON.stringify(data, null, 2);
}

function showAlert(element, message, type = "info") {
    element.textContent = message;
    element.className = `alert alert-${type}`;
    element.classList.remove("hidden");
}

function hideAlert(element) {
    element.classList.add("hidden");
    element.textContent = "";
}

function setLoading(button, isLoading, defaultText) {
    button.disabled = isLoading;
    button.textContent = isLoading ? "Loading…" : defaultText;
}

function maskApiKey(key) {
    if (!key || key.length < 8) return key || "";
    return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

function saveToStorage(key, value) {
    if (value) {
        localStorage.setItem(key, String(value));
    } else {
        localStorage.removeItem(key);
    }
}

function getFromStorage(key) {
    return localStorage.getItem(key);
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, options);
    let body;

    try {
        body = await response.json();
    } catch {
        body = { detail: "Non-JSON response received" };
    }

    return { response, body };
}

// ---------------------------------------------------------------------------
// Session display
// ---------------------------------------------------------------------------

function updateSessionSummary() {
    const userId = getFromStorage(STORAGE_KEYS.userId);
    const apiKey = getFromStorage(STORAGE_KEYS.apiKey);

    const userEl = $("#session-user");
    const keyEl = $("#session-key");

    if (userEl) {
        userEl.innerHTML = userId
            ? `User ID: <strong>${userId}</strong>`
            : 'User ID: <em>Not set</em>';
    }

    if (keyEl) {
        keyEl.innerHTML = apiKey
            ? `API Key: <strong>${maskApiKey(apiKey)}</strong>`
            : 'API Key: <em>Not set</em>';
    }
}

function prefillCredentials() {
    const userId = getFromStorage(STORAGE_KEYS.userId);
    const apiKey = getFromStorage(STORAGE_KEYS.apiKey);

    const userIdInput = $("#generate-user-id");
    const apiKeyInput = $("#playground-api-key");

    if (userIdInput && userId && !userIdInput.value) {
        userIdInput.value = userId;
    }

    if (apiKeyInput && apiKey && !apiKeyInput.value) {
        apiKeyInput.value = apiKey;
    }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

function navigateTo(page) {
    const target = PAGES.includes(page) ? page : "home";

    document.querySelectorAll(".page").forEach((section) => {
        section.classList.toggle("active", section.dataset.page === target);
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.dataset.nav === target);
    });

    if (target === "stats") {
        loadStats();
    }

    if (target === "home") {
        checkApiStatus();
    }

    if (target === "generate-key" || target === "playground") {
        prefillCredentials();
    }
}

function initRouter() {
    function handleRoute() {
        const hash = window.location.hash.replace("#", "") || "home";
        navigateTo(hash);
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();
}

// ---------------------------------------------------------------------------
// Home — GET /
// ---------------------------------------------------------------------------

async function checkApiStatus() {
    const indicator = $("#status-indicator");
    const responseEl = $("#status-response");
    const statusText = indicator?.querySelector(".status-text");

    if (!indicator || !responseEl) return;

    indicator.className = "status-indicator status-loading";
    if (statusText) statusText.textContent = "Checking connection…";
    responseEl.textContent = "Waiting for response…";

    try {
        const { response, body } = await apiRequest("/");

        if (response.ok) {
            indicator.className = "status-indicator status-online";
            if (statusText) statusText.textContent = "API online";
            responseEl.textContent = formatJson(body);
        } else {
            indicator.className = "status-indicator status-offline";
            if (statusText) statusText.textContent = `API error (${response.status})`;
            responseEl.textContent = formatJson(body);
        }
    } catch (error) {
        indicator.className = "status-indicator status-offline";
        if (statusText) statusText.textContent = "Cannot reach API";
        responseEl.textContent = `Connection failed: ${error.message}\n\nEnsure the backend is running at ${API_BASE}`;
    }
}

// ---------------------------------------------------------------------------
// Register — POST /register
// ---------------------------------------------------------------------------

async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const alertEl = $("#register-alert");
    const button = $("#btn-register");

    const name = form.name.value.trim();
    const email = form.email.value.trim();

    if (!name || !email) {
        showAlert(alertEl, "Please enter both name and email.", "warning");
        return;
    }

    hideAlert(alertEl);
    setLoading(button, true, "Create account");

    const params = new URLSearchParams({ name, email });

    try {
        const { response, body } = await apiRequest(`/register?${params}`, {
            method: "POST",
        });

        if (response.ok) {
            saveToStorage(STORAGE_KEYS.userId, body.user_id);
            updateSessionSummary();
            prefillCredentials();
            showAlert(
                alertEl,
                `Account created successfully. User ID: ${body.user_id}`,
                "success"
            );
            form.reset();
        } else {
            showAlert(
                alertEl,
                body.detail || `Registration failed (${response.status})`,
                "error"
            );
        }
    } catch (error) {
        showAlert(alertEl, `Request failed: ${error.message}`, "error");
    } finally {
        setLoading(button, false, "Create account");
    }
}

// ---------------------------------------------------------------------------
// Generate Key — POST /generate-key
// ---------------------------------------------------------------------------

async function handleGenerateKey(event) {
    event.preventDefault();

    const form = event.target;
    const alertEl = $("#generate-key-alert");
    const button = $("#btn-generate-key");
    const keyResult = $("#key-result");
    const keyValue = $("#generated-key-value");

    const userId = form.user_id.value.trim();

    if (!userId || Number(userId) < 1) {
        showAlert(alertEl, "Please enter a valid user ID.", "warning");
        return;
    }

    hideAlert(alertEl);
    keyResult.classList.add("hidden");
    setLoading(button, true, "Generate key");

    const params = new URLSearchParams({ user_id: userId });

    try {
        const { response, body } = await apiRequest(`/generate-key?${params}`, {
            method: "POST",
        });

        if (response.ok) {
            saveToStorage(STORAGE_KEYS.userId, userId);
            saveToStorage(STORAGE_KEYS.apiKey, body.api_key);
            updateSessionSummary();
            prefillCredentials();

            keyValue.textContent = body.api_key;
            keyResult.classList.remove("hidden");
            showAlert(alertEl, "API key generated and saved to your browser.", "success");
        } else {
            showAlert(
                alertEl,
                body.detail || `Key generation failed (${response.status})`,
                "error"
            );
        }
    } catch (error) {
        showAlert(alertEl, `Request failed: ${error.message}`, "error");
    } finally {
        setLoading(button, false, "Generate key");
    }
}

async function copyApiKey() {
    const key = $("#generated-key-value")?.textContent;
    const alertEl = $("#generate-key-alert");

    if (!key) return;

    try {
        await navigator.clipboard.writeText(key);
        showAlert(alertEl, "API key copied to clipboard.", "success");
    } catch {
        showAlert(alertEl, "Could not copy automatically. Select and copy manually.", "warning");
    }
}

// ---------------------------------------------------------------------------
// Playground — GET /protected & GET /gateway/weather
// ---------------------------------------------------------------------------

function updatePlaygroundPreview(endpoint) {
    const apiKey = $("#playground-api-key")?.value.trim();
    const preview = $("#playground-request-preview");

    if (!preview) return;

    if (!apiKey) {
        preview.textContent = "Configure your API key above, then choose an endpoint.";
        return;
    }

    preview.textContent = [
        `GET ${API_BASE}${endpoint}`,
        `X-API-Key: ${maskApiKey(apiKey)}`,
    ].join("\n");
}

async function callPlaygroundEndpoint(endpoint, button) {
    const alertEl = $("#playground-alert");
    const responseEl = $("#playground-response");
    const statusBadge = $("#playground-status");
    const apiKey = $("#playground-api-key")?.value.trim();
    const defaultText = button.textContent;

    hideAlert(alertEl);
    updatePlaygroundPreview(endpoint);

    if (!apiKey) {
        showAlert(alertEl, "Enter an API key before sending a request.", "warning");
        return;
    }

    saveToStorage(STORAGE_KEYS.apiKey, apiKey);
    updateSessionSummary();

    setLoading(button, true, defaultText);
    responseEl.textContent = "Sending request…";
    statusBadge.textContent = "…";
    statusBadge.className = "badge badge-muted";

    try {
        const { response, body } = await apiRequest(endpoint, {
            method: "GET",
            headers: {
                "X-API-Key": apiKey,
            },
        });

        responseEl.textContent = formatJson(body);

        if (response.ok) {
            statusBadge.textContent = `${response.status} OK`;
            statusBadge.className = "badge badge-success";
            showAlert(alertEl, "Request completed successfully.", "success");
        } else if (response.status === 429) {
            statusBadge.textContent = "429 Rate Limited";
            statusBadge.className = "badge badge-warning";
            showAlert(alertEl, body.detail || "Rate limit exceeded.", "warning");
        } else if (response.status === 401) {
            statusBadge.textContent = "401 Unauthorized";
            statusBadge.className = "badge badge-error";
            showAlert(alertEl, body.detail || "Invalid API key.", "error");
        } else {
            statusBadge.textContent = `${response.status} Error`;
            statusBadge.className = "badge badge-error";
            showAlert(alertEl, body.detail || "Request failed.", "error");
        }
    } catch (error) {
        statusBadge.textContent = "Failed";
        statusBadge.className = "badge badge-error";
        responseEl.textContent = `Connection failed: ${error.message}`;
        showAlert(alertEl, `Request failed: ${error.message}`, "error");
    } finally {
        setLoading(button, false, defaultText);
    }
}

// ---------------------------------------------------------------------------
// Stats — GET /stats
// ---------------------------------------------------------------------------

async function loadStats() {
    const alertEl = $("#stats-alert");
    const rawEl = $("#stats-raw");
    const updatedEl = $("#stats-updated");
    const button = $("#btn-refresh-stats");

    hideAlert(alertEl);
    setLoading(button, true, "Refresh stats");

    try {
        const { response, body } = await apiRequest("/stats");

        if (response.ok) {
            $("#stat-total").textContent = body.total_requests ?? "—";
            $("#stat-approved").textContent = body.approved_requests ?? "—";
            $("#stat-blocked").textContent = body.blocked_requests ?? "—";
            $("#stat-success-rate").textContent = body.success_rate ?? "—";
            rawEl.textContent = formatJson(body);

            const now = new Date().toLocaleTimeString();
            updatedEl.textContent = `Last updated: ${now}`;
        } else {
            showAlert(
                alertEl,
                body.detail || `Failed to load stats (${response.status})`,
                "error"
            );
        }
    } catch (error) {
        showAlert(alertEl, `Request failed: ${error.message}`, "error");
        rawEl.textContent = `Connection failed: ${error.message}`;
    } finally {
        setLoading(button, false, "Refresh stats");
    }
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
    updateSessionSummary();
    prefillCredentials();

    $("#btn-check-status")?.addEventListener("click", checkApiStatus);
    $("#register-form")?.addEventListener("submit", handleRegister);
    $("#generate-key-form")?.addEventListener("submit", handleGenerateKey);
    $("#btn-copy-key")?.addEventListener("click", copyApiKey);
    $("#btn-refresh-stats")?.addEventListener("click", loadStats);

    $("#btn-call-protected")?.addEventListener("click", (e) => {
        callPlaygroundEndpoint("/protected", e.currentTarget);
    });

    $("#btn-call-weather")?.addEventListener("click", (e) => {
        callPlaygroundEndpoint("/gateway/weather", e.currentTarget);
    });

    $("#playground-api-key")?.addEventListener("input", () => {
        updatePlaygroundPreview("/protected");
    });
});
