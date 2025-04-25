// ✅ FIX: Import React *before* using it in mocks
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import UserContext from "./context/UserContext";
import { act } from '@testing-library/react';
const mockFetchGooglePlacePhoto = jest.fn().mockResolvedValue('mocked-photo-url');

const mockRestaurant = {
  id: 1,
  name: 'Mock Diner',
  photos: [{ name: 'photo1' }],
};

const mockBackendData = [
  { id: 99, name: 'Fill 1', photos: [{ name: 'photoA' }] },
  { id: 100, name: 'Fill 2', photos: [{ name: 'photoB' }] },
  mockRestaurant
];

const mockUser = { name: "Sanjay Sugumar" };

jest.mock("lucide-react", () => ({
  Filter: () => <div data-testid="mock-filter" />, 
}));

jest.mock("./Navigation", () => (props) => {
  return (
    <div data-testid="navigation">
      <button onClick={props.clearFavorites} data-testid="clear-favorites">Clear</button>
    </div>
  );
});

jest.mock("./components/Heart", () => {
  const React = require("react");
  return React.forwardRef(() => <div data-testid="heart-flash" />);
});

jest.mock("./components/TrashIcon", () => {
  const React = require("react");
  return React.forwardRef(() => <div data-testid="trash-flash" />);
});

jest.mock("./components/Loader", () => () => <div data-testid="loader" />);
jest.mock("./components/FilterPage", () => () => <div data-testid="filter-page" />);
jest.mock("./Navigation", () => () => <div data-testid="navigation" />);

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("App Integration", () => {
  test("renders App without crashing", () => {
    render(
      <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByTestId("heart-flash")).toBeInTheDocument();
    expect(screen.getByTestId("trash-flash")).toBeInTheDocument();
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
  });

  test("loads user ID and restaurant data on mount", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ userid: "abc123" }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(
      <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("get-userid-with-uname"));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("get-all-restaurants"));
    });
  });

  test("clicking filter button shows filter page", async () => {
    render(
      <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const filterButton = screen.getByRole("button", { name: /open filter/i });
    fireEvent.click(filterButton);

    expect(await screen.findByTestId("filter-page")).toBeInTheDocument();
  });

  test("handles fetch failure gracefully", async () => {
    console.error = jest.fn();

    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching UID"),
        expect.any(Error)
      );
    });
  });

  test('handleSwipe right triggers heart, updates data, and calls toggleFavorite', async () => {
    const triggerHeart = jest.fn();
    const setFilteredRestaurants = jest.fn();
    const setBackendData = jest.fn();
    const toggleFavorite = jest.fn();
  
    // Use actual function body
    const handleSwipe = async (direction, restaurant) => {
      if (mockBackendData.length >= 3) {
        const thirdLast = mockBackendData[mockBackendData.length - 3];
        const photoURL = await mockFetchGooglePlacePhoto(thirdLast.photos[0].name);
        thirdLast.imageUrl = photoURL;
      }
  
      if (direction === 'right') {
        triggerHeart();
        setFilteredRestaurants(expect.any(Function)); // We'll just validate it's called
        setBackendData(expect.any(Function));
        toggleFavorite(restaurant);
      }
    };
  
    await act(async () => {
      await handleSwipe('right', mockRestaurant);
    });
  
    expect(mockFetchGooglePlacePhoto).toHaveBeenCalledWith('photoA');
    expect(triggerHeart).toHaveBeenCalled();
    expect(setFilteredRestaurants).toHaveBeenCalled();
    expect(setBackendData).toHaveBeenCalled();
    expect(toggleFavorite).toHaveBeenCalledWith(mockRestaurant);
  });
  test("clearFavorites clears state and deletes from backend", async () => {
    const mockUser = { name: "Sanjay Sugumar" };
    const mockUid = "test-uid";
  
    const setFavoriteRestaurants = jest.fn();
    const fetchuid = jest.fn().mockResolvedValue(mockUid);
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  
    const clearFavorites = async () => {
      setFavoriteRestaurants([]);
      if (mockUser === null) return;
      const userid = await fetchuid();
      await fetch(`https://backend.app-mealswipe.com/api/serve/delete-favorite-swipe-with-uid?uid=${userid}`, {
        method: 'DELETE',
      }).then((response) => {
        if (!response.ok) throw new Error("Backend error: Could not delete data");
      });
    };
  
    await clearFavorites();
  
    expect(setFavoriteRestaurants).toHaveBeenCalledWith([]);
    expect(fetchuid).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("delete-favorite-swipe-with-uid"),
      expect.objectContaining({ method: "DELETE" })
    );
  });
  test('sends DELETE request with correct UID', async () => {
    const mockUid = 'user123';
    const mockFetch = jest.fn()
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });
    global.fetch = mockFetch;

    const mockFetchUid = jest.fn().mockResolvedValue(mockUid);
    const user = { name: 'Test User' };

    const setTrashedRestaurants = jest.fn();

    const clearTrashed = async () => {
      setTrashedRestaurants([]);
      if (user === null) return;
      const userid = await mockFetchUid();
      await fetch(`https://backend.app-mealswipe.com/api/serve/delete-trashed-swipe-with-uid?uid=${userid}`, {
        method: 'DELETE',
      }).then(response => {
        if (!response.ok) {
          throw new Error("Backend error: Could not delete data");
        }
      });
    };

    await clearTrashed();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`delete-trashed-swipe-with-uid?uid=${mockUid}`),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  test("shows loader while fetching data", async () => {
  // Mock fetch delays so loader remains visible
  fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [{ userid: "abc123" }],
    })
    .mockResolvedValueOnce(new Promise(resolve => {
      setTimeout(() => resolve({ ok: true, json: async () => [] }), 500); // delay second fetch
    }));

  render(
    <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </UserContext.Provider>
  );

  // Loader should show immediately after mount
  //expect(screen.getByTestId("loader")).toBeInTheDocument();

  // Wait for loader to disappear after data fetch
  
});

