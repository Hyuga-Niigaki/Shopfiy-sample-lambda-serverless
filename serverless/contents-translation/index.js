require('dotenv').config();
console.log(process.env.SHOPIFY_STORE_URL);
const axios = require('axios');

const shopifyGraphQLEndpoint = `https://${process.env.SHOPIFY_STORE_URL}/admin/api/2024-10/graphql.json`;

module.exports.handler = async (event) => {
  try {
    // GraphQL クエリ: Shop情報を取得
    const query = `
      query {
        shop {
          name
          myshopifyDomain
          primaryDomain {
            url
            host
          }
          email
          currencyCode
          plan {
            displayName
          }
        }
      }
    `;

    // Shopify APIリクエストの設定
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
    };

    // GraphQLエンドポイントにリクエスト
    const response = await axios.post(
      shopifyGraphQLEndpoint,
      { query },
      { headers }
    );

    // Shopify APIのレスポンスをLambdaの出力として返却
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Shopify GraphQL API call succeeded!',
        data: response.data.data.shop,
      }),
    };
  } catch (error) {
    console.error('Error calling Shopify GraphQL API:', error);

    // エラーが発生した場合のレスポンス
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        message: 'Shopify GraphQL API call failed',
        error: error.message,
      }),
    };
  }
};