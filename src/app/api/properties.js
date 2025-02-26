// app/api/properties.js
export async function fetchProperties({
  skip = 0,
  limit = 100,
  description,
  region,
  category,
  min_price,
  max_price,
  min_square_meters,
  max_square_meters,
  bedrooms,
  bathrooms,
  energy_rating,
  platform,
} = {}) {
  try {
    const params = new URLSearchParams({
      ...(skip && { skip: skip.toString() }),
      ...(limit && { limit: limit.toString() }),
      ...(description && { description }),
      ...(region && { region }),
      ...(category && { category }),
      ...(min_price && { min_price: min_price.toString() }),
      ...(max_price && { max_price: max_price.toString() }),
      ...(min_square_meters && { min_square_meters: min_square_meters.toString() }),
      ...(max_square_meters && { max_square_meters: max_square_meters.toString() }),
      ...(bedrooms && { bedrooms: bedrooms.toString() }),
      ...(bathrooms && { bathrooms: bathrooms.toString() }),
      ...(energy_rating && { energy_rating }),
      ...(platform && { platform }),
    });

    const url = `https://real-estate-scraper-api.onrender.com/properties?${params}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export async function fetchPropertyByReference(reference) {
  try {
    const res = await fetch(
      `https://real-estate-scraper-api.onrender.com/properties/reference/${reference}`,
      {
        next: { revalidate: 3600 },
        credentials: "include", // Important for sending cookies
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch property with reference ${reference}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching property with reference ${reference}:`, error);
    return null;
  }
}

export async function fetchPropertyById(propertyId) {
  try {
    const res = await fetch(
      `https://real-estate-scraper-api.onrender.com/properties/${propertyId}`,
      {
        next: { revalidate: 3600 },
        credentials: "include", // Important for sending cookies
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch property with ID ${propertyId}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching property with ID ${propertyId}:`, error);
    return null;
  }
}
