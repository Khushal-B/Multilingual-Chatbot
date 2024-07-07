import axios from "axios";

const handleTranslate = async (text) => {
  const apiUrl =
    "https://dhruva-api.bhashini.gov.in/services/inference/pipeline";
  const jsonData = {
    pipelineTasks: [
      {
        taskType: "translation",
        config: {
          language: {
            sourceLanguage: "en",
            targetLanguage: "hi",
          },
          serviceId: "ai4bharat/indictrans-v2-all-gpu--t4",
        },
      },
    ],
    inputData: {
      input: [
        {
          source: text,
        },
      ],
    },
  };
  const headers = {
    Authorization:
      "PUT_VALUE_HERE",
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(apiUrl, jsonData, { headers });
    // Extract the "target" text from the response and return it
    return response.data.pipelineResponse[0].output[0].target;
  } catch (error) {
    // Handle error
    console.error("Error:", error.message);
    throw error; // Re-throw the error for handling in the caller
  }
};

export default handleTranslate;
