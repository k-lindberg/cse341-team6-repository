const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }
            
            window.location.href = url.toString();
        });
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');
    const paginationEl = document.getElementById('trains-pagination');
    const previousButton = document.getElementById('trains-previous');
    const nextButton = document.getElementById('trains-next');
    const pageStatus = document.getElementById('trains-page-status');

    if (!listEl || !templateEl) {
        return;
    }

    let currentPage = 1;
    let totalPages = 1;

    const loadTrains = async (page) => {
        if (loadingEl) {
            loadingEl.hidden = false;
            loadingEl.textContent = 'Loading trains...';
        }

        if (errorEl) {
            errorEl.hidden = true;
        }

        if (paginationEl) {
            paginationEl.hidden = true;
        }

        try {
            const response = await fetch(`/api/trains?page=${page}`);

            if (!response.ok) {
                throw new Error(`Failed to load trains (${response.status})`);
            }

            const payload = await response.json();
            const trains = payload.trains || [];
            const pagination = payload.pagination;

            currentPage = pagination?.currentPage ?? page;
            totalPages = pagination?.totalPages ?? 1;

            const fragment = document.createDocumentFragment();

            trains.forEach((train) => {
                const card = templateEl.content.cloneNode(true);
                const imageEl = card.querySelector('[data-field="image"]');

                imageEl.src = train.imageUrl || '';
                imageEl.alt = train.imageAlt || `${train.name} train`;

                card.querySelector('[data-field="name"]').textContent = train.name || '';
                card.querySelector('[data-field="operator"]').textContent = train.operator || '';
                card.querySelector('[data-field="type"]').textContent = train.type || '';
                card.querySelector('[data-field="speed"]').textContent =
                    `${train.maxSpeedKmh ?? ''} km/h`;
                card.querySelector('[data-field="seats"]').textContent =
                    `${train.capacity ?? ''} seats`;
                card.querySelector('[data-field="power"]').textContent = train.powerSource || '';
                card.querySelector('[data-field="description"]').textContent =
                    train.description || '';
                card.querySelector('[data-field="best-for"]').textContent = train.bestFor || '';

                fragment.appendChild(card);
            });

            listEl.replaceChildren(fragment);

            if (pageStatus) {
                pageStatus.textContent = `Page ${currentPage} of ${totalPages}`;
            }

            if (previousButton) {
                previousButton.disabled = currentPage <= 1;
            }

            if (nextButton) {
                nextButton.disabled = currentPage >= totalPages;
            }

            if (paginationEl) {
                paginationEl.hidden = totalPages <= 1;
            }

            if (loadingEl) {
                loadingEl.hidden = true;
            }
        } catch (error) {
            if (loadingEl) {
                loadingEl.hidden = true;
            }

            if (errorEl) {
                errorEl.hidden = false;
                errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
            }
        }
    };

    previousButton?.addEventListener('click', () => {
        if (currentPage > 1) {
            loadTrains(currentPage - 1);
        }
    });

    nextButton?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadTrains(currentPage + 1);
        }
    });

    await loadTrains(currentPage);
};

const hookUsersManagement = async () => {
    const listEl = document.getElementById("users-list");
    const messageEl = document.getElementById("users-message");
    const templateEl = document.getElementById("user-card-template");
    const dialogEl = document.getElementById("edit-user-dialog");
    const formEl = document.getElementById("edit-user-form");
    const cancelEl = document.getElementById("cancel-edit");
    const editMessageEl = document.getElementById("edit-user-message");

    if (!listEl || !messageEl || !templateEl) {
        return;
    }

    let selectedUserId = null;

    const loadUsers = async () => {
        messageEl.textContent = "Loading users...";
        listEl.replaceChildren();

        try {
            const response = await fetch("/users/api");
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message || "Unable to load users.");
            }

            if (!payload.users.length) {
                messageEl.textContent = "No users found.";
                return;
            }

            const fragment = document.createDocumentFragment();

            payload.users.forEach((user) => {
                const card = templateEl.content.cloneNode(true);
                const article = card.querySelector(".user-card");

                article.dataset.userId = user.id;
                article.querySelector('[data-field="name"]').textContent = user.displayName;
                article.querySelector('[data-field="username"]').textContent = user.username;
                article.querySelector('[data-field="email"]').textContent = user.email;
                article.querySelector('[data-field="role"]').textContent = user.role;

                fragment.appendChild(card);
            });

            listEl.replaceChildren(fragment);
            messageEl.textContent = `Showing ${payload.users.length} user(s).`;
        } catch (error) {
            messageEl.textContent = error.message;
        }
    };

    listEl.addEventListener("click", async (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        const card = button.closest(".user-card");
        const userId = card?.dataset.userId;
        if (!userId) return;

        if (button.dataset.action === "edit") {
            try {
                const response = await fetch("/users/api");
                const payload = await response.json();

                if (!response.ok) {
                    throw new Error(payload.message || "Unable to load user.");
                }

                const user = payload.users.find((item) => item.id === userId);
                if (!user) throw new Error("User not found.");

                selectedUserId = userId;
                formEl.elements.displayName.value = user.displayName;
                formEl.elements.username.value = user.username;
                formEl.elements.email.value = user.email;
                editMessageEl.textContent = "";
                dialogEl.showModal();
            } catch (error) {
                messageEl.textContent = error.message;
            }
        }

        if (button.dataset.action === "delete") {
            if (!window.confirm("Are you sure you want to delete this user?")) {
                return;
            }

            try {
                const response = await fetch(`/users/api/${encodeURIComponent(userId)}`, {
                    method: "DELETE",
                });
                const payload = await response.json();

                if (!response.ok) {
                    throw new Error(payload.message || "Unable to delete user.");
                }

                await loadUsers();
            } catch (error) {
                messageEl.textContent = error.message;
            }
        }
    });

    if (formEl) {
        formEl.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!selectedUserId) return;

            const updates = {
                displayName: formEl.elements.displayName.value,
                username: formEl.elements.username.value,
                email: formEl.elements.email.value,
            };

            try {
                const response = await fetch(
                    `/users/api/${encodeURIComponent(selectedUserId)}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updates),
                    },
                );

                const payload = await response.json();

                if (!response.ok) {
                    throw new Error(payload.message || "Unable to update user.");
                }

                dialogEl.close();
                await loadUsers();
            } catch (error) {
                editMessageEl.textContent = error.message;
            }
        });
    }

    cancelEl?.addEventListener("click", () => {
        dialogEl.close();
    });

    await loadUsers();
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookUsersManagement();
});