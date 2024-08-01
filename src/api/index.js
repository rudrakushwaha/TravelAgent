export const getPlacesData = async (type, sw, ne) => {
  try {
    console.log(sw);
    console.log(ne);

    // Construct the URL with query parameters
    const url = new URL(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`);
    url.searchParams.append('bl_latitude', sw.lat);
    url.searchParams.append('tr_latitude', ne.lat);
    url.searchParams.append('bl_longitude', sw.lng);
    url.searchParams.append('tr_longitude', ne.lng);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPID_API_KEY,
        'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
      }
    });

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
