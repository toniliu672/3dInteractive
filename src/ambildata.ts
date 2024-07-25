const spreadsheetId = '1zVPwf9DwpLrcYqdkvTfAN7xByzEfQq9t5xKlMsX_4FE';
const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

const ambilData = async () => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A2:B2?key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return {
      popup1: data.values[0][0],
      popup2: data.values[0][1],
    };
  } catch (error) {
    console.error('Error fetching data from Google Sheets', error);
    return {
      popup1: 'Error fetching data',
      popup2: 'Error fetching data',
    };
  }
};

export default ambilData;
