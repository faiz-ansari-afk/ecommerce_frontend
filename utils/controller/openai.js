// import { OpenAIApi } from 'openai';

// const openai = new OpenAIApi({
//   apiKey: process.env.CHATGPT_KEY
// });

// export const searchProductsFromAI = async (query, products) => {
//     ////console.log(openai)
//   const searchQuery = `
//     Find the product from this array:
//     ${JSON.stringify(products, null, 2)}
//     that best matches the following criteria:

//     ${query}

//     Sort the results by the following relevance criteria:
//     - 1. Matched keywords in the product name
//     - 2. Matched keywords in the product description
//     - 3. Matched keywords in the variant options
//     - 4. Lowest price
//   `;

//   const response = await openai.completions.create({
//     engine: 'davinci',
//     prompt: searchQuery,
//     maxTokens: 1000,
//     n: 1,
//     stop: ['\n']
//   });

//   const searchResult = response.choices[0].text.trim();
//   return JSON.parse(searchResult);
// };

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Replace with your API key
});

export const searchProductsFromAI = async (query, products) => {
  ////console.log(JSON.stringify(products, null, 2));
  const prompt = `
    Find the product from this array:
    ${JSON.stringify(products, null, 2)}
    that best matches the following criteria:
  
    ${query}
  
    Sort the results by the following relevance criteria:
    - 1. Matched keywords in the product name
    - 2. Matched keywords in the product description
    - 3. Matched keywords in the variant options
    Return matched products in array of object like {
        name: 'product name here'
        image : 'product image'
    }
  `;

  const searchProducts = async (
    prompt,
    model = 'davinci',
    temperature = 0.2,
    maxTokens = 256,
    topP = 1,
    frequencyPenalty = 0,
    presencePenalty = 0
  ) => {
    const openai = new OpenAIApi(configuration);
    ////console.log("openai",openai)
    const headers = {
    //   ...openai.defaults.headers.common,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    };
    const response = await openai.createCompletion({
      headers,
      model,
      prompt,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
    });

    return response.data.choices[0].text.trim();
  };
  searchProducts();
};
