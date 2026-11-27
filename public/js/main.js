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

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
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

const hookBookingsCatalog = async () => {
    const listEl = document.getElementById('bookings-list');
    const templateEl = document.getElementById('booking-card-template');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/bookings');

        if (!response.ok) {
            throw new Error(
                `Failed to load bookings (${response.status})`
            );
        }

        const bookings = await response.json();

        const fragment = document.createDocumentFragment();

        bookings.forEach((booking) => {
            const card = templateEl.content.cloneNode(true);

            card.querySelector('[data-field="booking-id"]')
                .textContent = booking.id;

            card.querySelector('[data-field="trip-id"]')
                .textContent = `Trip: ${booking.tripId}`;

            card.querySelector('[data-field="schedule-id"]')
                .textContent = `Schedule: ${booking.scheduleId}`;

            card.querySelector('[data-field="ticket-class"]')
                .textContent = `Class: ${booking.ticketClass}`;

            card.querySelector('[data-field="selected-day"]')
                .textContent = `Date: ${booking.selectedDay}`;

            card.querySelector('[data-field="passenger-count"]')
                .textContent = `Passengers: ${booking.passengers.length}`;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
    } catch (error) {
        console.error(error);
    }
};

const hookDashboardBookings = async () => {
    const listEl = document.getElementById('dashboard-bookings-list');

    if (!listEl) {
        return;
    }   

    try {
        const response = await fetch('/api/bookings/me');
        
        if (!response.ok) {
            throw new Error(`Failed to load user bookings (${response.status})`);
        }

        const bookings = await response.json();

        if (bookings.length === 0) {
            listEl.innerHTML = '<p>No bookings found.</p>';
            return;
        }

        listEl.innerHTML = bookings.map(booking => `
            <div class="booking-card">
                <h3>${booking.id}</h3>
                <p><strong>Trip:</strong> ${booking.tripId}</p>
                <p><strong>Schedule:</strong> ${booking.scheduleId}</p>
                <p><strong>Passengers:</strong> ${booking.passengers.length}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
        listEl.innerHTML = '<p>Unable to load your bookings at this time.</p>';
    }
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
    hookBookingsCatalog();
    hookDashboardBookings();
    hookUsersManagement();
});