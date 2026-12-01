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

    const searchInput = document.getElementById('trains-search');
    const typeFilter = document.getElementById('trains-type-filter');

    if (!listEl || !templateEl) {
        return;
    }

    let currentPage = 1;
    let totalPages = 1;
    let searchTimer;
    let latestRequest = 0;

    const loadTrains = async (page) => {
        const requestId = ++latestRequest;

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
            const params = new URLSearchParams();
            params.set('page', page);

            const search = searchInput?.value.trim() || '';
            const type = typeFilter?.value.trim() || '';

            if (search) {
                params.set('search', search);
            }

            if (type) {
                params.set('type', type);
            }

            const response = await fetch(`/api/trains?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to load trains (${response.status})`);
            }

            const payload = await response.json();

            // Ignore an older request if a newer one has started.
            if (requestId !== latestRequest) {
                return;
            }

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

            if (trains.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'No trains match your search or filter.';
                fragment.appendChild(emptyMessage);
            }

            listEl.replaceChildren(fragment);

            if (pageStatus) {
                pageStatus.textContent = `Page ${currentPage} of ${Math.max(totalPages, 1)}`;
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
            if (requestId !== latestRequest) {
                return;
            }

            if (loadingEl) {
                loadingEl.hidden = true;
            }

            if (errorEl) {
                errorEl.hidden = false;
                errorEl.textContent =
                    'Unable to load trains right now. Please try again in a moment.';
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

    // Search after the user pauses typing.
    searchInput?.addEventListener('input', () => {
        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
            loadTrains(1);
        }, 300);
    });

    // Apply the selected train type immediately.
    typeFilter?.addEventListener('change', () => {
        clearTimeout(searchTimer);
        loadTrains(1);
    });

    await loadTrains(currentPage);
};


document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
});