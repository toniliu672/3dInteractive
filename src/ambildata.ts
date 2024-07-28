const spreadsheetId = '1zVPwf9DwpLrcYqdkvTfAN7xByzEfQq9t5xKlMsX_4FE';
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

const ambilData = async () => {
  try {
    const osiResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A5:B11?key=${apiKey}`
    );
    if (!osiResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const osiData = await osiResponse.json();
    console.log("Fetched data:", osiData);

    return {
      physicalLayer: {
        title: osiData.values[0][0],
        description: osiData.values[0][1],
      },
      dataLinkLayer: {
        title: osiData.values[1][0],
        description: osiData.values[1][1],
      },
      networkLayer: {
        title: osiData.values[2][0],
        description: osiData.values[2][1],
      },
      transportLayer: {
        title: osiData.values[3][0],
        description: osiData.values[3][1],
      },
      sessionLayer: {
        title: osiData.values[4][0],
        description: osiData.values[4][1],
      },
      presentationLayer: {
        title: osiData.values[5][0],
        description: osiData.values[5][1],
      },
      applicationLayer: {
        title: osiData.values[6][0],
        description: osiData.values[6][1],
      },
    };
  } catch (error) {
    console.error('Error fetching data from Google Sheets', error);
    return {
      physicalLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
      dataLinkLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
      networkLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
      transportLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
      sessionLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
      presentationLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
      applicationLayer: {
        title: 'Error fetching data',
        description: 'Error fetching data',
      },
    };
  }
};

export default ambilData;