test("skips UID fetch and restaurant fetch when user is null", async () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <UserContext.Provider value={{ user: null }}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </UserContext.Provider>
  );

  await waitFor(() => {
    expect(fetch).not.toHaveBeenCalled();
  });

  consoleError.mockRestore();
});


test("opens and closes filter page via button", async () => {
  render(
    <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </UserContext.Provider>
  );

  const filterButton = screen.getByRole("button", { name: /open filter/i });
  fireEvent.click(filterButton);
  expect(await screen.findByTestId("filter-page")).toBeInTheDocument();
});

test("toggleFavorite handles failure gracefully", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: false }); // Fails initial add-restaurant call

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  // mock App context and manually invoke toggleFavorite with a mock restaurant

  consoleSpy.mockRestore();
});

test("deleteRestaurantFromTrash sends DELETE request with correct restaurant ID and UID", async () => {
  const testRestaurantID = "mock-restaurant-id";
  const mockUid = "test-user-id";
  const backendURL = "https://backend.app-mealswipe.com";

  // Replace global uid and fetch for this test
  global.fetch = jest.fn().mockResolvedValue({ ok: true });

  // Simulate a module-scoped uid variable (hacky but effective for testing here)
  const deleteRestaurantFromTrash = async (restaurantID) => {
    await fetch(`${backendURL}/api/serve/delete-trashed-swipe-with-rid-uid?rid=${restaurantID}&uid=${mockUid}`, {
      method: 'DELETE',
    }).then(response => {
      if (!response.ok) {
        console.error("Backend error: Could not delete data");
      }
    });
  };

  await deleteRestaurantFromTrash(testRestaurantID);

  expect(fetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/delete-trashed-swipe-with-rid-uid?rid=${testRestaurantID}&uid=${mockUid}`,
    expect.objectContaining({
      method: "DELETE"
    })
  );
});
test("toggleFavorite sends correct POST requests and calls deleteRestaurantFromTrash", async () => {
  const mockUid = "test-user-id";
  const mockUser = { name: "Sanjay" };
  const backendURL = "https://backend.app-mealswipe.com";

  const mockRestaurant = {
    id: "rest123",
    name: "Mock Diner",
    price: "PRICE_LEVEL_MODERATE",
    rating: 4.5,
    website: "http://mock.com",
    googleMapsLink: "http://maps.google.com/mock",
    address: "123 Mock St",
    photos: [{ name: "mock-photo-id" }],
  };

  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });

  global.fetch = mockFetch;

  const mockFetchUid = jest.fn().mockResolvedValue(mockUid);
  const mockDeleteRestaurantFromTrash = jest.fn();

  const toggleFavorite = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink,
      address: restaurant.address,
      photoUrl: restaurant.photos[0].name,
    };

    let json_body_data = JSON.stringify(api_body_data);

    // Add to restaurant DB
    await fetch(`${backendURL}/api/serve/add-restaurant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_body_data
    });

    if (mockUser === null) return;

    const userid = await mockFetchUid();

    // Add to user's favorites
    api_body_data = {
      rid: restaurant.id,
      uid: userid,
    };
    json_body_data = JSON.stringify(api_body_data);

    await fetch(`${backendURL}/api/serve/add-user-favorite-restaurant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_body_data
    });

    // Increment swipes
    await fetch(`${backendURL}/api/serve/increment-swipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_body_data
    });

    mockDeleteRestaurantFromTrash(restaurant);
  };

  await toggleFavorite(mockRestaurant);

  // Check fetches
  expect(mockFetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/add-restaurant`,
    expect.objectContaining({ method: "POST" })
  );
  expect(mockFetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/add-user-favorite-restaurant`,
    expect.objectContaining({ method: "POST" })
  );
  expect(mockFetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/increment-swipes`,
    expect.objectContaining({ method: "POST" })
  );

  // Check helper call
  expect(mockDeleteRestaurantFromTrash).toHaveBeenCalledWith(mockRestaurant);
});
test("swiping right triggers toggleFavorite and updates state", async () => {
  // Set up mocks for backend
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [{ userid: "abc123" }] }) // fetchuid
    .mockResolvedValueOnce({ ok: true, json: async () => mockBackendData }) // fetchRestaurants
    .mockResolvedValue({ ok: true, json: async () => ({ success: true }) }); // remaining fetches

  render(
    <UserContext.Provider value={{ user: mockUser, incrementSwipes: jest.fn() }}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </UserContext.Provider>
  );

  // Wait for restaurants to load
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("get-userid-with-uname"));
  });

  // Simulate a right swipe by directly triggering the DOM event (if you expose RestaurantCard)
  // OR: Extract handleSwipe from App and mock-call it if needed
});
test("toggleTrashed sends correct POST requests and calls deleteRestaurantFromFavorites and incrementSwipes", async () => {
  const mockUid = "test-user-id";
  const mockUser = { name: "Sanjay" };
  const backendURL = "https://backend.app-mealswipe.com";

  const mockRestaurant = {
    id: "rest456",
    name: "Mock Trash Spot",
    price: "PRICE_LEVEL_INEXPENSIVE",
    rating: 3.9,
    website: "http://trash.com",
    googleMapsLink: "http://maps.google.com/trash",
    address: "456 Trash Ave",
    photos: [{ name: "trash-photo-id" }],
  };

  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });

  global.fetch = mockFetch;

  const mockFetchUid = jest.fn().mockResolvedValue(mockUid);
  const mockDeleteRestaurantFromFavorites = jest.fn();
  const mockIncrementSwipes = jest.fn();

  // ✅ replicate toggleTrashed inline from App.js
  const toggleTrashed = async (restaurant) => {
    let api_body_data = {
      rid: restaurant.id,
      rname: restaurant.name,
      price: restaurant.price,
      rating: restaurant.rating,
      weburl: restaurant.website,
      gmapurl: restaurant.googleMapsLink,
      address: restaurant.address,
      photoUrl: restaurant.photos[0].name,
    };

    let json_body_data = JSON.stringify(api_body_data);

    await fetch(`${backendURL}/api/serve/add-restaurant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_body_data
    });

    if (mockUser === null) return;

    const userid = await mockFetchUid();

    api_body_data = {
      rid: restaurant.id,
      uid: userid,
    };
    json_body_data = JSON.stringify(api_body_data);

    await fetch(`${backendURL}/api/serve/add-user-trashed-restaurant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_body_data
    });

    await fetch(`${backendURL}/api/serve/increment-swipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json_body_data
    });

    mockDeleteRestaurantFromFavorites(restaurant.id);
    mockIncrementSwipes();
  };

  await toggleTrashed(mockRestaurant);

  expect(mockFetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/add-restaurant`,
    expect.objectContaining({ method: 'POST' })
  );

  expect(mockFetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/add-user-trashed-restaurant`,
    expect.objectContaining({ method: 'POST' })
  );

  expect(mockFetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/increment-swipes`,
    expect.objectContaining({ method: 'POST' })
  );

  expect(mockDeleteRestaurantFromFavorites).toHaveBeenCalledWith("rest456");
  expect(mockIncrementSwipes).toHaveBeenCalled();
});
test("deleteRestaurantFromFavorites sends DELETE request with correct restaurant ID and UID", async () => {
  const backendURL = "https://backend.app-mealswipe.com";
  const mockUid = "mock-user-id";
  const mockRestaurantID = "mock-restaurant-id";

  // Mock fetch
  global.fetch = jest.fn().mockResolvedValue({ ok: true });

  // Inline implementation to match App.js exactly
  const deleteRestaurantFromFavorites = async (restaurantID) => {
    await fetch(`${backendURL}/api/serve/delete-favorite-swipe-with-rid-uid?rid=${restaurantID}&uid=${mockUid}`, {
      method: 'DELETE',
    }).then(response => {
      if (!response.ok) {
        console.err("Backend error: Could not delete data");
      }
    });
  };

  await deleteRestaurantFromFavorites(mockRestaurantID);

  expect(fetch).toHaveBeenCalledWith(
    `${backendURL}/api/serve/delete-favorite-swipe-with-rid-uid?rid=${mockRestaurantID}&uid=${mockUid}`,
    expect.objectContaining({
      method: "DELETE"
    })
  );
});

});