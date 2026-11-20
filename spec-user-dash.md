# Kizuna Rail Feature Set 2: User Dashboard and Navigation Spec

## Goal

Create a standard user dashboard that provides personalized booking information and account navigation. Update application navigation to support authentication workflows and role-based dashboard access.

## User Dashboard

### Route

GET /dashboard

Purpose:
- Display a dashboard for authenticated users.
- Provide access to user-specific information and navigation links.
- Serve as the default landing page after login for non-admin users.

### Controller

Render the dashboard page shell.

The controller should:
- Pass the authenticated user's session information to the view.
- Render the dashboard without directly fetching booking data.

Example:

```js
res.render('user-dashboard', {
    title: 'Dashboard',
    user: req.session.user
});
```

## Dashboard Display Requirements

The dashboard page must display:

### Welcome Message

Display the currently authenticated user's display name.

Example:

```text
Welcome to the Dashboard
You are signed in as Kristin Lindberg.
```

### Quick Links

The dashboard should provide links to:

- Booking Administration Page
- User Administration Page

Example:

```text
Manage Bookings
Manage Users
```

### User Bookings Section

A bookings section should be displayed on the dashboard.

The section should:
- Be hydrated dynamically through a client-side API request.
- Display bookings associated with the currently authenticated user.

## User Bookings API

### GET /api/bookings/me

Purpose:
- Return all bookings where the authenticated user's email matches one of the booking passengers.

Authentication:
- User must be logged in.

Filtering Logic:

A booking is included when:

```js
booking.passengers.some(
    passenger => passenger.email === req.session.user.email
)
```

### Success Response

Status Code:

```text
200
```

Response:

```json
[
  {
    "id": "KR123456",
    "tripId": "t1",
    "scheduleId": 12,
    "ticketClass": "first"
  }
]
```

### Empty Response

If no matching bookings exist:

```json
[]
```

### Error Response

Status Code:

```text
500
```

Response:

```json
{
  "error": "Failed to fetch user bookings"
}
```

## Client-Side Hydration

The implementation should follow the same hydration pattern used elsewhere in the application.

### Dashboard Loading Flow

1. User navigates to /dashboard.
2. Dashboard page renders.
3. Client-side JavaScript executes after page load.
4. JavaScript calls:

```text
GET /api/bookings/me
```

5. Booking data is returned as JSON.
6. Dashboard updates dynamically.

### Empty State

If no bookings are returned:

```text
No bookings found.
```

### Error State

If the API request fails:

```text
Unable to load bookings at this time.
```

## Navigation Updates

### Unauthenticated Users

The header should display:

- Login
- Register

The following links should not be displayed:

- Dashboard
- Logout

### Authenticated Users

The header should display:

- Dashboard
- Logout

The following links should not be displayed:

- Login
- Register

## Dashboard Routing

### Standard Users

The Dashboard link should navigate to:

```text
/dashboard
```

### Admin Users

The Dashboard link should navigate to:

```text
/admin/dashboard
```

## Login Redirect Behavior

### Admin Users

After successful login:

```text
/admin/dashboard
```

### Standard Users

After successful login:

```text
/dashboard
```

## Test Plan

### Dashboard Access

1. Register a new user.
2. Log in.
3. Verify redirect to /dashboard.

Expected Result:
- Dashboard page loads successfully.

### Welcome Message

1. Log in with a valid account.
2. Open the dashboard.

Expected Result:
- Display name is shown correctly.

### Navigation Visibility

Unauthenticated:

Expected Result:
- Login and Register are visible.
- Dashboard and Logout are hidden.

Authenticated:

Expected Result:
- Dashboard and Logout are visible.
- Login and Register are hidden.

### Dashboard Link

1. Log in as a standard user.
2. Click Dashboard.

Expected Result:
- User is directed to /dashboard.

1. Log in as an admin user.
2. Click Dashboard.

Expected Result:
- User is directed to /admin/dashboard.

### User Bookings API

1. Log in with a user account.
2. Navigate to /api/bookings/me.

Expected Result:
- JSON array returned.
- Only bookings matching the user's email are included.

### Dashboard Bookings Section

1. Create a booking using the logged-in user's email.
2. Navigate to /dashboard.

Expected Result:
- Booking appears in the My Bookings section.

### Empty Booking State

1. Log in with a user that has no bookings.
2. Navigate to /dashboard.

Expected Result:
- "No bookings found." message displayed.

## Deployment Expectations

After implementation:

- Dashboard loads locally and on Render.
- User-specific bookings load through the API.
- Login redirects function correctly.
- Navigation links are displayed based on authentication state.
- Dashboard routes correctly based on user role.
- User booking data is displayed dynamically without page refresh.