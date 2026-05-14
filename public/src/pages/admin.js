async function loadUsers() {
    const response = await fetch("/admin/userData");
    const data = await response.json();

    displayUserList(data.users, data.currentUser);
}

function displayUserList(users, currentUser) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = users
        .map((user) => {
            const isAdmin = user.isAdmin;
            const isSelf = user.username == currentUser;

            return `
            <div class="user-item" id="row-${user.username}">
                <div class="user-info">
                    <strong>User: '${user.username}'</strong>
                    ${
                        isSelf
                            ? '<strong class="badge">SELF</strong>'
                            : isAdmin
                              ? '<span class="badge">Admin</span>'
                              : ""
                    }
                </div>

                <div class="user-info hidden" id="edit-form-${user.username}">
                    <input type="text" id="input-${user.username}" value="${user.username}">
                    <button class="secondary" onclick="submitNameChange('${user.username}')">Save</button>
                    <button onclick="toggleEditView('${user.username}')">Cancel</button>
                </div>

                <div class="controls">
                    <button
                        ${isSelf ? "disabled" : `onclick="toggleEditView('${user.username}')"`}>
                            Edit Name
                    </button>
                    
                    <button
                        ${isSelf ? "disabled" : `onclick="toggleAdminRole('${user.username}', ${isAdmin})"`}>
                        ${isAdmin ? "Demote" : "Promote"}
                    </button>

                    <button
                        ${isSelf ? "disabled" : `onclick="deleteUser('${user.username}')"`}>
                        Delete
                    </button>
                </div>
            </div>
        `;
        })
        .join("");
}

function toggleEditView(username) {
    document.getElementById(`display-${username}`).classList.toggle("hidden");
    document.getElementById(`edit-form-${username}`).classList.toggle("hidden");
}

async function submitNameChange(oldUsername) {
    const newUsername = document.getElementById(`input-${oldUsername}`).value;
    const response = await fetch("/admin/update-user-json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldUsername, newUsername }),
    });
    if (response.ok) window.location.reload();
}

async function toggleAdminRole(username, currentStatus) {
    if (!confirm("Change admin status?")) return;
    const response = await fetch("/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `targetUsername=${username}&newUsername=${username}&makeAdmin=${currentStatus ? "off" : "on"}`,
    });
    if (response.ok) window.location.reload();
}

async function deleteUser(username) {
    if (!confirm("Permanently delete this account?")) return;
    const response = await fetch("/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `targetUsername=${username}`,
    });
    if (response.ok) window.location.reload();
}

loadUsers();
