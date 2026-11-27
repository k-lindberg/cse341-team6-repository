# Kizuna Rail Feature Set 3: Bookings Spec

## Goal

Refactor the existing booking functionality to use a dedicated bookings collection and Mongoose model. Create an API endpoint for retrieving bookings, add a bookings administration page powered by client-side hydration, and update existing booking logic to use the new bookings model.

## Data Model

Booking documents will be stored in the bookings collection.

Required booking fields:
- `id`: string, required, unique confirmation code
- `scheduleId`: number, required
- `tripId`: string, required
- `ticketClass`: string, required
- `selectedDay`: string, required
- `passengers`: array, required

Passenger objects contain:
- `firstName`: string, required
- `lastName`: string, required
- `email`: string, required
- `phone`: string, required

Mongoose timestamps should automatically provide:
- `createdAt`
- `updatedAt`

Example booking document:
{
  "id": "KR123456",
  "scheduleId": 12,
  "tripId": "t1",
  "ticketClass": "first",
  "selectedDay": "2026-11-13",
  "passengers": [
    {
      "firstName": "Kristin",
      "lastName": "Lindberg",
      "email": "example@email.com",
      "phone": "555-123-4567"
    }
  ]
}

## Existing Confirmation Refactor

The existing implementation uses the term confirmation.

As part of this feature:
- Existing confirmation records should be renamed to bookings.
- Existing confirmation-related code should be updated to use booking terminology.
- Confirmation pages should retrieve booking data from the bookings collection.

## Booking Model Functions

### createBooking

Purpose: Create a new booking document.

Input:
- Complete booking data
- Passenger information

Returns:
- Newly created booking document

### getAllBookings

Purpose: Retrieve all booking documents.

Returns:
- Array of booking objects

### getBookingById

Purpose: Retrieve a booking by confirmation code.

Input:
- Booking id

Returns:
- Matching booking document

## API Routes

### GET /api/bookings

Purpose: Return all bookings.

Success:
- Status code: 200
- Response body: array of booking objects

Example response:
[
  {
    "id": "KR123456",
    "tripId": "t1",
    "scheduleId": 12,
    "ticketClass": "first"
  }
]

Errors:
- `500` if an unexpected server or database error occurs

Example error response:
{ "error": "Failed to fetch bookings" }

---

## Existing Booking Route Refactor

The following booking routes must continue to function after the refactor:

### GET /trips/booking/:scheduleId

Purpose:
- Display booking page for a schedule

### POST /trips/book

Purpose:
- Create a new booking
- Generate confirmation code
- Save booking using the bookings model
- Redirect to confirmation page

### GET /trips/confirmation/:bookingId

Purpose:
- Display booking confirmation details

## Bookings Administration Page

### Route

GET /bookings-admin

Purpose:
- Display all bookings for administrative review

### Controller

Render the bookings page shell.

The controller should not directly fetch booking data for display.

### Client-Side Hydration

The page must:
1. Load initially without booking data.
2. Use JavaScript to call /api/bookings.
3. Receive booking data as JSON.
4. Populate the page dynamically using HTML templates.
5. Avoid EJS loops for rendering booking records.

The implementation should follow the same hydration pattern used by the trains page.

### Displayed Information

Each booking card should display:
- Booking ID
- Trip ID
- Schedule ID
- Ticket Class
- Selected Day
- Passenger Count

## Swagger Documentation

Swagger documentation must exist for:

### GET /api/bookings

Documentation should include:

- Route summary
- Success response
- Error response
- Booking schema reference

The route must be testable through Swagger.

## Test Plan

### Booking Creation

1. Navigate to a trip booking page.
2. Enter valid booking information.
3. Submit booking form.
4. Verify redirect to confirmation page.
5. Verify booking appears in MongoDB.

Expected Result:
- Booking document created successfully.

### Booking API

1. Navigate to /api/bookings.

Expected Result:
- Status code 200
- JSON response returned
- Existing bookings included in response

### Bookings Admin Page

1. Navigate to /bookings-admin.

Expected Result:
- Page loads successfully.
- Client-side JavaScript requests /api/bookings.
- Booking data appears on page.
- No EJS loops are used to render bookings.

### Confirmation Page

1. Create a booking.
2. Follow redirect to confirmation page.

Expected Result:
- Confirmation page loads.
- Booking information is displayed correctly.
- Passenger contact information is shown correctly.

## Deployment Expectations

After implementation:
- Booking creation must work locally and on Render.
- /api/bookings must work locally and on Render.
- /bookings-admin must load bookings dynamically from the API.
- Swagger documentation must be accessible through /api-docs.
- Booking records must be stored in the bookings collection.
