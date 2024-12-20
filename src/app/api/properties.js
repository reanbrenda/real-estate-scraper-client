// app/api/properties.js
export async function fetchProperties() {
  try {
    const res = await fetch('https://real-estate-scraper-api.onrender.com/properties', {
      next: { revalidate: 300 },
      credentials: 'include' // Important for sending cookies
    });

    if (!res.ok) {
      throw new Error('Failed to fetch properties');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export async function fetchPropertyByReference(reference) {
  try {
    const res = await fetch(`https://real-estate-scraper-api.onrender.com/properties/reference/${reference}`, {
      next: { revalidate: 3600 },
      credentials: 'include' // Important for sending cookies
    });

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
    const res = await fetch(`https://real-estate-scraper-api.onrender.com/properties/${propertyId}`, {
      next: { revalidate: 3600 },
      credentials: 'include' // Important for sending cookies
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch property with ID ${propertyId}`);
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching property with ID ${propertyId}:`, error);
    return null;
  }
}