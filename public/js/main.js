const hookRegionSorter = () => {
  const regionSelect = document.getElementById("region-filter");
  if (regionSelect) {
    regionSelect.addEventListener("change", () => {
      const selectedRegion = regionSelect.value;
      const url = new URL(window.location.href);

      if (selectedRegion && selectedRegion !== "all") {
        url.searchParams.set("region", selectedRegion);
      } else {
        url.searchParams.delete("region");
      }

      window.location.href = url.toString();
    });
  }
};

const hookSeasonSorter = () => {
  const seasonSelect = document.getElementById("season-filter");
  if (seasonSelect) {
    seasonSelect.addEventListener("change", () => {
      const selectedSeason = seasonSelect.value;
      const url = new URL(window.location.href);

      if (selectedSeason && selectedSeason !== "all") {
        url.searchParams.set("season", selectedSeason);
      } else {
        url.searchParams.delete("season");
      }

      window.location.href = url.toString();
    });
  }
};

const hookTrainsCatalog = async () => {
  const listEl = document.getElementById("trains-list");
  const templateEl = document.getElementById("train-card-template");
  const loadingEl = document.getElementById("trains-loading");
  const errorEl = document.getElementById("trains-error");

  if (!listEl || !templateEl) {
    return;
  }

  try {
    const response = await fetch("/api/trains");
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
      card.querySelector('[data-field="operator"]').textContent =
        train.operator;
      card.querySelector('[data-field="type"]').textContent = train.type;
      card.querySelector('[data-field="speed"]').textContent =
        `${train.maxSpeedKmh} km/h`;
      card.querySelector('[data-field="seats"]').textContent =
        `${train.capacity} seats`;
      card.querySelector('[data-field="power"]').textContent =
        train.powerSource;
      card.querySelector('[data-field="description"]').textContent =
        train.description;
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
      errorEl.textContent =
        "Unable to load trains right now. Please try again in a moment.";
    }
  }
};

const hookUsersManagement = async () => {
  const listEl = document.getElementById("users-list");
  const messageEl = document.getElementById("users-message");
  const templateEl = document.getElementById("user-card-template");
  const dialogEl = document.getElementById("edit-user-dialog");
  const formEl = document.getElementById("edit-user-form");
  const cancelEl = document.getElementById("cancel-edit");
  const editMessageEl = document.getElementById("edit-user-message");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageIndicator = document.getElementById("page-indicator");

  if (!listEl || !messageEl || !templateEl) {
    return;
  }

  let selectedUserId = null;
  let currentPage = 1;
  const LIMIT = 10;
  const usersCache = new Map();

  const loadUsers = async (page = 1) => {
    currentPage = page;
    messageEl.textContent = "Loading users...";
    listEl.replaceChildren();

    try {
      const response = await fetch(`/users/api?page=${page}&limit=${LIMIT}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to load users.");
      }

      const users = payload.data || [];
      const pagination = payload.pagination || {};

      usersCache.clear();
      users.forEach((u) => usersCache.set(u.id, u));

      if (!users.length) {
        messageEl.textContent = "No users found.";
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (pageIndicator) pageIndicator.textContent = "Page 1";
        return;
      }

      const fragment = document.createDocumentFragment();
      users.forEach((user) => {
        const card = templateEl.content.cloneNode(true);
        const article = card.querySelector(".user-card");
        article.dataset.userId = user.id;
        article.querySelector('[data-field="name"]').textContent =
          user.displayName;
        article.querySelector('[data-field="username"]').textContent =
          user.username;
        article.querySelector('[data-field="email"]').textContent = user.email;
        article.querySelector('[data-field="role"]').textContent = user.role;
        fragment.appendChild(card);
      });
      listEl.replaceChildren(fragment);

      messageEl.textContent = `Showing ${users.length} of ${pagination.totalItems || users.length} user(s).`;

      if (prevBtn) prevBtn.disabled = !pagination.hasPreviousPage;
      if (nextBtn) nextBtn.disabled = !pagination.hasNextPage;
      if (pageIndicator) {
        pageIndicator.textContent = `Page ${pagination.page || page} of ${pagination.totalPages || 1}`;
      }
    } catch (error) {
      messageEl.textContent = error.message;
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener("click", () => loadUsers(currentPage - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => loadUsers(currentPage + 1));
  }

  listEl.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const card = button.closest(".user-card");
    const userId = card?.dataset.userId;
    if (!userId) return;

    if (button.dataset.action === "edit") {
      const user = usersCache.get(userId);
      if (!user) {
        messageEl.textContent = "User not found in cache.";
        return;
      }

      selectedUserId = userId;
      formEl.elements.displayName.value = user.displayName;
      formEl.elements.username.value = user.username;
      formEl.elements.email.value = user.email;
      editMessageEl.textContent = "";
      dialogEl.showModal();
    }

    if (button.dataset.action === "delete") {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return;
      }

      try {
        const response = await fetch(
          `/users/api/${encodeURIComponent(userId)}`,
          {
            method: "DELETE",
          },
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.message || "Unable to delete user.");
        }

        await loadUsers(currentPage);
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
        await loadUsers(currentPage);
      } catch (error) {
        editMessageEl.textContent = error.message;
      }
    });
  }

  cancelEl?.addEventListener("click", () => {
    dialogEl.close();
  });

  await loadUsers(1);
};

document.addEventListener("DOMContentLoaded", () => {
  hookRegionSorter();
  hookSeasonSorter();
  hookTrainsCatalog();
  hookUsersManagement();
});
